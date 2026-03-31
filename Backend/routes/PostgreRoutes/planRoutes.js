import express from "express";
import pool from "../../db/postgres.js";
import slugify from "slugify";

const router = express.Router();

// Plan 

router.post("/plans", async (req, res) => {
  // #swagger.tags = ['Plans']
  const client = await pool.connect();

  try {
    const {
      product_id,
      plan_name,
      title,
      description,
      including_ids = [],
      excluding_ids = []
    } = req.body;

    if (!plan_name || !title) {
      return res.status(400).json({
        success: false,
        message: "Plan name and title required"
      });
    }

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "product_id is required"
      });
    }

    const productCheck = await client.query(
      "SELECT id FROM products_table WHERE id = $1",
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const existingPlan = await client.query(
      "SELECT id, plan_name FROM plans WHERE product_id = $1 AND status = true",
      [product_id]
    );

    if (existingPlan.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: "Plan already assigned"
      });
    }

    const slug = slugify(title, { lower: true }) + "-" + Date.now();

    await client.query("BEGIN");

    // ✅ 1. create plan
    const planResult = await client.query(
      `INSERT INTO plans
      (product_id, plan_name, title, slug, description)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [product_id, plan_name, title, slug, description]
    );

    const plan_id = planResult.rows[0].id;

    // ✅ 2. insert INCLUDING
    if (including_ids.length > 0) {
      const values = including_ids.map((_, i) => `($1,$${i + 2})`).join(",");

      await client.query(
        `INSERT INTO plan_point_mapping (plan_id, point_id)
         VALUES ${values}`,
        [plan_id, ...including_ids]
      );
    }

    // ✅ 3. insert EXCLUDING
    if (excluding_ids.length > 0) {
      const values = excluding_ids.map((_, i) => `($1,$${i + 2})`).join(",");

      await client.query(
        `INSERT INTO plan_point_mapping (plan_id, point_id)
         VALUES ${values}`,
        [plan_id, ...excluding_ids]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      status: "success",
      message: "Plan created with points",
      data: planResult.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.log(error);

    res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });

  } finally {
    client.release();
  }
});

router.get("/plansByProduct/:product_id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { product_id } = req.params;

    const productCheck = await pool.query(
      `SELECT id FROM products_table WHERE id = $1`,
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Product not found"
      });
    }

    const result = await pool.query(
      `SELECT * FROM plans WHERE product_id = $1 AND status = true ORDER BY id DESC LIMIT 1`,
      [product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "No plan assigned to this product"
      });
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Assigned plan fetched successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("GET PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.get("/getAllPlans", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const result = await pool.query(
      `SELECT * FROM plans WHERE status = true ORDER BY id DESC`
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        status: "success",
        message: "No plans found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Plans fetched successfully",
      data: result.rows
    });

  } catch (error) {
    console.log("GET ALL PLANS ERROR:", error);

    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.put("/plans/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      product_id,
      plan_name,
      title,
      description,
      including_ids = [],
      excluding_ids = []
    } = req.body;

    // 🔍 check existing
    const existingPlan = await client.query(
      `SELECT * FROM plans WHERE id = $1`,
      [id]
    );

    if (existingPlan.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    const oldPlan = existingPlan.rows[0];

    // slug update only if title changed
    let slug = oldPlan.slug;
    if (title && title !== oldPlan.title) {
      slug = slugify(title, { lower: true }) + "-" + Date.now();
    }

    await client.query("BEGIN");

    // ✅ 1. update plan
    const updatedPlan = await client.query(
      `UPDATE plans
       SET product_id = $1,
           plan_name = $2,
           title = $3,
           slug = $4,
           description = $5
       WHERE id = $6
       RETURNING *`,
      [
        product_id || oldPlan.product_id,
        plan_name || oldPlan.plan_name,
        title || oldPlan.title,
        slug,
        description || oldPlan.description,
        id
      ]
    );

    // ✅ 2. delete old mappings
    await client.query(
      `DELETE FROM plan_point_mapping WHERE plan_id = $1`,
      [id]
    );

    // ✅ 3. insert INCLUDING
    if (including_ids.length > 0) {
      const values = including_ids
        .map((_, i) => `($1,$${i + 2})`)
        .join(",");

      await client.query(
        `INSERT INTO plan_point_mapping (plan_id, point_id)
         VALUES ${values}`,
        [id, ...including_ids]
      );
    }

    // ✅ 4. insert EXCLUDING
    if (excluding_ids.length > 0) {
      const values = excluding_ids
        .map((_, i) => `($1,$${i + 2})`)
        .join(",");

      await client.query(
        `INSERT INTO plan_point_mapping (plan_id, point_id)
         VALUES ${values}`,
        [id, ...excluding_ids]
      );
    }

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Plan updated with points",
      data: updatedPlan.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.log("UPDATE PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {
    client.release();
  }
});

router.patch("/plans/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
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


router.post("/planPoints", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { point_name, icon, description, type } = req.body;

    if (!point_name || !type) {
      return res.status(400).json({
        success: false,
        message: "Point name and type required"
      });
    }

    const result = await pool.query(
      `INSERT INTO plan_points (point_name, icon, description, type)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [point_name, icon, description, type]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/assignPointsToPlan", async (req, res) => {
  // #swagger.tags = ['Plans']
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

router.get("/planPoints", async (req, res) => {
  // #swagger.tags = ['Plans']
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

router.get("/planPoints/:plan_id", async (req, res) => {
  // #swagger.tags = ['Plans']
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

router.post("/promoCode", async (req, res) => {
  // #swagger.tags = ['Plans']
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

router.put("/promoCode/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
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

router.put("/promoCodeToggle/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
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

router.post("/planRate", async (req, res) => {
  // #swagger.tags = ['Plans']
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

router.put("/planRate/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
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

router.put("/planRateToggle/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;

    // 1️⃣ Check record exists
    const check = await pool.query(
      "SELECT * FROM plan_rates WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan rate not found"
      });
    }

    // 2️⃣ Toggle is_active
    const result = await pool.query(
      `UPDATE plan_rates 
       SET is_active = NOT is_active,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      message: "Plan rate status toggled successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("TOGGLE PLAN RATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



// // Promo code 

// router.post("/applyPromo", async (req, res) => {
// #swagger.tags = ['Plans']
//   try {
//     const { plan_id, promo_code, price } = req.body;

//     if (!plan_id || !promo_code || !price) {
//       return res.status(400).json({
//         success: false,
//         message: "plan_id, promo_code, price required"
//       });
//     }

//     // 1️⃣ Get promo
//     const promoResult = await pool.query(
//       `SELECT * FROM promo_codes 
//        WHERE promo_code = $1 AND plan_id = $2`,
//       [promo_code, plan_id]
//     );

//     if (promoResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Invalid promo code"
//       });
//     }

//     const promo = promoResult.rows[0];

//     // 2️⃣ Check active
//     if (!promo.is_active) {
//       return res.status(400).json({
//         success: false,
//         message: "Promo code inactive"
//       });
//     }

//     const now = new Date();

//     // 3️⃣ Check expiry
//     if (promo.valid_from && now < promo.valid_from) {
//       return res.status(400).json({
//         success: false,
//         message: "Promo not started yet"
//       });
//     }

//     if (promo.valid_to && now > promo.valid_to) {
//       return res.status(400).json({
//         success: false,
//         message: "Promo expired"
//       });
//     }

//     // 4️⃣ Usage limit
//     if (promo.used_count >= promo.usage_limit) {
//       return res.status(400).json({
//         success: false,
//         message: "Promo usage limit exceeded"
//       });
//     }

//     // 5️⃣ Calculate discount
//     let discount = 0;

//     if (promo.unit_type === "percentage") {
//       discount = price * (promo.unit_value / 100);
//     } else {
//       discount = promo.unit_value;
//     }

//     let final_price = price - discount;

//     if (final_price < 0) final_price = 0;

//     res.json({
//       success: true,
//       message: "Promo applied successfully",
//       data: {
//         original_price: price,
//         discount,
//         final_price
//       }
//     });

//   } catch (error) {
//     console.log("APPLY PROMO ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// router.post("/consumePromo", async (req, res) => {
// #swagger.tags = ['Plans']
//   try {
//     const { promo_code } = req.body;

//     await pool.query(
//       `UPDATE promo_codes
//        SET used_count = used_count + 1
//        WHERE promo_code = $1`,
//       [promo_code]
//     );

//     res.json({
//       success: true,
//       message: "Promo usage updated"
//     });

//   } catch (error) {
//     console.log("CONSUME PROMO ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });



export default router;
