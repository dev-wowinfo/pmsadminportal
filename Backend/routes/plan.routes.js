import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Add plan

router.post("/addPlan", async (req, res) => {
  try {
    const {
      plan_name,
      description,
      subscription_type,
      duration_days,
      price,
      currency,
      max_rooms,
      max_users,
      include_modules,
      trial_eligible,
      auto_renew,
      is_active
    } = req.body;

    if (!plan_name || !duration_days || !price) {
      return res.status(400).json({
        success: false,
        message: "Plan name, duration and price are required"
      });
    }

    // ✅ ARRAY → STRING
    const modulesString = Array.isArray(include_modules)
      ? include_modules.join(",")
      : null;

    const sql = `
      INSERT INTO plan_table
      (
        plan_name,
        description,
        subscription_type,
        duration_days,
        price,
        currency,
        max_rooms,
        max_users,
        include_modules,
        trial_eligible,
        auto_renew,
        is_active,
        is_archived
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      plan_name,
      description || null,
      subscription_type || null,
      duration_days,
      price,
      currency || "INR",
      max_rooms || 0,
      max_users || 0,
      modulesString,          // 👈 FIXED
      trial_eligible ? 1 : 0,
      auto_renew ? 1 : 0,
      is_active ? 1 : 0,
      0                        // is_archived
    ];

    const [result] = await db.query(sql, values);

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      plan_id: result.insertId
    });

  } catch (err) {
    console.error("ADD PLAN ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Get all palns

router.get("/getAllPlans", async (req, res) => {
  try {
    const sql = "SELECT * FROM plan_table WHERE is_archived = 0";

    const [rows] = await db.query(sql);

    return res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error("GET ALL PLANS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plans"
    });
  }
});

// Clone plan 

router.post("/clone/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Fetch original plan
    const getSql = `
      SELECT
        plan_name,
        description,
        subscription_type,
        duration_days,
        price,
        currency,
        max_rooms,
        max_users,
        include_modules,
        trial_eligible,
        auto_renew
      FROM plan_table
      WHERE id = ?
    `;

    const [rows] = await db.query(getSql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    const plan = rows[0];

    // 2️⃣ Insert cloned plan
    const insertSql = `
      INSERT INTO plan_table
      (
        plan_name,
        description,
        subscription_type,
        duration_days,
        price,
        currency,
        max_rooms,
        max_users,
        include_modules,
        trial_eligible,
        auto_renew,
        is_active,
        is_archived
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      `${plan.plan_name} (Copy)`,
      plan.description,
      plan.subscription_type,
      plan.duration_days,
      plan.price,
      plan.currency,
      plan.max_rooms,
      plan.max_users,
      plan.include_modules,          // already "0,1,2"
      plan.trial_eligible,
      plan.auto_renew,
      1,                              // is_active
      0                               // is_archived
    ];

    const [result] = await db.query(insertSql, values);

    return res.status(201).json({
      success: true,
      message: "Plan cloned successfully",
      new_plan_id: result.insertId
    });

  } catch (err) {
    console.error("CLONE PLAN ERROR 👉", err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Update plan

router.put("/updatePlan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { price, duration_days, is_active } = req.body;

    // ✅ Basic validation
    if (!price || !duration_days) {
      return res.status(400).json({
        success: false,
        message: "Price and duration_days are required"
      });
    }

    const sql = `
      UPDATE plan_table
      SET
        price = ?,
        duration_days = ?,
        is_active = ?
      WHERE id = ?
    `;

    const values = [
      price,
      duration_days,
      is_active ? 1 : 0,  // ✅ boolean → int
      id
    ];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    return res.json({
      success: true,
      message: "Plan updated successfully"
    });

  } catch (err) {
    console.error("UPDATE PLAN ERROR 👉", err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Delete plan 

router.delete("/deletePlan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      UPDATE plan_table
      SET is_archived = 1
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    return res.json({
      success: true,
      message: "Plan archived successfully"
    });

  } catch (err) {
    console.error("ARCHIVE PLAN ERROR 👉", err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Archived plan

router.put("/archivePlan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      UPDATE plan_table
      SET is_archived = 1
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    return res.json({
      success: true,
      message: "Plan archived successfully"
    });

  } catch (err) {
    console.error("ARCHIVE PLAN ERROR 👉", err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Restore plan

router.put("/restorePlan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      UPDATE plan_table
      SET is_archived = 0
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    return res.json({
      success: true,
      message: "Plan restored successfully"
    });

  } catch (err) {
    console.error("RESTORE PLAN ERROR 👉", err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

export default router;
