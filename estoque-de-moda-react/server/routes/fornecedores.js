import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET /api/fornecedores — lista, com busca opcional (?q=texto)
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    let query = "SELECT * FROM fornecedores";
    const params = [];

    if (q) {
      query += " WHERE name LIKE ? OR cat LIKE ? OR email LIKE ? OR cnpj LIKE ?";
      const term = `%${q}%`;
      params.push(term, term, term, term);
    }

    query += " ORDER BY name ASC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar fornecedores" });
  }
});

// GET /api/fornecedores/:id — detalhe de um fornecedor
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fornecedores WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar fornecedor" });
  }
});

// POST /api/fornecedores — cria novo fornecedor
router.post("/", async (req, res) => {
  try {
    const { name, cnpj, cat, phone, email, products, status } = req.body;

    if (!name || !cat) {
      return res.status(400).json({ error: "Preencha ao menos nome e categoria" });
    }

    const [result] = await pool.query(
      "INSERT INTO fornecedores (name, cnpj, cat, phone, email, products, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, cnpj || null, cat, phone || null, email || null, products || null, status || "Ativo"]
    );
    const [rows] = await pool.query("SELECT * FROM fornecedores WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar fornecedor" });
  }
});

// PUT /api/fornecedores/:id — atualiza fornecedor existente
router.put("/:id", async (req, res) => {
  try {
    const { name, cnpj, cat, phone, email, products, status } = req.body;
    await pool.query(
      "UPDATE fornecedores SET name=?, cnpj=?, cat=?, phone=?, email=?, products=?, status=? WHERE id=?",
      [name, cnpj || null, cat, phone || null, email || null, products || null, status, req.params.id]
    );
    const [rows] = await pool.query("SELECT * FROM fornecedores WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Fornecedor não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar fornecedor" });
  }
});

// DELETE /api/fornecedores/:id — remove fornecedor
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM fornecedores WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Fornecedor não encontrado" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir fornecedor" });
  }
});

export default router;