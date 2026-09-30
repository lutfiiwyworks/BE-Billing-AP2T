import express from "express";
import cekRpbebanController from "./cek_rpbeban.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,cekRpbebanController.getCekRpbeban);

export default router;