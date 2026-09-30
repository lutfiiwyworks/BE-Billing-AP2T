import express from "express";
import cekSelisihUnsurPtlController from "./cek_selisih_unsur_ptl.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekSelisihUnsurPtlController.getCekSelisihUnsurPtl);

export default router;
