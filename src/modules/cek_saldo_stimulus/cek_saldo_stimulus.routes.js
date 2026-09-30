import express from "express";
import cekSaldoStimulusController from "./cek_saldo_stimulus.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekSaldoStimulusController.getCekSaldoStimulus);

export default router;
