import express from "express";
import getCekSelisihRpTagController from "./cek_selisih_rptag.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getCekSelisihRpTagController.getCekSelisihRpTag);

export default router;
