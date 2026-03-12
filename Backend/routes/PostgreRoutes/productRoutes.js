import express from "express";
import pool from "../../db/postgres.js";      // PostgreSQL (new)

const router = express.Router();


// ADD PRODUCT
router.post("/addProduct", async (req, res) => {

  try {

    const { product_name, product_code, description, status } = req.body;

    // 1️⃣ Input validation
    if (!product_name || !product_code) {
      return res.status(400).json({
        success: false,
        message: "product_name and product_code are required"
      });
    }

    // 2️⃣ Duplicate check
    const checkProduct = await pool.query(
      "SELECT * FROM products_table WHERE product_code = $1",
      [product_code]
    );

    if (checkProduct.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Product code already exists"
      });
    }

    // 3️⃣ Insert product
    const result = await pool.query(
      `INSERT INTO products_table
       (product_name, product_code, description, status)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [product_name, product_code, description, status]
    );

    // 4️⃣ Success response
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.log(error);

    // 5️⃣ Server error
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

});



// GET ALL PRODUCTS
router.get("/getProducts", async (req, res) => {

  try {

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Search
    const search = req.query.search || "";

    // Filter
    const status = req.query.status;

    let query = `SELECT * FROM products_table WHERE 1=1`;
    let values = [];
    let index = 1;

    // Search filter
    if (search) {
      query += ` AND (product_name ILIKE $${index} OR product_code ILIKE $${index})`;
      values.push(`%${search}%`);
      index++;
    }

    // Status filter
    if (status !== undefined) {
      query += ` AND status = $${index}`;
      values.push(status);
      index++;
    }

    // Pagination
    query += ` ORDER BY id DESC LIMIT $${index} OFFSET $${index + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    // Total count for pagination
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM products_table"
    );

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


// GET SINGLE PRODUCT
router.get("/getProduct/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      "SELECT * FROM products_table WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


// UPDATE PRODUCT
router.put("/updateProduct/:id", async (req, res) => {

  try {

    const { id } = req.params;
    const { product_name, product_code, description, status } = req.body;

    // 1️⃣ Validation
    if (!product_name || !product_code) {
      return res.status(400).json({
        success: false,
        message: "product_name and product_code are required"
      });
    }

    // 2️⃣ Check product exists
    const checkProduct = await pool.query(
      "SELECT * FROM products_table WHERE id = $1",
      [id]
    );

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 3️⃣ Duplicate code check
    const duplicate = await pool.query(
      "SELECT * FROM products_table WHERE product_code=$1 AND id != $2",
      [product_code, id]
    );

    if (duplicate.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Product code already exists"
      });
    }

    // 4️⃣ Update product
    const result = await pool.query(
      `UPDATE products_table
       SET product_name=$1,
           product_code=$2,
           description=$3,
           status=$4
       WHERE id=$5
       RETURNING *`,
      [product_name, product_code, description, status, id]
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

});


// DELETE PRODUCT
router.delete("/deleteProduct/:id", async (req, res) => {

  try {

    const { id } = req.params;

    // 1️⃣ Check if product exists
    const checkProduct = await pool.query(
      "SELECT * FROM products_table WHERE id = $1",
      [id]
    );

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 2️⃣ Delete product
    await pool.query(
      "DELETE FROM products_table WHERE id = $1",
      [id]
    );

    // 3️⃣ Response
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

});

export default router;