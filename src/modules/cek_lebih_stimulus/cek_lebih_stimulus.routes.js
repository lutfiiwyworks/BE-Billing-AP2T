import express from "express";
import getCekReduksiStimulusController from "./cek_lebih_stimulus.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getCekReduksiStimulusController.getCekReduksiStimulus);

export default router;