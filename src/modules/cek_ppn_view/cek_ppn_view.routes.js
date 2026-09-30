import express from "express";
import cekPpnViewController from "./cek_ppn_view.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/sewatrafo", verifyToken, cekPpnViewController.getCekPpnSewatrafo);
router.get("/bptrafo", verifyToken, cekPpnViewController.getCekPpnBptrafo);
router.get("/sewakap", verifyToken, cekPpnViewController.getCekPpnSewakap);

export default router;
