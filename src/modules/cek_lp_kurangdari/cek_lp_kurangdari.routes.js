import express from "express";
import getLpKurangDariController from "./cek_lp_kurangdari.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getLpKurangDariController.getLpKurangDari);

export default router;