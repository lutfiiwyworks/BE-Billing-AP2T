import express from "express";
import cekRpbebanV1Controller from "./cek_rpbeban_v1.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekRpbebanV1Controller.getCekRpbebanV1);

export default router;
