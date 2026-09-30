import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

const ORACLE_VIEW = "DTKS.VW_PKS_TRFLWBP_2000";
const POSTGRES_VIEW = "kunabakti.vw_pks_trflwbp_2000";

const splitViewName = (fullName) => {
  const [schema, view] = fullName.split(".");
  return { schema, view };
};

const getOracleColumns = async (conn, fullName) => {
  const { schema, view } = splitViewName(fullName);
  const result = await conn.execute(
    `
      SELECT column_name
      FROM all_tab_columns
      WHERE owner = :owner
      AND table_name = :tableName
    `,
    {
      owner: schema.toUpperCase(),
      tableName: view.toUpperCase(),
    },
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    }
  );

  return new Set(result.rows.map((row) => row.COLUMN_NAME.toUpperCase()));
};

const getPostgresColumns = async (pgPool, fullName) => {
  const { schema, view } = splitViewName(fullName);
  const result = await pgPool.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = $1
      AND table_name = $2
    `,
    [schema, view]
  );

  return new Set(result.rows.map((row) => row.column_name.toLowerCase()));
};

const getCekPksTrflwbp2000 = async ({
  thblrek,
  unitupi,
  idpel,
  trflwbpLebih2000 = false,
}) => {
  const pgPool = getPgPool();

  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();
      const columns = await getOracleColumns(oraConn, ORACLE_VIEW);
      const orderColumns = ["THBL_AWAL", "THBL_AKHIR", "UNITUPI", "IDPEL"].filter(
        (column) => columns.has(column)
      );

      let sql = `
        SELECT *
        FROM ${ORACLE_VIEW}
        WHERE :thblrek BETWEEN THBL_AWAL AND THBL_AKHIR
      `;

      const binds = { thblrek };

      if (trflwbpLebih2000) {
        sql += ` AND TRFLWBP > 2000`;
      }

      if (unitupi && columns.has("UNITUPI")) {
        sql += ` AND UNITUPI = :unitupi`;
        binds.unitupi = unitupi;
      }

      if (idpel && columns.has("IDPEL")) {
        sql += ` AND IDPEL = :idpel`;
        binds.idpel = idpel;
      }

      if (orderColumns.length > 0) {
        sql += ` ORDER BY ${orderColumns.join(", ")}`;
      }



      const result = await oraConn.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      return result.rows.map((row) => ({
        source: "oracle",
        ...row,
      }));
    } finally {
      if (oraConn) await oraConn.close();
    }
  };

  const postgresQuery = async () => {
    const columns = await getPostgresColumns(pgPool, POSTGRES_VIEW);
    const orderColumns = ["thbl_awal", "thbl_akhir", "unitupi", "idpel"].filter(
      (column) => columns.has(column)
    );

    let sql = `
      SELECT *
      FROM ${POSTGRES_VIEW}
      WHERE $1 BETWEEN thbl_awal AND thbl_akhir
    `;

    const values = [thblrek];
    let idx = 2;

    if (trflwbpLebih2000) {
      sql += ` AND trflwbp > 2000`;
    }

    if (unitupi && columns.has("unitupi")) {
      sql += ` AND unitupi = $${idx}`;
      values.push(unitupi);
      idx++;
    }

    if (idpel && columns.has("idpel")) {
      sql += ` AND idpel = $${idx}`;
      values.push(idpel);
      idx++;
    }

    if (orderColumns.length > 0) {
      sql += ` ORDER BY ${orderColumns.join(", ")}`;
    }


    const result = await pgPool.query(sql, values);

    return result.rows.map((row) => ({
      source: "postgres",
      ...row,
    }));
  };

  const [oracleRows, postgresRows] = await Promise.all([
    oracleQuery(),
    postgresQuery(),
  ]);

  return [...oracleRows, ...postgresRows];
};

export default { getCekPksTrflwbp2000 };
