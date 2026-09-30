import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

const getCekAnomaliStan = async ({ thblrek, unitupi, idpel, limit }) => {
    const pgPool = getPgPool();

    const oracleQuery = async () => {
        let oraConn;

        try {
            oraConn = await getConnection();

            let sql = `
                SELECT *
                FROM dtks.cek_anomali_stan
                WHERE THBLREK = :thblrek
            `;

            const binds = {
                thblrek,
            };

            if (unitupi) {
                sql += ` AND UNITUPI = :unitupi`;
                binds.unitupi = unitupi;
            }

            if (idpel) {
                sql += ` AND IDPEL = :idpel`;
                binds.idpel = idpel;
            }

            sql += ` ORDER BY THBLREK, UNITUPI, IDPEL`;



            const result = await oraConn.execute(
                sql,
                binds,
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                }
            );

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
            FROM kunabakti.cek_anomali_stan
            WHERE thblrek = $1
        `;

        const values = [thblrek];
        let idx = 2;

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

        sql += ` ORDER BY thblrek, unitupi, unitup, idpel`;


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

export default { getCekAnomaliStan };