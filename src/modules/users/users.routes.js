import express from "express";
import { login } from "./users.controller.js";

const router = express.Router();

router.post("/login", login);

export default router;