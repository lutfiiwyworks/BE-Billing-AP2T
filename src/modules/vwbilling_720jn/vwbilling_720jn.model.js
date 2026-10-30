import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

const getVwbilling720jn = async ({ thblrek, unitupi, idpel, kondisi, limit }) => {
  const pgPool = getPgPool();

  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();

      let sql = `
        SELECT *
        FROM DTKS.VWBILLING_720JN
        WHERE THBLREK = :thblrek
        AND POSTINGBILLING = '3'
      `;

      const binds = { thblrek };

      if (kondisi === "BR") {
        sql += ` AND JAMNYALA_BR > '720'`;
      }

      if (kondisi === "LM") {
        sql += ` AND JAMNYALA_LM > '720'`;
      }

      if (unitupi) {
        sql += ` AND UNITUPI = :unitupi`;
        binds.unitupi = unitupi;
      }

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
      FROM kunabakti.vwbilling_720jn
      WHERE thblrek = $1
      AND postingbilling = '3'
    `;

    const values = [thblrek];
    let idx = 2;

    if (kondisi === "BR") {
      sql += ` AND jamnyala_br > '720'`;
    }

    if (kondisi === "LM") {
      sql += ` AND jamnyala_lm > '720'`;
    }

    if (unitupi) {
      sql += ` AND unitupi = $${idx}`;
      values.push(unitupi);
      idx++;
    }

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

export default { getVwbilling720jn };
