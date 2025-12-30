import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("Admin Panel Backend Running ✅");
});

// DB test API
app.get("/tables", (req, res) => {
  db.query("SHOW TABLES", (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      tables: result,
    });
  });
});

// Plan API starts //

app.post("/api/plans", (req, res) => {
  const {
    plan_name,
    description,
    subscription_type,
    duration_days,
    price,
    currency,
    max_rooms,
    max_users,
    include_modules
  } = req.body;

  // 🔥 BAS YE LINE KAAM KAREGI
  const modulesString = Array.isArray(include_modules)
    ? include_modules.join(",")
    : include_modules;

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
      include_modules
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    modulesString
  ];

  db.query(sql, values, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    res.json({
      success: true,
      message: "Plan saved successfully"
    });
  });
});


 


// Plan API close //

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import db from "./config/db.js";

// dotenv.config();

// const app = express();

// // ✅ Middlewares
// app.use(cors());
// app.use(express.json());
// console.log("test application");
// // ✅ Test API (DB connection check)
// app.get("/admin_panel_dev", (req, res) => {
//   db.query("SHOW TABLES", (err, result) => {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         error: err.message,
//       });
//     }
//     res.json({
//       success: true,
//       tables: result,
//     });
//   });
// });

// // ✅ Server start
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   // console.log(`🚀 Server running on port ${PORT}`);
//   console.log("connected====>");

// });
