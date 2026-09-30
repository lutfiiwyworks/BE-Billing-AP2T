import jwt from "jsonwebtoken";
import crypto from "crypto";
import { findByUsername } from "./users.model.js";

export const loginService = async (username, password) => {
  const user = await findByUsername(username);

  if (!user) throw new Error("User tidak ditemukan");

  if (user.DISABLE_USER === 1) {
    throw new Error("User sedang dinonaktifkan");
  }

 
  const hashedInput = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");


  if (hashedInput !== user.PASSWD) {
    throw new Error("User atau Password salah");
  }

  const token = jwt.sign(
    {
      id_user: user.ID_USER,
      unitup: user.UNITUP,
      leveluser: user.LEVELUSER,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id_user: user.ID_USER,
      unitup: user.UNITUP,
      leveluser: user.LEVELUSER,
    },
  };
};