import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Add licences

router.post("/addLicenses", async (req, res) => {
  try {
    const { hotel_id, plan_id, start_date, end_date } = req.body;

    // ✅ Validation
    if (!hotel_id || !plan_id || !start_date) {
      return res.status(400).json({
        success: false,
        message: "hotel_id, plan_id and start_date are required",
      });
    }

    const sql = `
      INSERT INTO license_table
      (
        hotel_id,
        plan_id,
        start_date,
        end_date,
        status,
        is_archived,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      hotel_id,
      plan_id,
      start_date,
      end_date || null,
      1, // status active
      0  // not archived
    ];

    const [result] = await db.query(sql, values);

    return res.status(201).json({
      success: true,
      message: "License created successfully",
      license_id: result.insertId,
    });

  } catch (err) {
    console.error("ADD LICENSE ERROR 👉", err.message);
    return res.status(500).json({
      success: false,
      message: "Error creating license",
      error: err.message
    });
  }
});

// Get all licenses

router.get("/getAllLicenses", async (req, res) => {
  try {
    const sql = `SELECT * FROM license_table WHERE is_archived = 0`;
    const [rows] = await db.query(sql);

    return res.json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.error("GET LICENSE ERROR 👉", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch licenses",
      error: err.message
    });
  }
});

/* ===============================
   UPDATE LICENSE
=============================== */
router.put("/updateLicenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.body;

    // ✅ Validation
    if (!start_date) {
      return res.status(400).json({
        success: false,
        message: "start_date is required"
      });
    }

    const sql = `
      UPDATE license_table
      SET
        start_date = ?,
        end_date = ?
      WHERE id = ?
    `;

    const values = [
      start_date,
      end_date || null,
      id
    ];

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "License not found"
      });
    }

    return res.json({
      success: true,
      message: "License updated successfully"
    });

  } catch (err) {
    console.error("UPDATE LICENSE ERROR 👉", err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/* ===============================
   DELETE LICENSE
=============================== */
router.delete("/archivedLicences/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      UPDATE license_table
      SET is_archived = 1
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "License not found"
      });
    }

    return res.json({
      success: true,
      message: "License archived successfully"
    });

  } catch (err) {
    console.error("ARCHIVE LICENSE ERROR 👉", err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/* ===============================
   ARCHIVE LICENSE
=============================== */
// router.put("/archiveLicense/:id", (req, res) => {
//   const sql = `UPDATE license_table SET is_archived = 1 WHERE id = ?`;

//   db.query(sql, [req.params.id], (err) => {
//     if (err) return res.status(500).json({ success: false });

//     res.json({
//       success: true,
//       message: "License archived successfully",
//     });
//   });
// });

/* ===============================
   RESTORE LICENSE
=============================== */
router.put("/restoreLicense/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      UPDATE license_table
      SET is_archived = 0
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "License not found"
      });
    }

    return res.json({
      success: true,
      message: "License restored successfully"
    });

  } catch (err) {
    console.error("RESTORE LICENSE ERROR 👉", err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

export default router;
