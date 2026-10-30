import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const createPgPool = (prefix) => {
  const pool = new Pool({
    user: process.env[`${prefix}_USER`],
    host: process.env[`${prefix}_HOST`],
    database: process.env[`${prefix}_DATABASE`],
    password: process.env[`${prefix}_PASSWORD`],
    port: toNumber(process.env[`${prefix}_PORT`], 5432),
    max: toNumber(process.env[`${prefix}_MAX`], 20),
    idleTimeoutMillis: toNumber(process.env[`${prefix}_IDLE_TIMEOUT`], 30000),
    statement_timeout: toNumber(process.env[`${prefix}_STATEMENT_TIMEOUT`], 600000),
    query_timeout: toNumber(process.env[`${prefix}_QUERY_TIMEOUT`], 600000),
  });

  pool.on("error", (err) => {
    console.error(`PostgreSQL pool ${prefix} error:`, err);
  });

  return pool;
};

export const pgPoolLjb1 = createPgPool("PG_LJB1");
export const pgPoolJtg = createPgPool("PG_JTG");
export const pgPoolLjb2 = createPgPool("PG_LJB2");
export const pgPoolJakban = createPgPool("PG_JAKBAN");

const testPool = async (pool, name) => {
  const client = await pool.connect();
  client.release();
  console.log(`${name} Connected`);
};

export const initPostgres = async () => {
  try {
    await testPool(pgPoolLjb2, "PostgreSQL LJB2");
    await testPool(pgPoolJakban, "PostgreSQL JAKBAN");
    await testPool(pgPoolLjb1, "PostgreSQL LJB1");
    await testPool(pgPoolJtg, "PostgreSQL Jateng");
  } catch (err) {
    console.error("PostgreSQL Connection Failed:", err);
    throw err;
  }
};


const pgPools = [
  { name: "NEW AP2T", pool: pgPoolLjb2 },
  { name: "NEW AP2T", pool: pgPoolLjb1 },
  { name: "NEW AP2T", pool: pgPoolJtg },
  { name: "NEW AP2T", pool: pgPoolJakban },
];

const allPostgresPool = {
  async query(...args) {
    const results = await Promise.all(
      pgPools.map(async ({ name, pool }) => {
        try {
          const result = await pool.query(...args);

          return {
            ...result,
            rows: result.rows.map((row) => ({
              source: name,
              ...row,
            })),
          };
        } catch (error) {
          error.message = `${name}: ${error.message}`;
          throw error;
        }
      }),
    );

    return {
      ...results[0],
      rows: results.flatMap((result) => result.rows),
      rowCount: results.reduce((total, result) => total + (result.rowCount || 0), 0),
    };
  },
};

export const getPgPool = () => allPostgresPool;
export const getPgPoolJtg = () => pgPoolJtg;
export const getPgPoolLjb1 = () => pgPoolLjb1;
export const getPgPoolLjb2 = () => pgPoolLjb2;
export const getPgPoolJakban = () => pgPoolJakban;

export const getPgPoolSecondary = () => pgPoolLjb1;

