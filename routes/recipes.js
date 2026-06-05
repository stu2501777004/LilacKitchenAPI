const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM recipes ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Recipe not found." });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, image_url, category, ingredients, instructions, created_by } = req.body;

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ message: "Title, ingredients and instructions are required." });
        }

        const result = await pool.query(
            `INSERT INTO recipes (title, image_url, category, ingredients, instructions, created_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [title, image_url, category, ingredients, instructions, created_by || null]
        );

        res.status(201).json({
            message: "Recipe created successfully.",
            recipe: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { title, image_url, category, ingredients, instructions } = req.body;

        const result = await pool.query(
            `UPDATE recipes
             SET title = $1, image_url = $2, category = $3, ingredients = $4, instructions = $5
             WHERE id = $6
             RETURNING *`,
            [title, image_url, category, ingredients, instructions, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Recipe not found." });
        }

        res.json({
            message: "Recipe updated successfully.",
            recipe: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM recipes WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Recipe not found." });
        }

        res.json({ message: "Recipe deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;