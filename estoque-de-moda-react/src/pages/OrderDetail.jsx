import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Tag from "../components/Tag.jsx";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const API_URL = "http://localhost:3001/api/pedidos";
const formatador = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shipping, setShipping] = useState(false);

  async function fetchOrder() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error(res.status === 404 ? "Pedido não encontrado" : `Erro ${res.status}`);
      setOrder(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrder(); }, [id]);

  usePageHeader("operação / pedidos / detalhe", order ? `Pedido #${order.id}` : "Pedido");

  async function handleShip() {
    setShipping(true);
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Enviado" }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar status");
      fetchOrder();
    } catch (err) {
      alert(err.message);
    } finally {
      setShipping(false);
    }
  }

  if (loading) return <p style={{ padding: 16 }}>Carregando pedido…</p>;

  if (error || !order) {
    return (
      <div>
        <p>{error || "Pedido não encontrado."}</p>
        <Link to="/app/pedidos" style={{ color: "var(--accent)", fontWeight: 600 }}>← Voltar para pedidos</Link>
      </div>
    );
  }

  const totalItens = order.itens.reduce((acc, l) => acc + l.qty * l.price, 0);
  const total = totalItens + Number(order.freight);

  return (
    <div>
      <a
        className="link"
        href="#"
        onClick={(e) => { e.preventDefault(); navigate("/app/pedidos"); }}
        style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}
      >
        ← Voltar para pedidos
      </a>

      <div className="grid-3" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="section-head">
            <h3>Pedido #{order.id}</h3>
            <Tag status={order.status} />
          </div>
          <table>
            <thead><tr><th>Produto</th><th>Qtd.</th><th>Preço</th><th>Subtotal</th></tr></thead>
            <tbody>
              {order.itens.map((l) => (
                <tr key={l.id}>
                  <td className="prod-cell">
                    <div className="prod-thumb" style={{ background: l.color }}>{l.emoji}</div>
                    <div><div className="pname">{l.name}</div><div className="psku">{l.variant}</div></div>
                  </td>
                  <td>{l.qty}</td>
                  <td>{formatador.format(l.price)}</td>
                  <td>{formatador.format(l.qty * l.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="form-card" style={{ alignSelf: "start" }}>
          <h4>Cliente</h4>
          <div className="kv-row"><span>Nome</span><span>{order.client_name}</span></div>
          <div className="kv-row"><span>E-mail</span><span>{order.client_email}</span></div>
          <div className="kv-row"><span>Endereço</span><span>{order.city}</span></div>
          <div className="kv-row"><span>Frete</span><span>{formatador.format(order.freight)}</span></div>
          <div className="kv-row"><span>Total</span><span>{formatador.format(total)}</span></div>
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 14 }}
            onClick={handleShip}
            disabled={shipping || order.status !== "Pendente"}
          >
            {order.status === "Pendente" ? (shipping ? "Enviando…" : "Marcar como enviado") : `Status: ${order.status}`}
          </button>
        </div>
      </div>
    </div>
  );
}