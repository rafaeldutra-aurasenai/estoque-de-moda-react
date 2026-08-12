import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tag from "../components/Tag.jsx";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const API_URL = "http://localhost:3001/api/pedidos";
const filters = ["Todos", "Pendentes", "Enviados", "Entregues", "Cancelados"];
const filterToStatus = { Pendentes: "Pendente", Enviados: "Enviado", Entregues: "Entregue", Cancelados: "Cancelado" };
const formatador = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function Orders() {
  usePageHeader("operação / pedidos", "Pedidos");
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
        setOrders(await res.json());
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Erro ao carregar pedidos");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
    return () => controller.abort();
  }, []);

  const filteredOrders =
    activeFilter === "Todos" ? orders : orders.filter((o) => o.status === filterToStatus[activeFilter]);

  return (
    <div>
      <div className="toolbar">
        <div className="filter-row">
          {filters.map((f) => (
            <button
              key={f}
              className={"filter-pill" + (activeFilter === f ? " active" : "")}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate("/app/pedidos/novo")}>
          + Novo pedido
        </button>
      </div>

      <div className="card">
        {loading && <p style={{ padding: 16 }}>Carregando pedidos…</p>}
        {error && <p style={{ padding: 16, color: "var(--danger, red)" }}>Erro: {error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr><th>Pedido</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Data</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 16 }}>Nenhum pedido encontrado.</td></tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/app/pedidos/${o.id}`)}>
                    <td style={{ fontWeight: 700 }}>#{o.id}</td>
                    <td>{o.client_name}</td>
                    <td>{o.items}</td>
                    <td>{formatador.format(o.total)}</td>
                    <td>{new Date(o.criado_em).toLocaleDateString("pt-BR")}</td>
                    <td><Tag status={o.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}