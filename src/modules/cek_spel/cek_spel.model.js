import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";


const getCekPlgSpel = async ({ thblrek, excludeRptl53950 }) => {
  const pgPool = getPgPool();

  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();

      let sql = `
        SELECT *
        FROM DTKS.cek_pelanggan_spel
        WHERE THBLREK = :thblrek
      `;

      const binds = { thblrek };

      if (excludeRptl53950) {
        sql += ` AND rpptl <> '53950'`;
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
    let sql = `
      SELECT *
      FROM kunabakti.cek_pelanggan_spel
      WHERE thblrek = $1
    `;

    const values = [thblrek];

    if (excludeRptl53950) {
      sql += ` AND rpptl <> '53950'`;
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

export default { getCekPlgSpel };
