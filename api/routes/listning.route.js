import express from "express";
import { createListning } from "../controllers/listning.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListning);

export default router;
