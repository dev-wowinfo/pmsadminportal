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
// 🔍 PostgreSQL TEST API
// =======================
// app.get("/api/pg-test", async (req, res) => {
//   try {
//     const result = await pgPool.query("SELECT * FROM products1");
//     res.json(result.rows);
//   } catch (error) {
//     console.error("PostgreSQL Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

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

// Logout

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({
      success: true,
      message: "Logout successful",
    });
  });
});

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

// Create hotel

// app.post("/api/addHotels", (req, res) => {
//   const {
//     hotel_name,
//     email,
//     phone,
//     address,
//     city,
//     country,
//     room_count,
//     active_users,
//   } = req.body;

//   // Basic validation
//   if (!hotel_name || !email || !phone || !city || !country) {
//     return res.status(400).json({
//       success: false,
//       message: "Required fields are missing",
//     });
//   }

//   const sql = `
//     INSERT INTO hotels_table
//     (hotel_name, email, phone, address, city, country, room_count, active_users, status, created_at)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
//   `;

//   const values = [
//     hotel_name,
//     email,
//     phone,
//     address || null,
//     city,
//     country,
//     room_count || 0,
//     active_users || 0,
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         message: "Error adding hotel",
//         error: err,
//       });
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Hotel added successfully",
//       hotel_id: result.insertId,
//       statusCode: 200,
//     });
//   });
// });

// Get All hotels

// app.get("/api/getAllHotels", (req, res) => {
//   const sql = `
//     SELECT
//       id,
//       hotel_name,
//       contact_email AS email,
//       contact_phone AS phone,
//       address,
//       city,
//       country,
//       is_active AS status,
//       created_at
//     FROM hotels
//     WHERE is_active = 1
//     ORDER BY id DESC
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("DB ERROR 👉", err.message);
//       return res.status(500).json({
//         success: false,
//         message: "Error fetching hotels",
//         error: err.message,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       count: results.length,
//       data: results,
//       statusCode: 200,
//     });
//   });
// });


// Update Hotel

// app.put("/api/updateHotels/:id", (req, res) => {
//   const { id } = req.params;

//   const {
//     hotel_name,
//     email,
//     phone,
//     address,
//     city,
//     country,
//     room_count,
//     active_users,
//     status,
//     is_archived,
//   } = req.body;

//   const sql = `
//     UPDATE hotels_table
//     SET
//       hotel_name   = COALESCE(?, hotel_name),
//       email        = COALESCE(?, email),
//       phone        = COALESCE(?, phone),
//       address      = COALESCE(?, address),
//       city         = COALESCE(?, city),
//       country      = COALESCE(?, country),
//       room_count   = COALESCE(?, room_count),
//       active_users = COALESCE(?, active_users),
//       status       = COALESCE(?, status),
//       is_archived  = COALESCE(?, is_archived)
//     WHERE id = ?
//   `;

//   db.query(
//     sql,
//     [
//       hotel_name,
//       email,
//       phone,
//       address,
//       city,
//       country,
//       room_count,
//       active_users,
//       status,
//       is_archived,
//       id,
//     ],
//     (err, result) => {
//       if (err) {
//         return res.status(500).json({
//           success: false,
//           message: "Update failed",
//           error: err,
//         });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Hotel not found",
//         });
//       }

//       return res.json({
//         success: true,
//         message: "Hotel updated successfully",
//         statusCode: 200,
//       });
//     }
//   );
// });

// Delete Hotle

// app.delete("/api/deleteHotels/:id", (req, res) => {
//   const { id } = req.params;

//   const sql = `DELETE FROM hotels_table WHERE id = ?`;

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         message: "Error deleting hotel",
//         error: err,
//       });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Hotel not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Hotel deleted successfully",
//       statusCode: 200,
//     });
//   });
// });

//  ***********************        Notifications       ***********************


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



