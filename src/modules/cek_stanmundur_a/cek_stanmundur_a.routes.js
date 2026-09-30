import express from "express";
import getCekStanNoMutController from "./cek_stanmundur_a.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getCekStanNoMutController.getCekStanNoMut);

export default router;