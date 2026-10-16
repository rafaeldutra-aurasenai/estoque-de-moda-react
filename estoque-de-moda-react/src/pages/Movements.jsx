
import { useState, useEffect, useCallback } from "react";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const MOV_URL = "http://localhost:3001/api/movimentacoes";
const PROD_URL = "http://localhost:3001/api/produtos";
const MOTIVOS = [
  "Compra de fornecedor",
  "Venda",
  "Ajuste de inventário",
  "Devolução",
];

// Aceita uma lista direta ou uma lista dentro de um objeto.
function getList(data, keys = []) {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    for (const key of keys) {
      if (Array.isArray(data[key])) return data[key];
    }
  }

  return null;
}

async function readResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.erro ||
      data?.error ||
      `Erro ${response.status}: ${response.statusText}`
    );
  }

  return data;
}

export default function Movements() {
  usePageHeader("operação / movimentações", "Movimentações de estoque");

  const [moves, setMoves] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    sku: "",
    type: "in",
    qty: "",
    reason: MOTIVOS[0],
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [movesResponse, productsResponse] = await Promise.all([
        fetch(MOV_URL),
        fetch(PROD_URL),
      ]);

      const [movesData, productsData] = await Promise.all([
        readResponse(movesResponse),
        readResponse(productsResponse),
      ]);

      const movesList = getList(movesData, [
        "movimentacoes",
        "movements",
        "data",
      ]);

      const productsList = getList(productsData, [
        "produtos",
        "products",
        "data",
      ]);

      if (!movesList) {
        throw new Error(
          "A API de movimentações não retornou uma lista válida."
        );
      }

      if (!productsList) {
        throw new Error(
          "A API de produtos não retornou uma lista válida."
        );
      }

      setMoves(movesList);
      setProducts(productsList);
    } catch (err) {
      setError(err.message || "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
    setSuccess(null);
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    const quantity = Number(form.qty);

    if (!form.sku || !Number.isInteger(quantity) || quantity <= 0) {
      setFormError(
        "Selecione um produto e informe uma quantidade inteira maior que zero."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(MOV_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sku: form.sku,
          type: form.type,
          qty: quantity,
          reason: form.reason,
        }),
      });

      await readResponse(response);

      setForm({
        sku: "",
        type: "in",
        qty: "",
        reason: MOTIVOS[0],
      });

      setSuccess("Movimentação registrada com sucesso.");

      await loadData();
    } catch (err) {
      setFormError(
        err.message || "Não foi possível registrar a movimentação."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid-3">
      <div className="card">
        <div className="section-head">
          <h3>Histórico de movimentações</h3>
          <button
            type="button"
            className="btn"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? "Carregando…" : "Atualizar"}
          </button>
        </div>

        {loading && (
          <p style={{ padding: 16 }}>Carregando movimentações e produtos…</p>
        )}

        {error && (
          <div style={{ padding: 16, color: "var(--danger, red)" }}>
            <p>Erro: {error}</p>
            <button type="button" onClick={loadData}>
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && moves.length === 0 && (
          <p style={{ padding: 16 }}>
            Nenhuma movimentação registrada ainda.
          </p>
        )}

        {!loading &&
          !error &&
          moves.map((m) => (
            <div className="move-row" key={m.id}>
              <div className={`move-ic ${m.type}`}>
                {m.type === "in" ? "↓" : "↑"}
              </div>

              <div className="move-body">
                <div className="move-title">
                  {m.type === "in" ? "Entrada" : "Saída"} ·{" "}
                  {m.product_name || m.nome_produto || m.sku || "Produto"}
                </div>

                <div className="move-sub">
                  {m.reason || m.motivo || "Sem motivo informado"} ·{" "}
                  {m.criado_em
                    ? new Date(m.criado_em).toLocaleString("pt-BR")
                    : "Data não informada"}
                </div>
              </div>

              <div
                className="move-qty"
                style={{
                  color:
                    m.type === "in"
                      ? "var(--success)"
                      : "var(--danger)",
                }}
              >
                {m.type === "in" ? "+" : "-"}
                {m.qty ?? m.quantidade ?? 0}
              </div>
            </div>
          ))}
      </div>

      <form
        className="form-card"
        style={{ alignSelf: "start" }}
        onSubmit={handleConfirm}
      >
        <h4>Registrar movimentação</h4>

        <div className="field">
          <label htmlFor="movement-product">Produto</label>
          <select
            id="movement-product"
            value={form.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
            required
          >
            <option value="">Selecione um produto…</option>

            {products.map((p) => (
              <option key={p.sku} value={p.sku}>
                {p.name || p.nome || p.nome_produto || p.sku} ({p.sku})
              </option>
            ))}
          </select>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="movement-type">Tipo</label>
            <select
              id="movement-type"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="in">Entrada</option>
              <option value="out">Saída</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="movement-quantity">Quantidade</label>
            <input
              id="movement-quantity"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={form.qty}
              onChange={(e) => handleChange("qty", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="movement-reason">Motivo</label>
          <select
            id="movement-reason"
            value={form.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
          >
            {MOTIVOS.map((motivo) => (
              <option key={motivo} value={motivo}>
                {motivo}
              </option>
            ))}
          </select>
        </div>

        {formError && (
          <p role="alert" style={{ color: "var(--danger, red)", fontSize: 13 }}>
            {formError}
          </p>
        )}

        {success && (
          <p role="status" style={{ color: "var(--success, green)", fontSize: 13 }}>
            {success}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
          disabled={saving || loading || !!error}
        >
          {saving ? "Registrando…" : "Confirmar movimentação"}
        </button>
      </form>
    </div>
  );
}
