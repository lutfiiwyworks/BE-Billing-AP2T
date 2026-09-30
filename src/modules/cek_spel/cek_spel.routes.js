import express from "express";
import cekPlgSpelController from "./cek_spel.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekPlgSpelController.getCekPlgSpel);
router.get(
  "/tanpa-rptl-53950",
  verifyToken,
  cekPlgSpelController.getCekPlgSpelTanpaRptl53950
);

export default router;
