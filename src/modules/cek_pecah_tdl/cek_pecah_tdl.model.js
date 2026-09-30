import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";

const getCekPecahTdl = async ({ thblrek, unitupi, idpel }) => {
    const oracleQuery = async () => {
        let oraConn;

        try {
            oraConn = await getConnection();

            let sql = `
                SELECT *
                FROM dtks.cek_pecah_tdl
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
    }

    const [oracleRows] = await Promise.all([
        oracleQuery()
    ]);

    return [...oracleRows];
};

export default { getCekPecahTdl };