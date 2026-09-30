import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import controller from "./trans101.controller.js";

const router = express.Router();

router.get("/", verifyToken,controller.getAll);

export default router;