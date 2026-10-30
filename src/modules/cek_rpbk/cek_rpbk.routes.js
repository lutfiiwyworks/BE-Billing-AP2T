import express from "express";
import getCekRpBKController from "./cek_rpbk.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getCekRpBKController.getCekRpBK);

export default router;
