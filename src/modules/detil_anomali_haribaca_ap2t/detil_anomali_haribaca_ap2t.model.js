import ExcelJS from "exceljs";
import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";

const TABLE_NAME = "dtks.DETIL_ANOMALI_HARIBACA_AP2T";
const EXCEL_MAX_ROWS = 1048576;
const EXPORT_BATCH_SIZE = 5000;

const SORT_FIELDS = {
  THBLREK: "THBLREK",
  UNITUPI: "UNITUPI",
  UNITAP: "UNITAP",
  UNITUP: "UNITUP",
  IDPEL: "IDPEL",
  NAMA: "NAMA",
  TARIF: "TARIF",
  DAYA: "DAYA",
  ALAMAT: "ALAMAT",
  TGLBACALALU: "TGLBACALALU",
  TGLBACAAKHIR: "TGLBACAAKHIR",
  RPTAG: "RPTAG",
  RPPTL: "RPPTL",
  PEMKWH: "PEMKWH",
  JAMNYALA: "JAMNYALA",
};

const SEARCH_FIELDS = [
  "NAMA",
  "IDPEL",
  "UNITUPI",
  "UNITAP",
  "UNITUP",
  "THBLREK",
];

const normalizeSort = ({ sortField, sortOrder }) => {
  const fieldKey = String(sortField || "THBLREK").trim().toUpperCase();
  const orderKey = String(sortOrder || "ASC").trim().toUpperCase();

  return {
    field: SORT_FIELDS[fieldKey] || SORT_FIELDS.THBLREK,
    order: orderKey === "DESC" ? "DESC" : "ASC",
  };
};

const buildOrderBy = ({ sortField, sortOrder }) => {
  const secondarySort = sortField === "IDPEL" ? "" : ", IDPEL ASC";

  return `${sortField} ${sortOrder}${secondarySort}`;
};

const buildWhereClause = ({ thblrek, unitupi, idpel, search }) => {
  const filters = ["1=1"];
  const binds = {};

  if (thblrek) {
    filters.push("THBLREK = :thblrek");
    binds.thblrek = thblrek;
  }

  if (unitupi) {
    filters.push("UNITUPI = :unitupi");
    binds.unitupi = unitupi;
  }

  if (idpel) {
    filters.push("IDPEL = :idpel");
    binds.idpel = idpel;
  }

  if (search) {
    filters.push(
      `(${SEARCH_FIELDS.map(
        (field) => `UPPER(${field}) LIKE '%' || UPPER(:search) || '%'`
      ).join(" OR ")})`
    );
    binds.search = search;
  }

  return {
    whereClause: filters.join(" AND "),
    binds,
  };
};

const buildListSql = ({ whereClause, orderBy }) => `
SELECT *
FROM (
    SELECT
        a.*,
        ROWNUM rn
    FROM (
        SELECT *
        FROM ${TABLE_NAME}
        WHERE ${whereClause}
        ORDER BY ${orderBy}
    ) a
    WHERE ROWNUM <= :endRow
)
WHERE rn >= :startRow
`;

const buildExportSql = ({ whereClause, orderBy }) => `
  SELECT *
  FROM ${TABLE_NAME}
  WHERE ${whereClause}
  ORDER BY ${orderBy}
`;

const getTotal = async ({ connection, whereClause, binds }) => {
  const result = await connection.execute(
    `
      SELECT COUNT(*) AS TOTAL
      FROM ${TABLE_NAME}
      WHERE ${whereClause}
    `,
    binds,
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  return Number(result.rows?.[0]?.TOTAL || 0);
};

const getDetilAnomaliHaribacaAp2t = async ({
  thblrek,
  unitupi,
  idpel,
  search,
  sortField,
  sortOrder,
  limit,
  offset,
}) => {
  let oraConn;

  try {
    oraConn = await getConnection();

    const { whereClause, binds } = buildWhereClause({
      thblrek,
      unitupi,
      idpel,
      search,
    });
    const sort = normalizeSort({ sortField, sortOrder });
    const orderBy = buildOrderBy({
      sortField: sort.field,
      sortOrder: sort.order,
    });

    const total = await getTotal({ connection: oraConn, whereClause, binds });
    const sql = buildListSql({
  whereClause,
  orderBy,
});

const result = await oraConn.execute(
  sql,
  {
    ...binds,
    startRow: offset + 1,
    endRow: offset + limit,
  },
  {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
    fetchArraySize: limit,
  }
);  

    return {
      total,
      data: result.rows.map((row) => ({
        source: "oracle",
        ...row,
      })),
    };
  } finally {
    if (oraConn) await oraConn.close();
  }
};

const addWorksheet = ({ workbook, sheetNumber, columns }) => {
  const worksheet = workbook.addWorksheet(`Sheet${sheetNumber}`);

  worksheet.columns = columns.map((column) => ({
    header: column,
    key: column,
    width: 18,
  }));
  worksheet.getRow(1).commit();

  return {
    worksheet,
    rowCount: 1,
  };
};

const sanitizeExcelValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return /^[=+\-@]/.test(value) ? `'${value}` : value;
};

const sanitizeExcelRow = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, sanitizeExcelValue(value)])
  );

const exportDetilAnomaliHaribacaAp2t = async ({
  thblrek,
  unitupi,
  idpel,
  search,
  sortField,
  sortOrder,
  stream,
}) => {
  let oraConn;
  let resultSet;

  try {
    oraConn = await getConnection();

    const { whereClause, binds } = buildWhereClause({
      thblrek,
      unitupi,
      idpel,
      search,
    });
    const sort = normalizeSort({ sortField, sortOrder });
    const orderBy = buildOrderBy({
      sortField: sort.field,
      sortOrder: sort.order,
    });

    const result = await oraConn.execute(
      buildExportSql({
        whereClause,
        orderBy,
      }),
      binds,
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        resultSet: true,
        fetchArraySize: EXPORT_BATCH_SIZE,
      }
    );

    resultSet = result.resultSet;

    const columns = result.metaData.map((column) => column.name);
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream,
      useStyles: false,
      useSharedStrings: false,
    });

    let sheetNumber = 1;
    let currentSheet = addWorksheet({ workbook, sheetNumber, columns });
    let totalRows = 0;

    while (true) {
      const rows = await resultSet.getRows(EXPORT_BATCH_SIZE);

      if (!rows.length) {
        break;
      }

      for (const row of rows) {
        if (currentSheet.rowCount >= EXCEL_MAX_ROWS) {
          currentSheet.worksheet.commit();
          sheetNumber += 1;
          currentSheet = addWorksheet({ workbook, sheetNumber, columns });
        }

        currentSheet.worksheet.addRow(sanitizeExcelRow(row)).commit();
        currentSheet.rowCount += 1;
        totalRows += 1;
      }
    }

    currentSheet.worksheet.commit();
    await workbook.commit();

    return totalRows;
  } finally {
    if (resultSet) await resultSet.close();
    if (oraConn) await oraConn.close();
  }
};

export default {
  getDetilAnomaliHaribacaAp2t,
  exportDetilAnomaliHaribacaAp2t,
};
