import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

/**
 * 🔐 THIS SINGLE LINE protects ALL APIs below
 * Equivalent to [Authorize] on controller
 */
router.use(authenticateToken);

// ALL THESE APIs ARE AUTO-PROTECTED
router.post("/addLicenses", addLicenses);
router.post("/addUser", addUser);
router.get("/plans", getPlans);
router.put("/plans/:id", updatePlan);
router.delete("/plans/:id", deletePlan);

export default router;
