import express from "express";
import cekPpjController from "./cek_ppj.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekPpjController.getCekPpj);
router.get("/beda-prosen", verifyToken, cekPpjController.getCekPpjBedaProsen);

export default router;
