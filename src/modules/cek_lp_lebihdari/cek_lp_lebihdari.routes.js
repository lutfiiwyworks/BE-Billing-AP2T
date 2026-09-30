import express from "express";
import getLpLebihDariController from "./cek_lp_lebihdari.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getLpLebihDariController.getLpLebihDari);

export default router;