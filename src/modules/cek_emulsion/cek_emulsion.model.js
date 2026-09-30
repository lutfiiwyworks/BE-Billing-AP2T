import oracledb from "oracledb";
import { getConnection } from "../../config/db.js";
import { getPgPool } from "../../config/pg.js";

const applyOracleInFilter = ({ sql, binds, column, bindPrefix, values }) => {
  if (!Array.isArray(values) || !values.length) {
    return sql;
  }

  const bindNames = values.map((value, index) => {
    const bindName = `${bindPrefix}${index}`;
    binds[bindName] = value;
    return `:${bindName}`;
  });

  return `${sql} AND ${column} IN (${bindNames.join(", ")})`;
};

const applyPostgresInFilter = ({ sql, values, idx, column, filterValues }) => {
  if (!Array.isArray(filterValues) || !filterValues.length) {
    return { sql, idx };
  }

  sql += ` AND ${column} = ANY($${idx})`;
  values.push(filterValues);
  idx++;

  return { sql, idx };
};

const getEmulsion = async ({
  thblrek,
  idpel,
  unitupi,
  limit,
}) => {
  const pgPool = getPgPool();

  const oracleQuery = async () => {
    let oraConn;

    try {
      oraConn = await getConnection();

      let sql = `
        SELECT *
        FROM DTKS.get_emulsion
        WHERE 1 = 1
      `;

      const binds = {};

      if (thblrek) {
        sql = applyOracleInFilter({
          sql,
          binds,
          column: "THBLREK",
          bindPrefix: "thblrek",
          values: thblrek,
        });
      }

      if (idpel) {
        sql += ` AND IDPEL = :idpel`;
        binds.idpel = idpel;
      }

      if (unitupi) {
        sql += ` AND UNITUPI = :unitupi`;
        binds.unitupi = unitupi;
      }

      sql += ` ORDER BY THBLREK, UNITUPI, IDPEL`;


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
      FROM kunabakti.get_emulsion
      WHERE 1=1
    `;

    const values = [];
    let idx = 1;

    if (thblrek) {
      const filter = applyPostgresInFilter({
        sql,
        values,
        idx,
        column: "thblrek",
        filterValues: thblrek,
      });
      sql = filter.sql;
      idx = filter.idx;
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

    sql += ` ORDER BY thblrek, unitupi, idpel`;

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

export default { getEmulsion };
