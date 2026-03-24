import express from "express";
import bcrypt from "bcrypt";
import pool from "../../db/postgres.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("BODY:", req.body);
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
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
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id",
      [name.trim(), normalizedEmail, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user_id: result.rows[0].id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/login", async (req, res) => {
  console.log("LOGIN ROUTE HIT");

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1️⃣ User fetch (PostgreSQL uses $1, $2 instead of ?)
    const result = await pool.query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // 2️⃣ Password check
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3️⃣ JWT token
    const token = jwt.sign(
      { user_id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


export default router;