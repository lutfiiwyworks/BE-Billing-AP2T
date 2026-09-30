import express from "express";
import getCekPecahTdlController from "./cek_pecah_tdl.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getCekPecahTdlController.getCekPecahTdl);

export default router;
