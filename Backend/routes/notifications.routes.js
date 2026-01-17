import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ===============================
   CREATE NOTIFICATION
=============================== */
router.post("/addNotification", (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({
      success: false,
      message: "Title and message are required"
    });
  }

  const sql = `
    INSERT INTO notifications
    (title, message, is_read, is_archived, created_at)
    VALUES (?, ?, 0, 0, NOW())
  `;

  db.query(sql, [title, message], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error creating notification"
      });
    }

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification_id: result.insertId
    });
  });
});

/* ===============================
   GET ALL NOTIFICATIONS
=============================== */
router.get("/getAllNotifications", (req, res) => {
  const sql = `
    SELECT *
    FROM notifications
    WHERE is_archived = 0
    ORDER BY id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching notifications"
      });
    }

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  });
});

/* ===============================
   MARK AS READ
=============================== */
router.put("/markNotificationRead/:id", (req, res) => {
  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      message: "Notification marked as read"
    });
  });
});

/* ===============================
   MARK AS UNREAD
=============================== */
router.put("/markNotificationUnread/:id", (req, res) => {
  const sql = `
    UPDATE notifications
    SET is_read = 0
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      message: "Notification marked as unread"
    });
  });
});

/* ===============================
   ARCHIVE NOTIFICATION
=============================== */
router.put("/archiveNotification/:id", (req, res) => {
  const sql = `
    UPDATE notifications
    SET is_archived = 1
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      message: "Notification archived successfully"
    });
  });
});

/* ===============================
   DELETE NOTIFICATION (OPTIONAL)
=============================== */
router.delete("/deleteNotification/:id", (req, res) => {
  const sql = `DELETE FROM notifications WHERE id = ?`;

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully"
    });
  });
});

export default router;
