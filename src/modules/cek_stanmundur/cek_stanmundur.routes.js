import express from "express";
import getCekStanmundurController from "./cek_stanmundur.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getCekStanmundurController.getCekStanmundur);

export default router;
