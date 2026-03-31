import express from "express";
import pool from "../../db/postgres.js";      // PostgreSQL (new)
import { Category } from "@mui/icons-material";

const router = express.Router();


// ADD PRODUCT

router.post("/products", async (req, res) => {
  // #swagger.tags = ['Products']
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
        status: "warning",
        message: "product_name is required"
      });
    }

    // 2️⃣ Insert
    const normalizedProductName = product_name.trim();

    const productCheck = await pool.query(
      "SELECT id FROM products_table WHERE LOWER(product_name) = LOWER($1)",
      [normalizedProductName]
    );

    if (productCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: `${normalizedProductName} already exist`
      });
    }

    const result = await pool.query(
      `INSERT INTO products_table
      (product_name, category, industry_category, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [normalizedProductName, category, industry_category, description]
    );

    // 3️⃣ Response
    return res.status(201).json({
      success: true,
      status: "success",
      message: "Product added successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});

router.get("/products", async (req, res) => {
  // #swagger.tags = ['Products']
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

router.get("/productDetailById/:id", async (req, res) => {
  // #swagger.tags = ['Products']
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        id,
        product_name,
        category,
        industry_category,
        description
       FROM products_table
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Product details fetched successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});

router.put("/products/:id", async (req, res) => {
  // #swagger.tags = ['Products']
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
      return res.status(409).json({
        success: false,
        status: "warning",
        message: "Product already deleted"
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

router.delete("/products/:id", async (req, res) => {
  // #swagger.tags = ['Products']
  try {
    const { id } = req.params;

    // 1️⃣ Check if product exists
    const check = await pool.query(
      "SELECT * FROM products_table WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: "Product already deleted"
      });
    }

    // 2️⃣ Delete product
    await pool.query(
      "DELETE FROM products_table WHERE id = $1",
      [id]
    );

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Deleted successfully"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});


// Product Category

router.post("/category", async (req, res) => {
  // #swagger.tags = ['Products']
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "category_name is required"
      });
    }

    const normalizedCategoryName = category_name.trim();

    // duplicate check
    const check = await pool.query(
      "SELECT * FROM product_categories WHERE LOWER(category_name) = LOWER($1)",
      [normalizedCategoryName]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: `${normalizedCategoryName} already exist`
      });
    }

    const result = await pool.query(
      `INSERT INTO product_categories (category_name, status)
       VALUES ($1, $2)
       RETURNING *`,
      [normalizedCategoryName, true]
    );

    return res.status(201).json({
      success: true,
      status: "success",
      message: "Category created successfully",
      data: {
        ...result.rows[0],
        status: "active"
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});

router.get("/getAllCategories", async (req, res) => {
  // #swagger.tags = ['Products']
  try {
    const result = await pool.query(
      `SELECT 
        id,
        category_name,
        status
       FROM product_categories
       WHERE status = true
       ORDER BY id DESC`
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        status: "success",
        message: "No categories found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Categories fetched successfully",
      data: result.rows.map((category) => ({
        id: category.id,
        name: category.category_name,
        isActive: category.status
      }))
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});

router.put("/category/:id", async (req, res) => {
  // #swagger.tags = ['Products']
  try {
    const { id } = req.params;
    const { category_name, isActive } = req.body;

    // Check if category exists
    const check = await pool.query(
      "SELECT * FROM product_categories WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        // success: false,
        message: "Category not found"
      });
    }

    const existingCategory = check.rows[0];

    const normalizedCategoryName = category_name?.trim();
    const nextCategoryName =
      normalizedCategoryName || existingCategory.category_name;

    // 👇 Boolean handling
    const nextIsActive =
      typeof isActive === "boolean" ? isActive : existingCategory.status;

    if (!normalizedCategoryName && typeof isActive !== "boolean") {
      return res.status(400).json({
        // success: false,
        status: "warning",
        message: "Provide category_name or isActive to update"
      });
    }

    // Duplicate check
    if (normalizedCategoryName) {
      const duplicate = await pool.query(
        "SELECT * FROM product_categories WHERE category_name = $1 AND id != $2",
        [normalizedCategoryName, id]
      );

      if (duplicate.rows.length > 0) {
        return res.status(409).json({
          // success: false,
          status: "warning",
          message: "Category already exists"
        });
      }
    }

    // Update
    const result = await pool.query(
      `UPDATE product_categories
       SET category_name = $1,
           status = $2
       WHERE id = $3
       RETURNING *`,
      [nextCategoryName, nextIsActive, id]
    );

    return res.status(200).json({
      success: true,
      // status: "success",
      message: "Category updated successfully",
      data: {
        id: result.rows[0].id,
        category_name: result.rows[0].category_name,
        isActive: result.rows[0].status
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});

router.delete("/category/:id", async (req, res) => {
  // #swagger.tags = ['Products']
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

    const existingCategory = check.rows[0];

    if (existingCategory.status === false) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: `${existingCategory.category_name} already deleted`
      });
    }

    // Soft delete (deactivate)
    await pool.query(
      "UPDATE product_categories SET status = false WHERE id = $1",
      [id]
    );

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Deleted successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});



// Industry category

router.post("/industryCategory", async (req, res) => {
  // #swagger.tags = ['Products']
  try {
    const { name, is_active } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "Name is required"
      });
    }

    const normalizedIndustryName = name.trim();

    const check = await pool.query(
      "SELECT * FROM industry_categories WHERE LOWER(name) = LOWER($1)",
      [normalizedIndustryName]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: `${normalizedIndustryName} already exist`
      });
    }

    const result = await pool.query(
      `INSERT INTO industry_categories (name, is_active, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
      [normalizedIndustryName, is_active ?? true]
    );

    return res.status(201).json({
      success: true,
      status: "success",
      message: "Industry category added successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});

router.get("/industryCategory", async (req, res) => {
  // #swagger.tags = ['Products']
  try {
    const result = await pool.query(
      "SELECT * FROM industry_categories WHERE is_active = true ORDER BY id DESC"
    );

    return res.status(200).json({
      success: true,
      status: "success",
      message: result.rows.length ? "Industry categories fetched successfully" : "No industry categories found",
      data: result.rows.map((industryCategory) => ({
        id: industryCategory.id,
        name: industryCategory.name,
        isActive: industryCategory.is_active
      }))
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});

router.put("/industryCategory/:id", async (req, res) => {
  // #swagger.tags = ['Products']
  try {
    const { id } = req.params;
    const { name, is_active, isActive } = req.body;

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

    const existingIndustryCategory = check.rows[0];
    const normalizedName = name?.trim();
    const nextName = normalizedName || existingIndustryCategory.name;
    const nextIsActive =
      typeof isActive === "boolean"
        ? isActive
        : typeof is_active === "boolean"
          ? is_active
          : existingIndustryCategory.is_active;

    if (!normalizedName && typeof isActive !== "boolean" && typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "Provide name or isActive to update"
      });
    }

    if (normalizedName) {
      const duplicate = await pool.query(
        "SELECT * FROM industry_categories WHERE LOWER(name) = LOWER($1) AND id != $2",
        [normalizedName, id]
      );

      if (duplicate.rows.length > 0) {
        return res.status(409).json({
          success: false,
          status: "warning",
          message: `${normalizedName} already exist`
        });
      }
    }

    const result = await pool.query(
      `UPDATE industry_categories 
       SET name = $1, is_active = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [nextName, nextIsActive, id]
    );

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Industry category updated successfully",
      data: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        isActive: result.rows[0].is_active
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});

router.delete("/industryCategory/:id", async (req, res) => {
  // #swagger.tags = ['Products']
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

    const existingIndustryCategory = check.rows[0];

    if (existingIndustryCategory.is_active === false) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: `${existingIndustryCategory.name} already deleted`
      });
    }

    await pool.query(
      "UPDATE industry_categories SET is_active = false, updated_at = NOW() WHERE id = $1",
      [id]
    );

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Deleted successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: "Internal server error"
    });
  }
});


export default router;
