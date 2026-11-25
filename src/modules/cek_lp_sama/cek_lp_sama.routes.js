import express from "express";
import getCekLpSamaController from "./cek_lp_sama.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getCekLpSamaController.getCekLpSama);

export default router;