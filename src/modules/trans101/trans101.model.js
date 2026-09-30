import { getConnection } from "../../config/db.js";

const getAllTrans101 = async () => {
  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(`SELECT * FROM bill52.trans_101`);

    return result.rows;
  } finally {
    if (conn) await conn.close();
  }
};

export default { getAllTrans101 };
