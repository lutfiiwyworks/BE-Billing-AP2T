import express from "express";
import getCekAnomaliBillingKoreksiController from "./cek_anomali_koreksi.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getCekAnomaliBillingKoreksiController.getCekAnomaliBillingKoreksi);

export default router;
