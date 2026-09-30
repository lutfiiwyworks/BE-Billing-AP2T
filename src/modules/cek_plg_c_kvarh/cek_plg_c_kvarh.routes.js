import express from "express";
import cekPlgCKvarhController from "./cek_plg_c_kvarh.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,cekPlgCKvarhController.cekPlgCKvarh);

export default router;