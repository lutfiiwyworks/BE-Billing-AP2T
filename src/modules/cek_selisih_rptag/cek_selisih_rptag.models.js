import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

const getCekSelisihRpTag = async ({ thblrek, idpel, unitupi, limit }) => {
  const pgPool = getPgPool();

 
  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();
      let sql = `
        SELECT *
        FROM DTKS.VWCEK_SELISIH_RPTAG_AP2T
        WHERE 1=1
      `;

      const binds = {};

      if (thblrek) {
        sql += ` AND THBLREK = :thblrek`;
        binds.thblrek = thblrek;
      }

      if (idpel) {
        sql += ` AND IDPEL = :idpel`;
        binds.idpel = idpel;
      }

      if (unitupi) {
        sql += ` AND UNITUPI = :unitupi`;
        binds.unitupi = unitupi;
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
      FROM opharapp.vwcek_selisih_rptag_newap2t
      WHERE 1=1
    `;

    const values = [];
    let idx = 1;

    if (thblrek) {
      sql += ` AND thblrek = $${idx}`;
      values.push(thblrek);
      idx++;
    }

    if (idpel) {
      sql += ` AND idpel = $${idx}`;
      values.push(idpel);
      idx++;
    }

    if (unitupi) {
      sql += ` AND unitupi = $${idx}`;
      values.push(unitupi);
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

export default { getCekSelisihRpTag };
