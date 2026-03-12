import express from "express";
import pool from "../../db/postgres.js";

const router = express.Router();

router.post("/addPlan", async (req, res) => {

  try {

    const { product_id, plan_name, duration, price, billing_cycle, description, status } = req.body;

    // Validation
    if (!plan_name || !duration || !price) {
      return res.status(400).json({
        success: false,
        message: "Plan name, duration and price are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO plans
      (product_id, plan_name, duration, price, billing_cycle, description, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [product_id, plan_name, duration, price, billing_cycle, description, status]
    );

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.log("PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


router.get("/getPlans", async (req, res) => {

  try {

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Search
    const search = req.query.search || "";

    // Filter
    const product_id = req.query.product_id;

    let query = `SELECT * FROM plans WHERE 1=1`;
    let values = [];
    let index = 1;

    // Search filter
    if (search) {
      query += ` AND plan_name ILIKE $${index}`;
      values.push(`%${search}%`);
      index++;
    }

    // Product filter
    if (product_id) {
      query += ` AND product_id = $${index}`;
      values.push(product_id);
      index++;
    }

    // Pagination
    query += ` ORDER BY id DESC LIMIT $${index} OFFSET $${index+1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    // Total count
    const countResult = await pool.query(`SELECT COUNT(*) FROM plans`);

    res.status(200).json({
      success: true,
      page,
      limit,
      total: parseInt(countResult.rows[0].count),
      data: result.rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

});


router.get("/getPlan/:id", async (req, res) => {

  try {

    const { id } = req.params;

    // Validation
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan id"
      });
    }

    // Query with product join
    const result = await pool.query(
      `SELECT 
         p.id,
         p.plan_name,
         p.duration,
         p.price,
         p.billing_cycle,
         p.description,
         p.status,
         p.created_at,
         pr.product_name
       FROM plans p
       LEFT JOIN products_table pr 
       ON p.product_id = pr.id
       WHERE p.id = $1`,
      [id]
    );

    // Plan not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Plan fetched successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.log("GET PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

});

router.put("/updatePlan/:id", async (req, res) => {

  try {

    const { id } = req.params;
    const { product_id, plan_name, duration, price, billing_cycle, description, status } = req.body;

    // 1️⃣ Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan id"
      });
    }

    // 2️⃣ Check if plan exists
    const planCheck = await pool.query(
      "SELECT id FROM plans WHERE id=$1",
      [id]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    // 3️⃣ Validate product_id (foreign key)
    if (product_id) {
      const productCheck = await pool.query(
        "SELECT id FROM products_table WHERE id=$1",
        [product_id]
      );

      if (productCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product_id"
        });
      }
    }

    // 4️⃣ Update plan
    const result = await pool.query(
      `UPDATE plans
       SET product_id=$1,
           plan_name=$2,
           duration=$3,
           price=$4,
           billing_cycle=$5,
           description=$6,
           status=$7
       WHERE id=$8
       RETURNING *`,
      [product_id, plan_name, duration, price, billing_cycle, description, status, id]
    );

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.log("UPDATE PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

});


router.delete("/deletePlan/:id", async (req, res) => {

  try {

    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan id"
      });
    }

    // 2️⃣ Check if plan exists
    const planCheck = await pool.query(
      "SELECT id FROM plans WHERE id=$1",
      [id]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    // 3️⃣ Soft delete (status false)
    const result = await pool.query(
      `UPDATE plans
       SET status = false
       WHERE id=$1
       RETURNING *`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.log("DELETE PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

});


export default router;