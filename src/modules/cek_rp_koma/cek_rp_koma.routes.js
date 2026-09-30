import express from "express";
import getCekKomaController from "./cek_rp_koma.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getCekKomaController.getCekKoma);

export default router;