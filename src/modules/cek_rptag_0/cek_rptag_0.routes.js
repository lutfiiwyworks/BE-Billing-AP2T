import express from "express";
import cekRptag0Controller from "./cek_rptag_0.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekRptag0Controller.getCekRptag0);

export default router;
