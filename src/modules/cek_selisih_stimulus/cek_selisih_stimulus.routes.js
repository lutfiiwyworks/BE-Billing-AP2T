import express from "express";
import getCekStimulusController from "./cek_selisih_stimulus.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getCekStimulusController.getCekStimulus);

export default router;