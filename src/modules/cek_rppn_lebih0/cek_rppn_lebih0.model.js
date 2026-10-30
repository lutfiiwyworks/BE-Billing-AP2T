import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

const getCekRppnLebih0 = async ({ thblrek, idpel, limit }) => {
  const pgPool = getPgPool();

  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();

      let sql = `
        SELECT *
        FROM dtks.cek_rppn_lebih0
        WHERE THBLREK = :thblrek
      `;

      const binds = { thblrek };

      if (idpel) {
        sql += ` AND IDPEL = :idpel`;
        binds.idpel = idpel;
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
      FROM kunabakti.cek_rppn_lebih0
      WHERE thblrek = $1
    `;

    const values = [thblrek];
    let idx = 2;

    if (idpel) {
      sql += ` AND idpel = $${idx}`;
      values.push(idpel);
      idx++;
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

export default { getCekRppnLebih0 };
