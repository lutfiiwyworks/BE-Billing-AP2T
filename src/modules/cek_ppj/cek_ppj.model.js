import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

const VIEW_CONFIG = {
  default: {
    oracle: "dtks.cek_ppj_lebih3",
    postgres: "kunabakti.cek_ppj_lebih3",
  },
  bedaProsen: {
    oracle: "dtks.cek_ppj",
    postgres: "kunabakti.cek_ppj",
  },
};

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

const getCekPpj = async ({ thblrek, onlyDifferent }) => {
  const pgPool = getPgPool();
  const viewConfig = onlyDifferent ? VIEW_CONFIG.bedaProsen : VIEW_CONFIG.default;

  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();
      const columns = await getOracleColumns(oraConn, viewConfig.oracle);
      const orderColumns = ["THBLREK", "IDPEL"].filter((column) =>
        columns.has(column)
      );

      let sql = `
        SELECT *
        FROM ${viewConfig.oracle}
        WHERE THBLREK = :thblrek
      `;

      const binds = { thblrek };

      if (onlyDifferent) {
        sql += ` AND PROSENPPJ <> PROSEN_CEK`;
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
    const columns = await getPostgresColumns(pgPool, viewConfig.postgres);
    const orderColumns = ["thblrek", "idpel"].filter((column) =>
      columns.has(column)
    );

    let sql = `
      SELECT *
      FROM ${viewConfig.postgres}
      WHERE thblrek = $1
    `;

    const values = [thblrek];

    if (onlyDifferent) {
      sql += ` AND prosenppj <> prosen_cek`;
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

export default { getCekPpj };
