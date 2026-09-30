import express from "express";
import getCekReduksiRp0Controller from "./cek_reduksi_rp0.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getCekReduksiRp0Controller.getCekReduksiRp0);

export default router;