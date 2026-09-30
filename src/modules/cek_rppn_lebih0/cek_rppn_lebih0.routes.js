import express from "express";
import getCekRppnLebih0Controller from "./cek_rppn_lebih0.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getCekRppnLebih0Controller.getCekRppnLebih0);

export default router;
