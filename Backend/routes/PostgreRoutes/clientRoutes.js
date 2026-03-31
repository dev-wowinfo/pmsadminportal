import express from "express";
import pool from "../../db/postgres.js";

const router = express.Router();

const sendSuccess = (res, statusCode, message, data, extra = {}) => {
    return res.status(statusCode).json({
        success: true,
        status: "success",
        message,
        ...extra,
        data
    });
};

const sendWarning = (res, statusCode, message, extra = {}) => {
    return res.status(statusCode).json({
        success: false,
        status: "warning",
        message,
        ...extra
    });
};

const sendError = (res, message = "Internal server error") => {
    return res.status(500).json({
        success: false,
        status: "error",
        message
    });
};

router.post("/clients", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const {
            company_name,
            company_type,
            company_size,
            company_industry,
            tax_info,
            address_line1,
            address_line2,
            country,
            state,
            city,
            email,
            phone
        } = req.body;

        // Basic validation
        if (!company_name) {
            return sendWarning(res, 400, "Company name is required");
        }

        const result = await pool.query(
            `INSERT INTO clients (
        company_name, company_type, company_size, company_industry, tax_info,
        address_line1, address_line2, country, state, city, email, phone
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
            [
                company_name,
                company_type,
                company_size,
                company_industry,
                tax_info,
                address_line1,
                address_line2,
                country,
                state,
                city,
                email,
                phone
            ]
        );

        return sendSuccess(res, 201, "Client added successfully", result.rows[0]);

    } catch (error) {
        console.error("CLIENT ERROR:", error);
        return sendError(res, error.message);
    }
});

router.put("/clients/:id", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const { id } = req.params;

        const {
            company_name,
            company_type,
            company_size,
            company_industry,
            tax_info,
            address_line1,
            address_line2,
            country,
            state,
            city,
            email,
            phone
        } = req.body;

        // Check client exists
        const existing = await pool.query(
            "SELECT * FROM clients WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return sendWarning(res, 404, "Client not found");
        }

        const result = await pool.query(
            `UPDATE clients SET
        company_name = $1,
        company_type = $2,
        company_size = $3,
        company_industry = $4,
        tax_info = $5,
        address_line1 = $6,
        address_line2 = $7,
        country = $8,
        state = $9,
        city = $10,
        email = $11,
        phone = $12
      WHERE id = $13
      RETURNING *`,
            [
                company_name,
                company_type,
                company_size,
                company_industry,
                tax_info,
                address_line1,
                address_line2,
                country,
                state,
                city,
                email,
                phone,
                id
            ]
        );

        return sendSuccess(res, 200, "Client updated successfully", result.rows[0]);

    } catch (error) {
        console.error("UPDATE CLIENT ERROR:", error);
        return sendError(res, error.message);
    }
});

router.get("/clients", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        let { search = "", page = 1, limit = 10, country, state, city } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        let query = `SELECT * FROM clients WHERE is_active = true`;
        let countQuery = `SELECT COUNT(*) FROM clients WHERE is_active = true`;

        let values = [];
        let index = 1;

        // 🔍 Search (minimum 3 letters, partial word match, case-insensitive)
        if (search && search.trim().length >= 3) {
            const words = search.trim().split(/\s+/);
            const wordConditions = words.map((_, i) => `company_name ILIKE $${index + i}`);
            query += ` AND (${wordConditions.join(" AND ")})`;
            countQuery += ` AND (${wordConditions.join(" AND ")})`;
            words.forEach(word => values.push(`%${word}%`)); // partial match
            index += words.length;
        }

        // 🌍 Filters
        if (country) { query += ` AND country = $${index}`; countQuery += ` AND country = $${index}`; values.push(country); index++; }
        if (state) { query += ` AND state = $${index}`; countQuery += ` AND state = $${index}`; values.push(state); index++; }
        if (city) { query += ` AND city = $${index}`; countQuery += ` AND city = $${index}`; values.push(city); index++; }

        // 📄 Pagination
        query += ` ORDER BY id DESC LIMIT $${index} OFFSET $${index + 1}`;
        values.push(limit, offset);

        const data = await pool.query(query, values);

        // Count total
        const countValues = values.slice(0, values.length - 2);
        const totalResult = await pool.query(countQuery, countValues);
        const total = parseInt(totalResult.rows[0].count);

        if (data.rows.length === 0) {
            return res.status(204).send();
        }

        return sendSuccess(res, 200, "Clients fetched successfully", data.rows, {
            total,
            page,
            limit
        });

    } catch (error) {
        console.error("GET CLIENTS ERROR:", error);
        return sendError(res);
    }
});

router.patch("/clients/:id/deactivate", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE clients SET is_active = false WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return sendWarning(res, 404, "Client not found");
        }

        return sendSuccess(res, 200, "Client deactivated", result.rows[0]);

    } catch (error) {
        return sendError(res, error.message);
    }
});


export default router;
