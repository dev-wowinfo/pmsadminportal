import express from "express";
import bcrypt from "bcrypt";
import pool from "../../db/postgres.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  // #swagger.tags = ['Auth']
  console.log("BODY:", req.body);
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "Username, email, password, and role are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check user exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (userCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "error",
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id",
      [username.trim(), normalizedEmail, hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      status: "success",
      message: "User registered successfully",
      user_id: result.rows[0].id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      status: "error",
      message: "Server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      "SELECT id, username, email, password, role FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "error",
        message: "User with this email does not exist",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        status: "error",
        message: "Incorrect password, please try again",
      });
    }

    // JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Login successful",
      token,
      email: user.email,
      username: user.username,
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message, // debug ke liye better
    });
  }
});

export default router;