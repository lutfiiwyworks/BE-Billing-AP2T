import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

const getCekSaldoStimulus = async ({ thblrek, idpel }) => {
  const pgPool = getPgPool();

  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();

      let sql = `
        SELECT *
        FROM DTKS.CEK_SALDO_STIMULUS
        WHERE THBLREK = :thblrek
      `;

      const binds = { thblrek };

      if (idpel) {
        sql += ` AND IDPEL = :idpel`;
        binds.idpel = idpel;
      }

      sql += ` ORDER BY THBLREK, IDPEL`;

      const result = await oraConn.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      return result.rows.map((row) => ({
        source: "oracle",
        ...row,
      }));
    } finally {
      if (oraConn) {
        await oraConn.close();
      }
    }
  };

  const postgresQuery = async () => {
    let sql = `
      SELECT *
      FROM kunabakti.CEK_SALDO_STIMULUS
      WHERE thblrek = $1
    `;

    const values = [thblrek];

    if (idpel) {
      sql += ` AND idpel = $2`;
      values.push(idpel);
    }

    sql += ` ORDER BY thblrek, idpel`;

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

export default { getCekSaldoStimulus };
