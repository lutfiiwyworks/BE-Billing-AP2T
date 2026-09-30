import express from "express";
import detilAnomaliHaribacaAp2tController from "./detil_anomali_haribaca_ap2t.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  detilAnomaliHaribacaAp2tController.getDetilAnomaliHaribacaAp2t
);

router.get(
  "/export",
  verifyToken,
  detilAnomaliHaribacaAp2tController.exportDetilAnomaliHaribacaAp2t
);

export default router;
