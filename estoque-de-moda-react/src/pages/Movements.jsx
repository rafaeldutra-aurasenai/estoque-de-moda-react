import { useState, useEffect } from "react";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const MOV_URL = "http://localhost:3001/api/movimentacoes";
const PROD_URL = "http://localhost:3001/api/produtos";
const MOTIVOS = ["Compra de fornecedor", "Venda", "Ajuste de inventário", "Devolução"];

export default function Movements() {
  usePageHeader("operação / movimentações", "Movimentações de estoque");

  const [moves, setMoves] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ sku: "", type: "in", qty: "", reason: MOTIVOS[0] });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  async function fetchMoves() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(MOV_URL);
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      setMoves(await res.json());
    } catch (err) {
      setError(err.message || "Erro ao carregar movimentações");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMoves();
    fetch(PROD_URL).then((res) => res.json()).then(setProducts).catch(() => {});
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setFormError(null);

    if (!form.sku || !form.qty || Number(form.qty) <= 0) {
      setFormError("Selecione um produto e informe uma quantidade válida.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(MOV_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: form.sku, type: form.type, qty: Number(form.qty), reason: form.reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao registrar movimentação");

      setForm({ sku: "", type: "in", qty: "", reason: MOTIVOS[0] });
      fetchMoves();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid-3">
      <div className="card">
        <div className="section-head"><h3>Histórico de movimentações</h3></div>
        <div>
          {loading && <p style={{ padding: 16 }}>Carregando…</p>}
          {error && <p style={{ padding: 16, color: "var(--danger, red)" }}>Erro: {error}</p>}
          {!loading && !error && moves.length === 0 && (
            <p style={{ padding: 16 }}>Nenhuma movimentação registrada ainda.</p>
          )}
          {!loading && !error && moves.map((m) => (
            <div className="move-row" key={m.id}>
              <div className={`move-ic ${m.type}`}>{m.type === "in" ? "↓" : "↑"}</div>
              <div className="move-body">
                <div className="move-title">{m.type === "in" ? "Entrada" : "Saída"} · {m.product_name}</div>
                <div className="move-sub">{m.reason} · {new Date(m.criado_em).toLocaleString("pt-BR")}</div>
              </div>
              <div className="move-qty" style={{ color: m.type === "in" ? "var(--success)" : "var(--danger)" }}>
                {m.type === "in" ? "+" : "-"}{m.qty}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-card" style={{ alignSelf: "start" }}>
        <h4>Registrar movimentação</h4>
        <div className="field">
          <label>Produto</label>
          <select value={form.sku} onChange={(e) => handleChange("sku", e.target.value)}>
            <option value="">Selecione um produto…</option>
            {products.map((p) => (
              <option key={p.sku} value={p.sku}>{p.name} ({p.sku})</option>
            ))}
          </select>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Tipo</label>
            <select value={form.type} onChange={(e) => handleChange("type", e.target.value)}>
              <option value="in">Entrada</option>
              <option value="out">Saída</option>
            </select>
          </div>
          <div className="field">
            <label>Quantidade</label>
            <input type="number" min="1" placeholder="0" value={form.qty} onChange={(e) => handleChange("qty", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Motivo</label>
          <select value={form.reason} onChange={(e) => handleChange("reason", e.target.value)}>
            {MOTIVOS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        {formError && <p style={{ color: "var(--danger, red)", fontSize: 13 }}>{formError}</p>}
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleConfirm} disabled={saving}>
          {saving ? "Registrando…" : "Confirmar movimentação"}
        </button>
      </div>
    </div>
  );
}