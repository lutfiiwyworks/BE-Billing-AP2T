import "dotenv/config";
import oracledb from "oracledb";

oracledb.initOracleClient({
  libDir: "C:\\instantclient_11_2"
});

const configs = [
  {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: `(DESCRIPTION=
      (ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.ORACLE_OFFICE_HOST})(PORT=${process.env.ORACLE_OFFICE_PORT}))
      (CONNECT_DATA=(SERVICE_NAME=${process.env.ORACLE_OFFICE_SERVICE}))
    )`,
    poolAlias: "office",
    name: "Office DB"
  },
  {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: `(DESCRIPTION=
      (ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.ORACLE_VPN_HOST})(PORT=${process.env.ORACLE_VPN_PORT}))
      (CONNECT_DATA=(SERVICE_NAME=${process.env.ORACLE_VPN_SERVICE}))
    )`,
    poolAlias: "vpn",
    name: "VPN DB"
  },
  {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: `(DESCRIPTION=
      (ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.ORACLE_TRUNO_HOST})(PORT=${process.env.ORACLE_TRUNO_PORT}))
      (CONNECT_DATA=(SERVICE_NAME=${process.env.ORACLE_TRUNO_SERVICE}))
    )`,
    poolAlias: "truno",
    name: "DB TRUNO"
  }
];

let activePool = null;
let activeConfig = null;

export const initDB = async () => {
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  for (const config of configs) {
    try {
      const pool = await oracledb.createPool({
        ...config,
        poolMin: 2,
        poolMax: 20,
        poolIncrement: 1
      });

      // Test query
      const conn = await pool.getConnection();

      const result = await conn.execute(`
        SELECT
          SYS_CONTEXT('USERENV', 'DB_NAME') AS db_name,
          SYS_CONTEXT('USERENV', 'SERVICE_NAME') AS service_name,
          SYS_CONTEXT('USERENV', 'INSTANCE_NAME') AS instance_name
        FROM dual
      `);

      await conn.close();

      console.log(`Connected to ${config.name}`);
      console.log(result.rows);

      activePool = pool;
      activeConfig = config;

      return;
    } catch (err) {
      console.log(`${config.name} failed: ${err.message}`);
    }
  }

  throw new Error("Semua koneksi Oracle gagal.");
};

export const getConnection = async () => {
  if (!activePool) {
    throw new Error("Oracle DB belum diinisialisasi.");
  }

  return await activePool.getConnection();
};
