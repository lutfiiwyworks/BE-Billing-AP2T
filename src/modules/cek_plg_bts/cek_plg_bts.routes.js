import express from "express";
import getPlgBtsController from "./cek_plg_bts.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getPlgBtsController.getPlgBts);

export default router;