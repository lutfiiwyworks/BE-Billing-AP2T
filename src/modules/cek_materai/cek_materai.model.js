import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

export const MATERAI_RULES = {
  MATERAI_LAMA: `
    rpmat IN ('3000','6000')
  `,

  MATERAI_5JT: `
    rptag > 5000000
    AND rpmat <> '10000'
  `,

  MATERAI_DIBAWAH_5JT: `
    rptag <= 5000000
    AND rpmat > 0
  `,
};

const getCekMaterai = async ({ thblrek, idpel, unitupi, rule, limit }) => {
  const pgPool = getPgPool();
  const ruleSql = MATERAI_RULES[rule];

  // ================= ORACLE =================
  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();
      let sql = `
        SELECT *
        FROM DTKS.VW_VALIDASI_MATERAI
        WHERE 1=1
        AND (${ruleSql})
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
      FROM kunabakti.vw_validasi_materai
      WHERE 1=1
      AND (${ruleSql})
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

export default { getCekMaterai };
