import express from "express";
import {getSearchAnalytics} from "../controllers/searchAnalyticsController.js";
import protect from "../middleware/auth.js";

const router=express.Router();

router.get("/", protect, getSearchAnalytics);

export default router;