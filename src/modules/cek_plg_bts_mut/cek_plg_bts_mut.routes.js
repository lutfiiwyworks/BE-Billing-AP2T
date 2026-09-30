import express from "express";
import getPlgBtsMutController from "./cek_plg_bts_mut.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getPlgBtsMutController.getPlgBtsMut);

export default router;