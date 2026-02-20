import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ===============================
   ADD LICENSE
=============================== */
router.post("/addLicenses", (req, res) => {
  const { hotel_id, plan_id, start_date, end_date } = req.body;

  if (!hotel_id || !plan_id || !start_date) {
    return res.status(400).json({
      success: false,
      message: "hotel_id, plan_id and start_date are required",
    });
  }

  const sql = `
    INSERT INTO license_table
    (hotel_id, plan_id, start_date, end_date, status, is_archived, created_at)
    VALUES (?, ?, ?, ?, 1, 0, NOW())
  `;

  db.query(sql, [hotel_id, plan_id, start_date, end_date || null], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error creating license",
      });
    }

    res.status(201).json({
      success: true,
      message: "License created successfully",
      license_id: result.insertId,
    });
  });
});

/* ===============================
   GET ALL LICENSES
=============================== */
router.get("/getAllLicenses", (req, res) => {
  const sql = `SELECT * FROM license_table WHERE is_archived = 0`;

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      data: rows,
    });
  });
});

/* ===============================
   UPDATE LICENSE
=============================== */
router.put("/updateLicenses/:id", (req, res) => {
  const { id } = req.params;
  const { start_date, end_date } = req.body;

  const sql = `
    UPDATE license_table
    SET start_date = ?, end_date = ?
    WHERE id = ?
  `;

  db.query(sql, [start_date, end_date, id], (err) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      message: "License updated successfully",
    });
  });
});

/* ===============================
   DELETE LICENSE
=============================== */
router.delete("/deleteLicenses/:id", (req, res) => {
  const sql = `DELETE FROM license_table WHERE id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      message: "License deleted successfully",
    });
  });
});

/* ===============================
   ARCHIVE LICENSE
=============================== */
router.put("/archiveLicense/:id", (req, res) => {
  const sql = `UPDATE license_table SET is_archived = 1 WHERE id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false });

    res.json({
      success: true,
      message: "License archived successfully",
    });
  });
});

/* ===============================
   RESTORE LICENSE
=============================== */
router.put("/restoreLicense/:id", (req, res) => {
  const sql = `UPDATE license_table SET is_archived = 0 WHERE id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false });

    res.json({
      success: true,
      message: "License restored successfully",
    });
  });
});

export default router;
