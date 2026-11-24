import express from "express";
import getValidasiClosingBillingController from "./validasi_closing_billing.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getValidasiClosingBillingController.getValidasiClosingBilling);

export default router;
