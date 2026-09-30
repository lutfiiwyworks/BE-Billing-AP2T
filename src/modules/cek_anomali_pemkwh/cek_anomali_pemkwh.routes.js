import express from "express";
import getCekAnomaliPemkwhController from "./cek_anomali_pemkwh.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getCekAnomaliPemkwhController.getCekAnomaliPemkwh);

export default router;