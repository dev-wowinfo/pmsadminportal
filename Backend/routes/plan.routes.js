import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ===============================
   CREATE PLAN
=============================== */
router.post("/addPlan", (req, res) => {
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

  const sql = `
    INSERT INTO plans
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `;

  db.query(
    sql,
    [
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
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error creating plan"
        });
      }

      res.status(201).json({
        success: true,
        message: "Plan created successfully",
        plan_id: result.insertId
      });
    }
  );
});

/* ===============================
   GET ALL PLANS
=============================== */
router.get("/getAllPlans", (req, res) => {
  const sql = `SELECT * FROM plans WHERE is_archived = 0`;

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      data: rows
    });
  });
});

/* ===============================
   UPDATE PLAN
=============================== */
router.put("/updatePlan/:id", (req, res) => {
  const { id } = req.params;
  const { price, duration_days, is_active } = req.body;

  const sql = `
    UPDATE plans
    SET price = ?, duration_days = ?, is_active = ?
    WHERE id = ?
  `;

  db.query(sql, [price, duration_days, is_active, id], (err) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      message: "Plan updated successfully"
    });
  });
});

/* ===============================
   DELETE PLAN
=============================== */
router.delete("/deletePlan/:id", (req, res) => {
  const sql = `DELETE FROM plans WHERE id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      message: "Plan deleted successfully"
    });
  });
});

/* ===============================
   ARCHIVE PLAN
=============================== */
router.put("/archivePlan/:id", (req, res) => {
  const sql = `UPDATE plans SET is_archived = 1 WHERE id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false });

    res.json({
      success: true,
      message: "Plan archived successfully"
    });
  });
});

/* ===============================
   RESTORE PLAN
=============================== */
router.put("/restorePlan/:id", (req, res) => {
  const sql = `UPDATE plans SET is_archived = 0 WHERE id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false });

    res.json({
      success: true,
      message: "Plan restored successfully"
    });
  });
});

export default router;
