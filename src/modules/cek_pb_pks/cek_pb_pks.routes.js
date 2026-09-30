import express from "express";
import getCekPbPksController from "./cek_pb_pks.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getCekPbPksController.getCekPbPks);

export default router;