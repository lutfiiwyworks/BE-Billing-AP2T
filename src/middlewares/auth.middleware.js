import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ada (Authorization header kosong)",
      });
    }

    // format: Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Format token salah, gunakan Bearer <token>",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // simpan data user hasil decode
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid / expired",
    });
  }
};