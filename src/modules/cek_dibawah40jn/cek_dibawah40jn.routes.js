import express from "express";
import cekDibawah40jnController from "./cek_dibawah40jn.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, cekDibawah40jnController.getCekDibawah40jn);

export default router;
