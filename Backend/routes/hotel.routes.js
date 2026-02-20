import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ===============================
   ADD HOTEL
=============================== */
router.post("/addHotel", (req, res) => {
  const {
    hotel_name,
    address,
    city,
    state,
    country,
    pincode,
    contact_person,
    contact_email,
    contact_phone
  } = req.body;

  if (!hotel_name || !city || !country) {
    return res.status(400).json({
      success: false,
      message: "Hotel name, city and country are required"
    });
  }

  const sql = `
    INSERT INTO hotels
    (
      hotel_name,
      address,
      city,
      state,
      country,
      pincode,
      contact_person,
      contact_email,
      contact_phone,
      is_active,
      is_archived,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, NOW())
  `;

  db.query(
    sql,
    [
      hotel_name,
      address,
      city,
      state,
      country,
      pincode,
      contact_person,
      contact_email,
      contact_phone
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error creating hotel"
        });
      }

      res.status(201).json({
        success: true,
        message: "Hotel added successfully",
        hotel_id: result.insertId
      });
    }
  );
});

/* ===============================
   GET ALL HOTELS
=============================== */
router.get("/getAllHotels", (req, res) => {
  const sql = `SELECT * FROM hotels WHERE is_archived = 0`;

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
   UPDATE HOTEL
=============================== */
router.put("/updateHotel/:id", (req, res) => {
  const { id } = req.params;
  const {
    hotel_name,
    address,
    city,
    state,
    country,
    pincode,
    contact_person,
    contact_email,
    contact_phone,
    is_active
  } = req.body;

  const sql = `
    UPDATE hotels
    SET
      hotel_name = ?,
      address = ?,
      city = ?,
      state = ?,
      country = ?,
      pincode = ?,
      contact_person = ?,
      contact_email = ?,
      contact_phone = ?,
      is_active = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      hotel_name,
      address,
      city,
      state,
      country,
      pincode,
      contact_person,
      contact_email,
      contact_phone,
      is_active,
      id
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false });
      }

      res.json({
        success: true,
        message: "Hotel updated successfully"
      });
    }
  );
});

/* ===============================
   DELETE HOTEL
=============================== */
router.delete("/deleteHotel/:id", (req, res) => {
  const sql = `DELETE FROM hotels WHERE id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      message: "Hotel deleted successfully"
    });
  });
});

/* ===============================
   ARCHIVE HOTEL
=============================== */
router.put("/archiveHotel/:id", (req, res) => {
  const sql = `UPDATE hotels SET is_archived = 1 WHERE id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false });

    res.json({
      success: true,
      message: "Hotel archived successfully"
    });
  });
});

/* ===============================
   RESTORE HOTEL
=============================== */
router.put("/restoreHotel/:id", (req, res) => {
  const sql = `UPDATE hotels SET is_archived = 0 WHERE id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false });

    res.json({
      success: true,
      message: "Hotel restored successfully"
    });
  });
});

export default router;
