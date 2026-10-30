import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";

const getCekAnomaliBillingKoreksi = async ({ thblrek, unitupi, idpel }) => {
    const oracleQuery = async () => {
        let oraConn;

        try {
            oraConn = await getConnection();

            let sql = `
                SELECT *
                FROM dtks.anomali_billing_koreksi
                WHERE THBLREK = :thblrek
            `;

            const binds = {
                thblrek,
            };

           
            if (idpel) {
                sql += ` AND IDPEL = :idpel`;
                binds.idpel = idpel;
            }




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

export default { getCekAnomaliBillingKoreksi };
