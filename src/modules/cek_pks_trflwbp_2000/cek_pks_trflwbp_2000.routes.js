import express from "express";
import cekPksTrflwbp2000Controller from "./cek_pks_trflwbp_2000.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekPksTrflwbp2000Controller.getCekPksTrflwbp2000);
router.get(
  "/trflwbp-lebih-2000",
  verifyToken,
  cekPksTrflwbp2000Controller.getCekPksTrflwbpLebih2000
);

export default router;
