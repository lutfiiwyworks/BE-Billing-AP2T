import express from "express";
import cekAnomaliKelebihanKvarhController from "./cek_anomali_kelebihan_kvarh.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  cekAnomaliKelebihanKvarhController.getCekAnomaliKelebihanKvarh
);

export default router;
