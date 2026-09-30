import express from "express";
import getPemkwh0Controller from "./cek_pemkwh0.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getPemkwh0Controller.getPemkwh0);

export default router;