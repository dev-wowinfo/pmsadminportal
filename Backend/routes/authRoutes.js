import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../config/db.js";

const router = express.Router();

/* ===============================
   REGISTER USER
   =============================== */
router.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 8 || !/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain a number",
      });
    }

    const checkSql = "SELECT id FROM users WHERE email = ?";
    db.query(checkSql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (result.length > 0) {
        return res.status(409).json({
          success: false,
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
      `;

      db.query(insertSql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "User registration failed",
          });
        }

        return res.status(201).json({
          success: true,
          message: "User registered successfully",
          user_id: result.insertId,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ===============================
   LOGIN USER
   =============================== */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const sql = "SELECT id, name, email, password FROM users WHERE email = ?";
  db.query(sql, [normalizedEmail], async (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
});

/* ===============================
   FORGOT PASSWORD
   =============================== */
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const findUserSql = "SELECT id FROM users WHERE email = ?";
  db.query(findUserSql, [normalizedEmail], (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const updateSql = `
      UPDATE users
      SET reset_token = ?, reset_token_expiry = ?
      WHERE email = ?
    `;

    db.query(
      updateSql,
      [resetToken, expiry, normalizedEmail],
      () => {
        return res.json({
          success: true,
          message: "Password reset token generated",
          reset_token: resetToken, // testing ke liye
          expires_in_minutes: 15,
        });
      }
    );
  });
});

/* ===============================
   RESET PASSWORD
   =============================== */
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Token and new password are required",
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  const findSql = `
    SELECT id FROM users
    WHERE reset_token = ?
    AND reset_token_expiry > NOW()
  `;

  db.query(findSql, [token], async (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateSql = `
      UPDATE users
      SET password = ?, reset_token = NULL, reset_token_expiry = NULL
      WHERE id = ?
    `;

    db.query(updateSql, [hashedPassword, users[0].id], () => {
      return res.json({
        success: true,
        message: "Password reset successfully",
      });
    });
  });
});


/* ===============================
   CHANGE PASSWORD (Logged-in User)
   =============================== */
router.post("/change-password", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters long",
    });
  }

  const findSql = "SELECT password FROM users WHERE id = ?";
  db.query(findSql, [userId], async (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, users[0].password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateSql = "UPDATE users SET password = ? WHERE id = ?";
    db.query(updateSql, [hashedPassword, userId], () => {
      return res.json({
        success: true,
        message: "Password changed successfully",
      });
    });
  });
});


export default router;
