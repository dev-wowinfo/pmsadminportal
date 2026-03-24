import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

// Middlewares
import verifyToken from "./routes/middleware/verifyToken.js";

// ------------------------------   Postgre  SQL   ---------------------------------------------------------------------
// Routes
import productRoutes from "./routes/PostgreRoutes/productRoutes.js";
import planRoutes from "./routes/PostgreRoutes/planRoutes.js";
import AuthRoutes from "./routes/PostgreRoutes/AuthRoutes.js";


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


/* =====================
   SERVER START
===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ---------------------------------------------   Postgre  SQL   ---------------------------------------------------------------------

app.use("/api/products", verifyToken, productRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/auth", AuthRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});