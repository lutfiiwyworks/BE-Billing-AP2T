import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

const formatDateYYYYMMDD = (value) => {
  if (!value) return value;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type) =>
    parts.find((part) => part.type === type)?.value;

  return `${get("year")}${get("month")}${get("day")}`;
};

const COLUMNS = [
  "UNITUP",
  "UNITUPI",
  "IDPEL",
  "THBLREK",
  "TARIF",
  "DAYA",
  "TARIF_LM",
  "DAYA_LM",
  "KDPT",
  "KDPT_2",
  "KDAM",
  "JNSMUT",
  "THBLMUT",
  "POSTINGBILLING",
  "TGLBACALALU",
  "TGLBACAAKHIR",
  "TGLRUBAH",
  "FAKM",
  "SLALWBP",
  "SAHLWBP_CABUT",
  "SLALWBP_PASANG",
  "SAHLWBP",
  "SLAWBP",
  "SAHWBP_CABUT",
  "SLAWBP_PASANG",
  "SAHWBP",
  "SLAKVARH",
  "SAHKVARH_CABUT",
  "SLAKVARH_PASANG",
  "SAHKVARH",
  "PEMKWH",
  "PEMKVARH",
  "KELBKVARH",
  "PECAHAN",
  "JAMNYALA",
  "PTL_MNL",
  "RPPTL",
  "RPTAG",
  "RPREDUKSI",
  "KDPROSES",
  "RPDISKON",
  "RPSELISIH",
  "FLAG_BEBAS_RM",
];

const getCekRptag0 = async ({ thblrek, unitupi, idpel, limit }) => {
  const pgPool = getPgPool();

  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();

      let sql = `
        SELECT ${COLUMNS.join(", ")}
        FROM DTKS.VW_CEK_RPTAG_0
        WHERE THBLREK = :thblrek
      `;

      const binds = { thblrek };

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
        TGLRUBAH: formatDateYYYYMMDD(row.TGLRUBAH),
      }));
    } finally {
      if (oraConn) await oraConn.close();
    }
  };

  const postgresQuery = async () => {
    let sql = `
      SELECT ${COLUMNS.join(", ").toLowerCase()}
      FROM kunabakti.vw_cek_rptag_0
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


    const result = await pgPool.query(sql, values);

    return result.rows.map((row) => ({
      source: "postgres",
      ...row,
      tglrubah: formatDateYYYYMMDD(row.tglrubah),
    }));
  };

  const [oracleRows, postgresRows] = await Promise.all([
    oracleQuery(),
    postgresQuery(),
  ]);

  return [...oracleRows, ...postgresRows];
};

export default { getCekRptag0 };
