import express from "express";
import getCekAnomaliStanController from "./cek_anomali_stan.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getCekAnomaliStanController.getCekAnomaliStan);

export default router;