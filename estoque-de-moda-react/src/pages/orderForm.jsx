import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const PEDIDOS_URL = "http://localhost:3001/api/pedidos";
const PRODUTOS_URL = "http://localhost:3001/api/produtos";
const formatador = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

let nextItemId = 1;

export default function OrderForm() {
  usePageHeader("operação / pedidos / novo", "Novo pedido");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [client, setClient] = useState({ client_name: "", client_email: "", city: "", freight: "0" });
  const [items, setItems] = useState([{ id: nextItemId++, sku: "", qty: 1, variant: "" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(PRODUTOS_URL)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setError("Não foi possível carregar os produtos"));
  }, []);

  function updateItem(id, field, value) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { id: nextItemId++, sku: "", qty: 1, variant: "" }]);
  }
  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }
  function findProduct(sku) {
    return products.find((p) => p.sku === sku);
  }

  const subtotal = items.reduce((acc, it) => {
    const p = findProduct(it.sku);
    return p ? acc + (p.priceValue || 0) * Number(it.qty || 0) : acc;
  }, 0);
  const total = subtotal + Number(client.freight || 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!client.client_name.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }
    const validItems = items.filter((it) => it.sku && Number(it.qty) > 0);
    if (validItems.length === 0) {
      setError("Adicione ao menos um produto com quantidade válida.");
      return;
    }
    for (const it of validItems) {
      const p = findProduct(it.sku);
      if (p && Number(it.qty) > p.stock) {
        setError(`Estoque insuficiente para "${p.name}" (disponível: ${p.stock}).`);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch(PEDIDOS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: client.client_name,
          client_email: client.client_email,
          city: client.city,
          freight: Number(client.freight || 0),
          items: validItems.map((it) => ({ sku: it.sku, qty: Number(it.qty), variant: it.variant })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao criar pedido");

      navigate(`/app/pedidos/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-shell">
      <div className="form-card">
        <h4>Cliente</h4>
        <div className="field">
          <label>Nome</label>
          <input
            placeholder="Nome do cliente"
            value={client.client_name}
            onChange={(e) => setClient((prev) => ({ ...prev, client_name: e.target.value }))}
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label>E-mail</label>
            <input
              placeholder="cliente@email.com"
              value={client.client_email}
              onChange={(e) => setClient((prev) => ({ ...prev, client_email: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Cidade / UF</label>
            <input
              placeholder="São Paulo, SP"
              value={client.city}
              onChange={(e) => setClient((prev) => ({ ...prev, city: e.target.value }))}
            />
          </div>
        </div>
        <div className="field">
          <label>Frete (R$)</label>
          <input
            type="number" min="0" step="0.01"
            value={client.freight}
            onChange={(e) => setClient((prev) => ({ ...prev, freight: e.target.value }))}
          />
        </div>
      </div>

      <div className="form-card">
        <h4>Itens do pedido</h4>
        {items.map((it) => {
          const p = findProduct(it.sku);
          return (
            <div className="field-row" key={it.id} style={{ alignItems: "flex-end" }}>
              <div className="field" style={{ flex: 2 }}>
                <label>Produto</label>
                <select value={it.sku} onChange={(e) => updateItem(it.id, "sku", e.target.value)}>
                  <option value="">Selecione…</option>
                  {products.map((prod) => (
                    <option key={prod.sku} value={prod.sku}>
                      {prod.name} — {prod.price} (estoque: {prod.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Variação</label>
                <input
                  placeholder="M · Vinho"
                  value={it.variant}
                  onChange={(e) => updateItem(it.id, "variant", e.target.value)}
                />
              </div>
              <div className="field" style={{ maxWidth: 90 }}>
                <label>Qtd.</label>
                <input
                  type="number" min="1" max={p ? p.stock : undefined}
                  value={it.qty}
                  onChange={(e) => updateItem(it.id, "qty", e.target.value)}
                />
              </div>
              <button
                type="button" className="btn btn-ghost btn-sm"
                onClick={() => removeItem(it.id)} disabled={items.length === 1}
              >
                Remover
              </button>
            </div>
          );
        })}
        <button type="button" className="btn btn-ghost btn-sm" onClick={addItem} style={{ marginTop: 8 }}>
          + Adicionar produto
        </button>

        <div className="kv-row" style={{ marginTop: 16 }}>
          <span>Subtotal</span><span>{formatador.format(subtotal)}</span>
        </div>
        <div className="kv-row">
          <span>Total (com frete)</span><span>{formatador.format(total)}</span>
        </div>
      </div>

      {error && <p style={{ color: "var(--danger, red)" }}>{error}</p>}

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={() => navigate("/app/pedidos")}>Cancelar</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? "Criando…" : "Criar pedido"}
        </button>
      </div>
    </div>
  );
}