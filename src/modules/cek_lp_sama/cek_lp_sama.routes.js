import express from "express";
import getLpSamaController from "./cek_lp_sama.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getLpSamaController.getLpSama);

export default router;