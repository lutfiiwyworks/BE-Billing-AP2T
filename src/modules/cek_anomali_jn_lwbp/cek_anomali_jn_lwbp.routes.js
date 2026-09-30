import express from "express";
import cekAnomaliJnLwbpController from "./cek_anomali_jn_lwbp.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekAnomaliJnLwbpController.getCekAnomaliJnLwbp);

export default router;
