import { loginService } from "./users.service.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await loginService(username, password);

    return res.json({
      success: true,
      message: "Login berhasil",
      data: result,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};