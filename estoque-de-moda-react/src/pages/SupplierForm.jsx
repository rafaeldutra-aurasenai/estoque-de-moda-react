import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const API_URL = "http://localhost:3001/api/fornecedores";

export default function SupplierForm() {
  usePageHeader("operação / fornecedores / novo", "Novo fornecedor");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    cnpj: "",
    cat: "Vestidos",
    phone: "",
    email: "",
    products: "",
    status: "Ativo",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.cat.trim()) {
      setError("Preencha ao menos a razão social e a categoria.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);

      navigate("/app/fornecedores");
    } catch (err) {
      setError(err.message || "Erro ao salvar fornecedor");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-shell">
      <div className="form-card">
        <h4>Dados do fornecedor</h4>
        <div className="field">
          <label>Razão social</label>
          <input
            placeholder="Textura Confecções Ltda."
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label>CNPJ</label>
            <input
              placeholder="00.000.000/0001-00"
              value={form.cnpj}
              onChange={(e) => handleChange("cnpj", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Categoria fornecida</label>
            <select value={form.cat} onChange={(e) => handleChange("cat", e.target.value)}>
              <option>Vestidos</option>
              <option>Blusas</option>
              <option>Calças</option>
              <option>Saias</option>
              <option>Acessórios</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-card">
        <h4>Contato</h4>
        <div className="field-row">
          <div className="field">
            <label>Telefone</label>
            <input
              placeholder="(11) 90000-0000"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input
              placeholder="contato@fornecedor.com.br"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label>Produtos fornecidos</label>
          <input
            placeholder="Vestidos, Saias"
            value={form.products}
            onChange={(e) => handleChange("products", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Status</label>
          <select value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
            <option>Ativo</option>
            <option>Inativo</option>
            <option>Pendente</option>
          </select>
        </div>
      </div>

      {error && <p style={{ color: "var(--danger, red)" }}>{error}</p>}

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={() => navigate("/app/fornecedores")}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando…" : "Salvar fornecedor"}
        </button>
      </div>
    </div>
  );
}