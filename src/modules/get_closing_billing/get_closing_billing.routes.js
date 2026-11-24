import express from "express";
import getGetClosingBillingController from "./get_closing_billing.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getGetClosingBillingController.getGetClosingBilling);

export default router;
