import express from "express";
import vwbilling720jnController from "./vwbilling_720jn.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, vwbilling720jnController.getVwbilling720jn);

export default router;
