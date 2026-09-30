import express from "express";
import cekMateraiController from "./cek_materai.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekMateraiController.getCekMaterai);

export default router;
