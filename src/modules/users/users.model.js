import { getConnection } from "../../config/db.js";

export const findByUsername = async (username) => {
  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT id_user, passwd, disable_user, leveluser, unitup
       FROM SECMAN.usertab
       WHERE id_user = :username 
       and disable_user <>'1'`,
      { username }
    );

    return result.rows[0];
  } finally {
    if (conn) await conn.close();
  }
};