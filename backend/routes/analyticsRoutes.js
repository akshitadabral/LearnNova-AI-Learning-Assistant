import express from "express";
import protect from "../middleware/auth.js";
import { getWeeklyAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// Weekly Analytics
router.get("/weekly", protect, (req, res, next) => {
    
    next();
}, getWeeklyAnalytics);

export default router;