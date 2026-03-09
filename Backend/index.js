import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// DB connections
import mysqlPool from "./config/db.js";     // MySQL (existing)
import pgPool from "./db/postgres.js";      // PostgreSQL (new)
import session from "express-session";
// Routes
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/plan.routes.js";
import licenseRoutes from "./routes/license.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
// Middlewares
import authenticateToken from "./middlewares/authenticateToken.js";
import verifyToken from "./routes/middleware/verifyToken.js";

// ------------------------------   Postgre  SQL   ---------------------------------------------------------------------
import productRoutes from "./routes/PostgreRoutes/productRoutes.js";


// Config
dotenv.config();

// App init
const app = express();
app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// Existing APIs
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/plans", authenticateToken, planRoutes);
app.use("/api/licenses", authenticateToken, licenseRoutes);
app.use("/api/hotels", authenticateToken, hotelRoutes);
app.use("/api/notifications", authenticateToken, notificationRoutes);

// ===== Module ID → Value Mapping =====
const MODULE_MAP = {
  0: "dashboard",
  1: "booking",
  2: "reports",
};

// Authorization starts

app.use(
  session({
    secret: "simple-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // localhost
  })
);

// Authorization end

//  ***********************        License       ***********************

app.use("/api", authenticateToken, licenseRoutes);
app.use("/api", authenticateToken, planRoutes);
app.use("/api", authenticateToken, hotelRoutes);
app.use("/api", authenticateToken, notificationRoutes);

/* =====================
   SERVER START
===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

//  ***********************        Hotel       ***********************


app.get("/api/getAllNotification", (req, res) => {
  return res.json({
    success: true,
    data: [
      {
        id: 1,
        type: "license_expiry",
        title: "License Expiring Soon",
        message:
          "The license for Grand Plaza Hotel will expire in 25 days. Consider reaching out to discuss renewal options.",
        hotel_name: "Grand Plaza Hotel",
        tag: "Expiry",
        severity: "warning",
        is_new: true,
        event_date: "2024-06-20 14:30",
        days_left: 25,
        actions: {
          mark_as_read: true,
          delete: true
        }
      },
      {
        id: 2,
        type: "trial_ending",
        title: "Trial Period Ending",
        message:
          "Mountain View Lodge's trial period will end in 7 days. This is a good opportunity to convert them to a paid subscription.",
        hotel_name: "Mountain View Lodge",
        tag: "Trial Ending",
        severity: "info",
        is_new: true,
        event_date: "2024-03-24 15:30",
        days_left: 7,
        actions: {
          mark_as_read: true,
          delete: true
        }
      },
      {
        id: 3,
        type: "payment_failed",
        title: "Payment Failed",
        message:
          "Automatic renewal payment for City Center Suites has failed. The license is now in grace period. Please contact the customer immediately.",
        hotel_name: "City Center Suites",
        tag: "Payment Failed",
        severity: "error",
        is_new: true,
        event_date: "2024-05-04 10:00",
        days_left: 0,
        actions: {
          mark_as_read: true,
          delete: true
        }
      }
    ]
  });
});


app.put("/api/notification/:id/readUnread", (req, res) => {
  const { id } = req.params;
  const { is_read } = req.body;

  // Abhi mock response
  return res.json({
    success: true,
    message: is_read
      ? "Alert marked as read"
      : "Alert marked as unread",
    alert_id: id,
    is_read
  });
});


app.delete("/api/deleteNotification/:id", (req, res) => {
  const { id } = req.params;

  // Abhi mock delete
  return res.json({
    success: true,
    message: "Alert deleted successfully",
    alert_id: id
  });
});

// const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// ---------------------------------------------   Postgre  SQL   ---------------------------------------------------------------------

app.use("/api/products", productRoutes);