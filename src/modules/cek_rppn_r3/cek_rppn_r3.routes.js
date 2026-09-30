import express from "express";
import cekRppnR3Controller from "./cek_rppn_r3.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekRppnR3Controller.getCekRppnR3);

export default router;
