import { products } from "../data.js";
import Tag from "../components/Tag.jsx";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const categorySales = [
  { name: "Vestidos", pct: 38 },
  { name: "Blusas", pct: 26 },
  { name: "Calças", pct: 18 },
  { name: "Acessórios", pct: 18 },
];

export default function Reports() {
  usePageHeader("análise / relatórios", "Relatórios");
  const lowStock = products.filter((p) => p.status !== "ok");

  return (
    <div>
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="card stat-card">
          <div className="stat-value">R$ 82,3k</div>
          <div className="stat-label">Faturamento do mês</div>
          <span className="stat-delta up">↑ 9,1%</span>
        </div>
        <div className="card stat-card">
          <div className="stat-value">3,4×</div>
          <div className="stat-label">Giro de estoque</div>
          <span className="stat-delta up">↑ 0,3</span>
        </div>
        <div className="card stat-card">
          <div className="stat-value">R$ 187</div>
          <div className="stat-label">Ticket médio</div>
          <span className="stat-delta down">↓ 2,0%</span>
        </div>
        <div className="card stat-card">
          <div className="stat-value">6,2%</div>
          <div className="stat-label">Taxa de devolução</div>
          <span className="stat-delta down">↓ 0,8%</span>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="section-head"><h3>Vendas por categoria</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {categorySales.map((c) => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span>{c.name}</span><span>{c.pct}%</span>
                </div>
                <div className="progress"><div style={{ width: `${c.pct}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="section-head"><h3>Estoque crítico</h3></div>
          <div>
            {lowStock.map((p) => (
              <div className="move-row" key={p.sku}>
                <div className="prod-thumb" style={{ background: p.color }}>{p.emoji}</div>
                <div className="move-body">
                  <div className="move-title">{p.name}</div>
                  <div className="move-sub">{p.sku}</div>
                </div>
                <Tag status={p.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
