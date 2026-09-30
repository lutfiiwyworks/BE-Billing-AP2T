import express from "express";
import getEmulsionController from "./cek_emulsion.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getEmulsionController.getEmulsion);

export default router;
