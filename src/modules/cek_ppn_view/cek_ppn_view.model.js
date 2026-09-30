import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

const VIEW_CONFIGS = {
  sewatrafo: {
    oracle: "dtks.cek_ppn_sewatrafo",
    postgres: "kunabakti.cek_ppn_sewatrafo",
  },
  bptrafo: {
    oracle: "dtks.cek_ppn_bptrafo",
    postgres: "kunabakti.cek_ppn_bptrafo",
  },
  sewakap: {
    oracle: "dtks.cek_ppn_sewakap",
    postgres: "kunabakti.cek_ppn_sewakap",
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

const getCekPpnView = async ({ key, thblrek, unitupi, idpel, limit }) => {
  const config = VIEW_CONFIGS[key];
  const pgPool = getPgPool();

  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();
      const columns = await getOracleColumns(oraConn, config.oracle);
      const orderColumns = ["THBLREK", "UNITUPI", "IDPEL"].filter((column) =>
        columns.has(column)
      );

      let sql = `
        SELECT *
        FROM ${config.oracle}
        WHERE THBLREK = :thblrek
      `;

      const binds = { thblrek };

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
    const columns = await getPostgresColumns(pgPool, config.postgres);
    const orderColumns = ["thblrek", "unitupi", "idpel"].filter((column) =>
      columns.has(column)
    );

    let sql = `
      SELECT *
      FROM ${config.postgres}
      WHERE thblrek = $1
    `;

    const values = [thblrek];
    let idx = 2;

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

export default { getCekPpnView };