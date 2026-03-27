import express from "express";
import pool from "../../db/postgres.js";      // PostgreSQL (new)
import { Category } from "@mui/icons-material";

const router = express.Router();


// ADD PRODUCT

router.post("/addProduct", async (req, res) => {
  try {
    const {
      product_name,
      category,
      industry_category,
      description
    } = req.body;

    // 1️⃣ Validation
    if (!product_name) {
      return res.status(400).json({
        success: false,
        message: "product_name is required"
      });
    }

    // 2️⃣ Insert
    const result = await pool.query(
      `INSERT INTO products_table
      (product_name, category, industry_category, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [product_name, category, industry_category, description]
    );

    // 3️⃣ Response
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.get("/getProducts", async (req, res) => {
  try {
    const { search } = req.query;

    let query = `
      SELECT 
        id,
        product_name,
        category,
        industry_category,
        description
      FROM products_table
    `;

    let values = [];

    if (search) {
      // check agar number hai (id search)
      if (!isNaN(search)) {
        query += ` WHERE id = $1 OR product_name ILIKE $2`;
        values.push(Number(search), `%${search}%`);
      } else {
        query += ` WHERE product_name ILIKE $1`;
        values.push(`%${search}%`);
      }
    }

    query += ` ORDER BY id DESC`;

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.put("/updateProduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name,
      category,
      industry_category,
      description
    } = req.body;

    // 1️⃣ Validation
    if (!product_name) {
      return res.status(400).json({
        success: false,
        message: "product_name is required"
      });
    }

    // 2️⃣ Check if product exists
    const check = await pool.query(
      "SELECT * FROM products_table WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 3️⃣ Update
    const result = await pool.query(
      `UPDATE products_table
       SET 
         product_name = $1,
         category = $2,
         industry_category = $3,
         description = $4
       WHERE id = $5
       RETURNING *`,
      [product_name, category, industry_category, description, id]
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
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
    const check = await pool.query(
      "SELECT * FROM products_table WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
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

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


// Product Category

router.post("/addCategory", async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: "category_name is required"
      });
    }

    // duplicate check
    const check = await pool.query(
      "SELECT * FROM product_categories WHERE category_name = $1",
      [category_name]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Category already exists"
      });
    }

    const result = await pool.query(
      `INSERT INTO product_categories (category_name)
       VALUES ($1)
       RETURNING *`,
      [category_name]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.get("/getAllCategories", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id,
        category_name,
        status
       FROM product_categories
       ORDER BY id DESC`
    );

    return res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.get("/getActiveCategories", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, category_name
       FROM product_categories
       WHERE status = true
       ORDER BY category_name ASC`
    );

    return res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.put("/updateCategory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, status } = req.body;

    // Validation
    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: "category_name is required"
      });
    }

    // Check if category exists
    const check = await pool.query(
      "SELECT * FROM product_categories WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Duplicate check
    const duplicate = await pool.query(
      "SELECT * FROM product_categories WHERE category_name = $1 AND id != $2",
      [category_name, id]
    );

    if (duplicate.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Category already exists"
      });
    }

    // Update
    const result = await pool.query(
      `UPDATE product_categories
       SET category_name = $1,
           status = $2
       WHERE id = $3
       RETURNING *`,
      [category_name, status, id]
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


router.delete("/deleteCategory/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query(
      "SELECT * FROM product_categories WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Soft delete (deactivate)
    await pool.query(
      "UPDATE product_categories SET status = false WHERE id = $1",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Category deactivated successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});



// Industry category

router.post("/addIndustryCategory", async (req, res) => {
  try {
    const { name, is_active } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const check = await pool.query(
      "SELECT * FROM industry_categories WHERE LOWER(name) = LOWER($1)",
      [name]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Industry category already exists"
      });
    }

    const result = await pool.query(
      `INSERT INTO industry_categories (name, is_active, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
      [name, is_active ?? true]
    );

    return res.status(201).json({
      success: true,
      message: "Industry category added successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

router.get("/getAllIndustryCategory", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM industry_categories ORDER BY id DESC"
    );

    return res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


router.put("/updateIndustryCategory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;

    const check = await pool.query(
      "SELECT * FROM industry_categories WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Industry category not found"
      });
    }

    const result = await pool.query(
      `UPDATE industry_categories 
       SET name = $1, is_active = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [name, is_active, id]
    );

    return res.status(200).json({
      success: true,
      message: "Industry category updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


router.delete("/deleteIndustryCategory/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query(
      "SELECT * FROM industry_categories WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Industry category not found"
      });
    }

    await pool.query(
      "UPDATE industry_categories SET is_active = false, updated_at = NOW() WHERE id = $1",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Industry category deactivated successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


export default router;