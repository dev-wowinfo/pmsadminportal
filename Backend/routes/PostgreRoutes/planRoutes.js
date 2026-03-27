import express from "express";
import pool from "../../db/postgres.js";
import slugify from "slugify";

const router = express.Router();

// Plan 

router.post("/addPlan", async (req, res) => {
  try {
    const { product_id, plan_name, title, description } = req.body;

    // Validation
    if (!plan_name || !title) {
      return res.status(400).json({
        success: false,
        message: "Plan name and title are required"
      });
    }

    // Generate slug
    const slug = slugify(title, { lower: true });

    const result = await pool.query(
      `INSERT INTO plans
      (product_id, plan_name, title, slug, description)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [product_id, plan_name, title, slug, description]
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

router.get("/getPlansByProduct/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM plans WHERE product_id = $1`,
      [product_id]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.log("GET PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


router.put("/updatePlan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, plan_name, title, description } = req.body;

    // Check if plan exists
    const existingPlan = await pool.query(
      `SELECT * FROM plans WHERE id = $1`,
      [id]
    );

    if (existingPlan.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    // Generate slug (if title updated)
    let slug = existingPlan.rows[0].slug;

    if (title) {
      slug = slugify(title, { lower: true }) + "-" + Date.now();
    }

    const result = await pool.query(
      `UPDATE plans
       SET product_id = $1,
           plan_name = $2,
           title = $3,
           slug = $4,
           description = $5
       WHERE id = $6
       RETURNING *`,
      [
        product_id || existingPlan.rows[0].product_id,
        plan_name || existingPlan.rows[0].plan_name,
        title || existingPlan.rows[0].title,
        slug,
        description || existingPlan.rows[0].description,
        id
      ]
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
      message: error.message
    });
  }
});

router.patch("/deactivatePlan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check plan exists
    const plan = await pool.query(
      `SELECT * FROM plans WHERE id = $1`,
      [id]
    );

    if (plan.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    // Update status to false
    const result = await pool.query(
      `UPDATE plans
       SET status = false
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Plan deactivated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("DEACTIVATE PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// Plan points

router.post("/addPlanPoints", async (req, res) => {
  try {
    const { point_name, icon, description } = req.body;

    if (!point_name) {
      return res.status(400).json({
        success: false,
        message: "Point name is required"
      });
    }

    const result = await pool.query(
      `INSERT INTO plan_points (point_name, icon, description)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [point_name, icon, description]
    );

    res.status(201).json({
      success: true,
      message: "Point created successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("ADD POINT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/assignPointsToPlan", async (req, res) => {
  try {
    const { plan_id, point_ids } = req.body;

    if (!plan_id || !Array.isArray(point_ids)) {
      return res.status(400).json({
        success: false,
        message: "plan_id and point_ids are required"
      });
    }

    // transaction start
    await pool.query("BEGIN");

    // old mapping delete (update case)
    await pool.query(
      `DELETE FROM plan_point_mapping WHERE plan_id = $1`,
      [plan_id]
    );

    // bulk insert (fast 🔥)
    const values = point_ids.map((point_id, i) =>
      `($1, $${i + 2})`
    ).join(",");

    await pool.query(
      `INSERT INTO plan_point_mapping (plan_id, point_id)
       VALUES ${values}`,
      [plan_id, ...point_ids]
    );

    await pool.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Points assigned successfully"
    });

  } catch (error) {
    await pool.query("ROLLBACK");

    console.log("ASSIGN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/getAllPoints", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, point_name FROM plan_points WHERE status = true`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.log("GET POINT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/getPlanPoints/:plan_id", async (req, res) => {
  try {
    const { plan_id } = req.params;

    const result = await pool.query(
      `SELECT pp.id, pp.point_name, pp.icon, pp.description
       FROM plan_point_mapping ppm
       JOIN plan_points pp ON pp.id = ppm.point_id
       WHERE ppm.plan_id = $1`,
      [plan_id]
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.log("GET ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// Promo code

router.post("/addPromoCode", async (req, res) => {
  try {
    const {
      plan_id,
      promo_code,
      unit_type,
      unit_value,
      valid_from,
      valid_to,
      usage_limit = 1
    } = req.body;

    if (!plan_id || !promo_code || !unit_type || !unit_value) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const result = await pool.query(
      `INSERT INTO promo_codes
      (plan_id, promo_code, unit_type, unit_value, valid_from, valid_to, usage_limit)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [plan_id, promo_code, unit_type, unit_value, valid_from, valid_to, usage_limit]
    );

    res.status(201).json({
      success: true,
      message: "Promo code created",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("PROMO ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/updatePromo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      plan_id,
      promo_code,
      unit_type,
      unit_value,
      valid_from,
      valid_to,
      usage_limit,
      is_active
    } = req.body;

    // 1️⃣ Check promo exists
    const existingPromo = await pool.query(
      "SELECT * FROM promo_codes WHERE id = $1",
      [id]
    );

    if (existingPromo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Promo code not found"
      });
    }

    // 2️⃣ Optional: validate plan_id
    if (plan_id) {
      const planCheck = await pool.query(
        "SELECT id FROM plans WHERE id = $1",
        [plan_id]
      );

      if (planCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan_id"
        });
      }
    }

    // 3️⃣ Update query (COALESCE use for partial update)
    const result = await pool.query(
      `UPDATE promo_codes SET
        plan_id = COALESCE($1, plan_id),
        promo_code = COALESCE($2, promo_code),
        unit_type = COALESCE($3, unit_type),
        unit_value = COALESCE($4, unit_value),
        valid_from = COALESCE($5, valid_from),
        valid_to = COALESCE($6, valid_to),
        usage_limit = COALESCE($7, usage_limit),
        is_active = COALESCE($8, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *`,
      [
        plan_id,
        promo_code,
        unit_type,
        unit_value,
        valid_from,
        valid_to,
        usage_limit,
        is_active,
        id
      ]
    );

    res.json({
      success: true,
      message: "Promo code updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("UPDATE PROMO ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/togglePromo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE promo_codes 
       SET is_active = NOT is_active,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      message: "Promo status toggled",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("TOGGLE PROMO ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// Plan rates

router.post("/addPlanRate", async (req, res) => {
  try {
    const {
      plan_id,
      tenure_type,
      display_price,
      selling_price,
      is_discountable = true
    } = req.body;

    if (!plan_id || !tenure_type || !display_price || !selling_price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const result = await pool.query(
      `INSERT INTO plan_rates
      (plan_id, tenure_type, display_price, selling_price, is_discountable)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [plan_id, tenure_type, display_price, selling_price, is_discountable]
    );

    res.status(201).json({
      success: true,
      message: "Plan rate added successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/updatePlanRate/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      plan_id,
      tenure_type,
      display_price,
      selling_price,
      is_discountable
    } = req.body;

    // 1️⃣ Check rate exists
    const rateCheck = await pool.query(
      "SELECT * FROM plan_rates WHERE id = $1",
      [id]
    );

    if (rateCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan rate not found"
      });
    }

    // 2️⃣ Optional: validate plan_id
    if (plan_id) {
      const planCheck = await pool.query(
        "SELECT id FROM plans WHERE id = $1",
        [plan_id]
      );

      if (planCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan_id"
        });
      }
    }

    // 3️⃣ Update
    const result = await pool.query(
      `UPDATE plan_rates SET
        plan_id = COALESCE($1, plan_id),
        tenure_type = COALESCE($2, tenure_type),
        display_price = COALESCE($3, display_price),
        selling_price = COALESCE($4, selling_price),
        is_discountable = COALESCE($5, is_discountable),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *`,
      [
        plan_id,
        tenure_type,
        display_price,
        selling_price,
        is_discountable,
        id
      ]
    );

    res.json({
      success: true,
      message: "Plan rate updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("UPDATE PLAN RATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/deletePlanRate/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE plan_rates 
       SET is_active = false,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan rate not found"
      });
    }

    res.json({
      success: true,
      message: "Plan rate deactivated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("SOFT DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// router.put("/deactivatePromo/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // check promo exists
//     const check = await pool.query(
//       "SELECT * FROM promo_codes WHERE id = $1",
//       [id]
//     );

//     if (check.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Promo code not found"
//       });
//     }

//     // deactivate
//     const result = await pool.query(
//       `UPDATE promo_codes 
//        SET is_active = false,
//            updated_at = CURRENT_TIMESTAMP
//        WHERE id = $1
//        RETURNING *`,
//       [id]
//     );

//     res.json({
//       success: true,
//       message: "Promo code deactivated successfully",
//       data: result.rows[0]
//     });

//   } catch (error) {
//     console.log("DEACTIVATE PROMO ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });


// router.put("/activatePromo/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       `UPDATE promo_codes 
//        SET is_active = true,
//            updated_at = CURRENT_TIMESTAMP
//        WHERE id = $1
//        RETURNING *`,
//       [id]
//     );

//     res.json({
//       success: true,
//       message: "Promo code activated successfully",
//       data: result.rows[0]
//     });

//   } catch (error) {
//     console.log("ACTIVATE PROMO ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });









router.post("/applyPromo", async (req, res) => {
  try {
    const { plan_id, promo_code, price } = req.body;

    if (!plan_id || !promo_code || !price) {
      return res.status(400).json({
        success: false,
        message: "plan_id, promo_code, price required"
      });
    }

    // 1️⃣ Get promo
    const promoResult = await pool.query(
      `SELECT * FROM promo_codes 
       WHERE promo_code = $1 AND plan_id = $2`,
      [promo_code, plan_id]
    );

    if (promoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid promo code"
      });
    }

    const promo = promoResult.rows[0];

    // 2️⃣ Check active
    if (!promo.is_active) {
      return res.status(400).json({
        success: false,
        message: "Promo code inactive"
      });
    }

    const now = new Date();

    // 3️⃣ Check expiry
    if (promo.valid_from && now < promo.valid_from) {
      return res.status(400).json({
        success: false,
        message: "Promo not started yet"
      });
    }

    if (promo.valid_to && now > promo.valid_to) {
      return res.status(400).json({
        success: false,
        message: "Promo expired"
      });
    }

    // 4️⃣ Usage limit
    if (promo.used_count >= promo.usage_limit) {
      return res.status(400).json({
        success: false,
        message: "Promo usage limit exceeded"
      });
    }

    // 5️⃣ Calculate discount
    let discount = 0;

    if (promo.unit_type === "percentage") {
      discount = price * (promo.unit_value / 100);
    } else {
      discount = promo.unit_value;
    }

    let final_price = price - discount;

    if (final_price < 0) final_price = 0;

    res.json({
      success: true,
      message: "Promo applied successfully",
      data: {
        original_price: price,
        discount,
        final_price
      }
    });

  } catch (error) {
    console.log("APPLY PROMO ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/consumePromo", async (req, res) => {
  try {
    const { promo_code } = req.body;

    await pool.query(
      `UPDATE promo_codes
       SET used_count = used_count + 1
       WHERE promo_code = $1`,
      [promo_code]
    );

    res.json({
      success: true,
      message: "Promo usage updated"
    });

  } catch (error) {
    console.log("CONSUME PROMO ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// router.post("/addPlan", async (req, res) => {

//   try {

//     const { product_id, plan_name, duration, price, billing_cycle, description, status } = req.body;

//     // Validation
//     if (!plan_name || !duration || !price) {
//       return res.status(400).json({
//         success: false,
//         message: "Plan name, duration and price are required"
//       });
//     }

//     const result = await pool.query(
//       `INSERT INTO plans
//       (product_id, plan_name, duration, price, billing_cycle, description, status)
//       VALUES ($1,$2,$3,$4,$5,$6,$7)
//       RETURNING *`,
//       [product_id, plan_name, duration, price, billing_cycle, description, status]
//     );

//     res.status(201).json({
//       success: true,
//       message: "Plan created successfully",
//       data: result.rows[0]
//     });

//   } catch (error) {

//     console.log("PLAN ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });

//   }

// });


// router.get("/getPlans", async (req, res) => {

//   try {

//     // Pagination
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     // Search
//     const search = req.query.search || "";

//     // Filter
//     const product_id = req.query.product_id;

//     let query = `SELECT * FROM plans WHERE 1=1`;
//     let values = [];
//     let index = 1;

//     // Search filter
//     if (search) {
//       query += ` AND plan_name ILIKE $${index}`;
//       values.push(`%${search}%`);
//       index++;
//     }

//     // Product filter
//     if (product_id) {
//       query += ` AND product_id = $${index}`;
//       values.push(product_id);
//       index++;
//     }

//     // Pagination
//     query += ` ORDER BY id DESC LIMIT $${index} OFFSET $${index+1}`;
//     values.push(limit, offset);

//     const result = await pool.query(query, values);

//     // Total count
//     const countResult = await pool.query(`SELECT COUNT(*) FROM plans`);

//     res.status(200).json({
//       success: true,
//       page,
//       limit,
//       total: parseInt(countResult.rows[0].count),
//       data: result.rows
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });

//   }

// });


// router.get("/getPlan/:id", async (req, res) => {

//   try {

//     const { id } = req.params;

//     // Validation
//     if (!id || isNaN(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid plan id"
//       });
//     }

//     // Query with product join
//     const result = await pool.query(
//       `SELECT 
//          p.id,
//          p.plan_name,
//          p.duration,
//          p.price,
//          p.billing_cycle,
//          p.description,
//          p.status,
//          p.created_at,
//          pr.product_name
//        FROM plans p
//        LEFT JOIN products_table pr 
//        ON p.product_id = pr.id
//        WHERE p.id = $1`,
//       [id]
//     );

//     // Plan not found
//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Plan not found"
//       });
//     }

//     // Success response
//     res.status(200).json({
//       success: true,
//       message: "Plan fetched successfully",
//       data: result.rows[0]
//     });

//   } catch (error) {

//     console.log("GET PLAN ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });

//   }

// });

// router.put("/updatePlan/:id", async (req, res) => {

//   try {

//     const { id } = req.params;
//     const { product_id, plan_name, duration, price, billing_cycle, description, status } = req.body;

//     // 1️⃣ Validate ID
//     if (!id || isNaN(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid plan id"
//       });
//     }

//     // 2️⃣ Check if plan exists
//     const planCheck = await pool.query(
//       "SELECT id FROM plans WHERE id=$1",
//       [id]
//     );

//     if (planCheck.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Plan not found"
//       });
//     }

//     // 3️⃣ Validate product_id (foreign key)
//     if (product_id) {
//       const productCheck = await pool.query(
//         "SELECT id FROM products_table WHERE id=$1",
//         [product_id]
//       );

//       if (productCheck.rows.length === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid product_id"
//         });
//       }
//     }

//     // 4️⃣ Update plan
//     const result = await pool.query(
//       `UPDATE plans
//        SET product_id=$1,
//            plan_name=$2,
//            duration=$3,
//            price=$4,
//            billing_cycle=$5,
//            description=$6,
//            status=$7
//        WHERE id=$8
//        RETURNING *`,
//       [product_id, plan_name, duration, price, billing_cycle, description, status, id]
//     );

//     res.status(200).json({
//       success: true,
//       message: "Plan updated successfully",
//       data: result.rows[0]
//     });

//   } catch (error) {

//     console.log("UPDATE PLAN ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });

//   }

// });


// router.delete("/deletePlan/:id", async (req, res) => {

//   try {

//     const { id } = req.params;

//     // 1️⃣ Validate ID
//     if (!id || isNaN(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid plan id"
//       });
//     }

//     // 2️⃣ Check if plan exists
//     const planCheck = await pool.query(
//       "SELECT id FROM plans WHERE id=$1",
//       [id]
//     );

//     if (planCheck.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Plan not found"
//       });
//     }

//     // 3️⃣ Soft delete (status false)
//     const result = await pool.query(
//       `UPDATE plans
//        SET status = false
//        WHERE id=$1
//        RETURNING *`,
//       [id]
//     );

//     res.status(200).json({
//       success: true,
//       message: "Plan deleted successfully",
//       data: result.rows[0]
//     });

//   } catch (error) {

//     console.log("DELETE PLAN ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });

//   }

// });


export default router;