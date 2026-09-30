import express from "express";
import getCekSaldoPascaController from "./cek_saldo_pasca.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken,getCekSaldoPascaController.getCekSaldoPasca);

export default router;