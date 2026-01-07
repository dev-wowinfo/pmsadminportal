import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middlewares

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

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

// Login

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  const sql = `
    SELECT id, email, name
    FROM users
    WHERE email = ? AND password = ? AND is_active = 1
  `;

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // session create
    req.session.user = result[0];

    res.json({
      success: true,
      message: "Login successful",
      user: result[0],
    });
  });
});

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

// Create license

app.post("/api/addLicenses", (req, res) => {
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

  db.query(
    sql,
    [hotel_id, plan_id, start_date, end_date || null],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error creating license",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "License created successfully",
        license_id: result.insertId,
      });
    }
  );
});

// Get license

app.get("/api/getAllLicenses", (req, res) => {
  const sql = `
    SELECT *
    FROM license_table
    WHERE is_archived = 0
    AND status = 1
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching licenses",
        error: err,
      });
    }

    return res.json({
      success: true,
      count: results.length,
      data: results,
    });
  });
});

// Update license

app.put("/api/licenses/:id", (req, res) => {
  const { id } = req.params;
  const { start_date, end_date, status, is_archived } = req.body;

  const sql = `
    UPDATE license_table
    SET
      start_date  = COALESCE(?, start_date),
      end_date    = COALESCE(?, end_date),
      status      = COALESCE(?, status),
      is_archived = COALESCE(?, is_archived)
    WHERE id = ?
  `;

  db.query(
    sql,
    [start_date, end_date, status, is_archived, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error updating license",
          error: err,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "License not found",
        });
      }

      return res.json({
        success: true,
        message: "License updated successfully",
      });
    }
  );
});

// Delete license

app.delete("/api/deleteLicenses/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM license_table WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error deleting license",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "License not found",
      });
    }

    return res.json({
      success: true,
      message: "License deleted permanently",
    });
  });
});

//  ***********************        Plan       ***********************

// Add plan

app.post("/api/addPlan", (req, res) => {
  const {
    plan_name,
    description,
    subscription_type,
    duration_days,
    price,
    currency,
    max_rooms,
    max_users,
    include_modules, // [0,1,2]
    trial_eligible,
    auto_renew,
    is_active,
  } = req.body;

  /* ===== Validation ===== */
  if (!plan_name || !subscription_type || !duration_days || !currency) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing",
      statusCode: 400,
    });
  }

  /* ===============================
     include_modules
     IDs → DB string
  =============================== */
  const moduleIdsString = Array.isArray(include_modules)
    ? include_modules.join(",") // "0,1,2"
    : "";

  /* ===============================
     Booleans → DB (1 / 0)
  =============================== */
  const trialEligibleVal = trial_eligible ? 1 : 0;
  const autoRenewVal = auto_renew ? 1 : 0;
  const isActiveVal = is_active ? 1 : 0;

  const sql = `
    INSERT INTO plan_table
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
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    plan_name,
    description,
    subscription_type,
    duration_days,
    price,
    currency,
    max_rooms,
    max_users,
    moduleIdsString,
    trialEligibleVal,
    autoRenewVal,
    isActiveVal,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
        statusCode: 500,
      });
    }

    /* ===============================
       IDs → Values (for response)
    =============================== */
    const moduleValues = Array.isArray(include_modules)
      ? include_modules.map((id) => MODULE_MAP[id]).filter(Boolean)
      : [];

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      statusCode: 201,
    });
  });
});

// Get all plans

app.get("/api/plans", (req, res) => {
  const moduleMap = {
    0: "dashboard",
    1: "booking",
    2: "reports",
  };

  const sql = `SELECT * FROM plan_table ORDER BY id DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch plans",
        statusCode: 500,
      });
    }

    const formattedData = results.map((row) => {
      let modules = [];

      if (row.include_modules) {
        modules = String(row.include_modules)
          .split(",")
          .map((id) => moduleMap[id])
          .filter(Boolean);
      }

      return {
        ...row,
        include_modules: modules,
      };
    });

    res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      statusCode: 200,
      data: formattedData,
    });
  });
});

// Clone plan

app.post("/api/plans/clone/:id", (req, res) => {
  const { id } = req.params;

  // 1️⃣ Fetch original plan
  const getSql = `
    SELECT
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
      auto_renew
    FROM plan_table
    WHERE id = ?
  `;

  db.query(getSql, [id], (err, rows) => {
    if (err) {
      console.error("FETCH PLAN ERROR 👉", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch plan",
        error: err.message
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    const plan = rows[0];

    // 2️⃣ Insert cloned plan (EXACT column match)
    const insertSql = `
      INSERT INTO plan_table
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
    `;

    const values = [
      `${plan.plan_name} (Copy)`,
      plan.description,
      plan.subscription_type,
      plan.duration_days,
      plan.price,
      plan.currency,
      plan.max_rooms,
      plan.max_users,
      plan.include_modules,
      plan.trial_eligible,
      plan.auto_renew
    ];

    db.query(insertSql, values, (err, result) => {
      if (err) {
        console.error("CLONE INSERT ERROR 👉", err);
        return res.status(500).json({
          success: false,
          message: "Clone failed",
          error: err.message
        });
      }

      return res.status(201).json({
        success: true,
        message: "Plan cloned successfully",
        new_plan_id: result.insertId,
		statusCode:200
      });
    });
  });
});



// Update plan

app.put("/api/updatePlans", (req, res) => {
  const { id } = req.query; // 👈 QUERY PARAM

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Plan id is required",
      statusCode: 400,
    });
  }

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
    is_active,
  } = req.body;

  /* ===============================
     include_modules: IDs → string
  =============================== */
  const modulesString = Array.isArray(include_modules)
    ? include_modules.join(",")
    : "";

  /* ===============================
     booleans → 1 / 0
  =============================== */
  const trialEligibleVal = trial_eligible ? 1 : 0;
  const autoRenewVal = auto_renew ? 1 : 0;
  const isActiveVal = is_active ? 1 : 0;

  const sql = `
    UPDATE plan_table
    SET
      plan_name = ?,
      description = ?,
      subscription_type = ?,
      duration_days = ?,
      price = ?,
      currency = ?,
      max_rooms = ?,
      max_users = ?,
      include_modules = ?,
      trial_eligible = ?,
      auto_renew = ?,
      is_active = ?
    WHERE id = ?
  `;

  const values = [
    plan_name,
    description,
    subscription_type,
    duration_days,
    price,
    currency,
    max_rooms,
    max_users,
    modulesString,
    trialEligibleVal,
    autoRenewVal,
    isActiveVal,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        statusCode: 500,
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      statusCode: 200,
    });
  });
});

// Delete

app.delete("/api/deletePlans/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM plan_table WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error deleting plan",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan deleted permanently",
      statusCode: 200,
    });
  });
});

/* =====================
   SERVER START
===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

//  ***********************        Hotel       ***********************

// Create hotel

app.post("/api/addHotels", (req, res) => {
  const {
    hotel_name,
    email,
    phone,
    address,
    city,
    country,
    room_count,
    active_users,
  } = req.body;

  // Basic validation
  if (!hotel_name || !email || !phone || !city || !country) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing",
    });
  }

  const sql = `
    INSERT INTO hotels_table
    (hotel_name, email, phone, address, city, country, room_count, active_users, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())
  `;

  const values = [
    hotel_name,
    email,
    phone,
    address || null,
    city,
    country,
    room_count || 0,
    active_users || 0,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error adding hotel",
        error: err,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Hotel added successfully",
      hotel_id: result.insertId,
      statusCode: 200,
    });
  });
});

// Get All hotels

app.get("/api/getAllHotels", (req, res) => {
  const sql = `
    SELECT
      id,
      hotel_name,
      email,
      phone,
      address,
      city,
      country,
      room_count,
      active_users,
      status,
      created_at
    FROM hotels_table
    WHERE status = 1
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching hotels",
        error: err,
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
      statusCode: 200,
    });
  });
});

// Update Hotel

app.put("/api/updateHotels/:id", (req, res) => {
  const { id } = req.params;

  const {
    hotel_name,
    email,
    phone,
    address,
    city,
    country,
    room_count,
    active_users,
    status,
    is_archived,
  } = req.body;

  const sql = `
    UPDATE hotels_table
    SET
      hotel_name   = COALESCE(?, hotel_name),
      email        = COALESCE(?, email),
      phone        = COALESCE(?, phone),
      address      = COALESCE(?, address),
      city         = COALESCE(?, city),
      country      = COALESCE(?, country),
      room_count   = COALESCE(?, room_count),
      active_users = COALESCE(?, active_users),
      status       = COALESCE(?, status),
      is_archived  = COALESCE(?, is_archived)
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      hotel_name,
      email,
      phone,
      address,
      city,
      country,
      room_count,
      active_users,
      status,
      is_archived,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Update failed",
          error: err,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found",
        });
      }

      return res.json({
        success: true,
        message: "Hotel updated successfully",
        statusCode: 200,
      });
    }
  );
});

// Delete Hotle

app.delete("/api/deleteHotels/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM hotels_table WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error deleting hotel",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel deleted successfully",
      statusCode: 200,
    });
  });
});


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


app.post("/api/auth/register", (req, res) => {
  const { name, email, password, user_type, login_type } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  // Check if user already exists
  const checkSql = `SELECT id FROM UsersTB WHERE email = ?`;

  db.query(checkSql, [email], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "DB error",
        error: err.message
      });
    }

    if (rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already registered"
      });
    }

    const insertSql = `
      INSERT INTO UsersTB
      (
        user_uid,
        name,
        email,
        password,
        user_type,
        login_type,
        is_verified,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, 0, 1, NOW())
    `;

    const user_uid = "USR_" + Date.now();

    db.query(
      insertSql,
      [
        user_uid,
        name,
        email,
        password,
        user_type || "user",
        login_type || "email"
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: err.message
          });
        }

        return res.status(201).json({
          success: true,
          message: "User registered successfully",
          user_id: result.insertId,
          user_uid
        });
      }
    );
  });
});

