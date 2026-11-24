import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPoolOltp2 } from "../../config/pg.js";

const getValidasiClosingBilling = async ({ thblrek, limit }) => {
  const pgPool = getPgPoolOltp2();

 
  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();
      let sql = `
        SELECT *
        FROM DTKS.validasi_closing_billing
        WHERE 1=1
      `;

      const binds = {};

      if (thblrek) {
        sql += ` AND THBLREK = :thblrek`;
        binds.thblrek = thblrek;
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

  // ================= POSTGRES =================
  const postgresQuery = async () => {
    let sql = `
      SELECT *
      FROM opharapp.validasi_closing_billing
      WHERE 1=1
    `;

    const values = [];
    let idx = 1;

    if (thblrek) {
      sql += ` AND thblrek = $${idx}`;
      values.push(thblrek);
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

export default { getValidasiClosingBilling };
