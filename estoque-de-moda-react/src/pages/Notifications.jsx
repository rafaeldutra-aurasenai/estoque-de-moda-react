import { useCallback, useEffect, useMemo, useState } from "react";
import { usePageHeader } from "../components/PageHeaderContext.jsx";
import { apiFetch, getUsuario } from "../auth.js";

const API_URL = "http://localhost:3001/api";

function getList(data, keys) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    for (const key of keys) if (Array.isArray(data[key])) return data[key];
  }
  return [];
}

function formatDate(value) {
  if (!value) return "Data não informada";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Data não informada" : date.toLocaleString("pt-BR");
}

export default function Notifications() {
  usePageHeader("conta / notificações", "Notificações");
  const usuario = getUsuario();
  const userKey = usuario?.id ?? usuario?.email ?? "usuario";
  const readKey = `estoque_moda_notificacoes_lidas_${userKey}`;
  const [products, setProducts] = useState([]);
  const [moves, setMoves] = useState([]);
  const [lidas, setLidas] = useState(() => {
    try { return JSON.parse(localStorage.getItem(readKey) || "[]"); } catch { return []; }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const carregar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [prodRes, movRes] = await Promise.all([
        apiFetch(`${API_URL}/produtos`),
        apiFetch(`${API_URL}/movimentacoes`),
      ]);
      const [prodData, movData] = await Promise.all([
        prodRes.json().catch(() => ({})),
        movRes.json().catch(() => ({})),
      ]);
      if (!prodRes.ok) throw new Error(prodData.mensagem || prodData.erro || `Falha ao consultar produtos (${prodRes.status}).`);
      if (!movRes.ok) throw new Error(movData.mensagem || movData.erro || `Falha ao consultar movimentações (${movRes.status}).`);
      setProducts(getList(prodData, ["produtos", "products", "data"]));
      setMoves(getList(movData, ["movimentacoes", "movements", "data"]));
    } catch (err) {
      setError(err.message || "Não foi possível carregar as notificações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => {
    try { localStorage.setItem(readKey, JSON.stringify(lidas)); } catch { /* armazenamento indisponível */ }
  }, [lidas, readKey]);

  const notifications = useMemo(() => {
    const alertasEstoque = products.flatMap((p) => {
      const estoque = Number(p.stock ?? p.estoque ?? 0);
      const minimo = Number(p.min_stock ?? p.min ?? p.estoque_minimo ?? 0);
      const nome = p.name || p.nome || p.nome_produto || p.sku || "Produto";
      if (estoque <= 0) return [{ id: `sem-estoque-${p.sku || p.id}`, type: "danger", icon: "!", title: `Produto sem estoque: ${nome}`, description: `SKU: ${p.sku || "não informado"}. Reponha o produto para evitar falta.`, date: p.updated_at || p.atualizado_em || p.criado_em || null }];
      if (minimo > 0 && estoque <= minimo) return [{ id: `estoque-baixo-${p.sku || p.id}`, type: "warning", icon: "↓", title: `Estoque baixo: ${nome}`, description: `Restam ${estoque} unidade(s); o mínimo configurado é ${minimo}.`, date: p.updated_at || p.atualizado_em || p.criado_em || null }];
      return [];
    });

    const recentes = moves.slice(0, 10).map((m, index) => {
      const tipo = m.type || m.tipo;
      const entrada = tipo === "in" || tipo === "entrada";
      const nome = m.product_name || m.nome_produto || m.sku || "Produto";
      return {
        id: `mov-${m.id ?? `${m.sku || "item"}-${m.criado_em || m.data || index}`}`,
        type: entrada ? "success" : "info",
        icon: entrada ? "+" : "−",
        title: `${entrada ? "Entrada" : "Saída"} de estoque: ${nome}`,
        description: `${Math.abs(Number(m.qty ?? m.quantidade ?? 0))} unidade(s) · ${m.reason || m.motivo || "Motivo não informado"}`,
        date: m.criado_em || m.data || m.created_at || null,
      };
    });

    return [...alertasEstoque, ...recentes].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
  }, [products, moves]);

  const naoLidas = notifications.filter((n) => !lidas.includes(n.id)).length;

  function marcarTodasComoLidas() {
    setLidas(notifications.map((n) => n.id));
  }

  function alternarLeitura(id) {
    setLidas((atual) => atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]);
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0 }}>Central de notificações</h3>
            <p style={{ margin: "6px 0 0", color: "var(--ink-soft)", fontSize: 13 }}>
              Alertas calculados a partir dos seus produtos e das movimentações registradas.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn" type="button" onClick={carregar} disabled={loading}>{loading ? "Atualizando…" : "Atualizar"}</button>
            <button className="btn btn-primary" type="button" onClick={marcarTodasComoLidas} disabled={loading || naoLidas === 0}>Marcar todas como lidas</button>
          </div>
        </div>
        {!loading && !error && (
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <span className="tag neutral">{notifications.length} notificações</span>
            <span className={naoLidas ? "tag low" : "tag ok"}>{naoLidas} não lidas</span>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 8 }}>
        {loading && <p style={{ padding: 16 }}>Carregando notificações do banco de dados…</p>}
        {error && <div style={{ padding: 16, color: "var(--danger, red)" }}><p>Não foi possível carregar: {error}</p><button className="btn" type="button" onClick={carregar}>Tentar novamente</button></div>}
        {!loading && !error && notifications.length === 0 && (
          <div style={{ padding: "36px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
            <strong>Tudo em dia!</strong>
            <p style={{ color: "var(--ink-soft)", fontSize: 13 }}>Ainda não há alertas de estoque ou movimentações registradas.</p>
          </div>
        )}
        {!loading && !error && notifications.map((n) => {
          const lida = lidas.includes(n.id);
          const bg = n.type === "danger" ? "var(--danger-bg, #fdecec)" : n.type === "warning" ? "var(--warning-bg, #fff3d9)" : n.type === "success" ? "var(--success-bg, #e7f5eb)" : "#e9efff";
          return (
            <div className={`notif-row${lida ? "" : " unread"}`} key={n.id} style={{ opacity: lida ? 0.72 : 1, alignItems: "center" }}>
              <div className="notif-ic" style={{ background: bg, display: "grid", placeItems: "center", fontWeight: 700 }}>{n.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{n.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 3 }}>{n.description}</div>
                <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 5 }}>{formatDate(n.date)}</div>
              </div>
              <button className="btn" type="button" onClick={() => alternarLeitura(n.id)} style={{ whiteSpace: "nowrap" }}>{lida ? "Marcar não lida" : "Marcar como lida"}</button>
            </div>
          );
        })}
      </div>
      <p style={{ color: "var(--ink-faint)", fontSize: 11, margin: "0 4px" }}>O estado de leitura fica salvo neste navegador e separado por usuário. Os alertas são atualizados a partir dos dados atuais da API.</p>
    </div>
  );
}
