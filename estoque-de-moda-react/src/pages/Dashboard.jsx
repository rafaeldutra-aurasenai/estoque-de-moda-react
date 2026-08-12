import { useNavigate } from "react-router-dom";
import { products, moves } from "../data.js";
import Tag from "../components/Tag.jsx";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

export default function Dashboard() {
  usePageHeader("painel / visão geral", "Dashboard");
  const navigate = useNavigate();

  return (
    <div>
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="card stat-card">
          <div className="stat-top"><div className="stat-ic">▤</div></div>
          <div className="stat-value">2.480</div>
          <div className="stat-label">Peças em estoque</div>
          <span className="stat-delta up">↑ 4,2% esta semana</span>
        </div>
        <div className="card stat-card">
          <div className="stat-top"><div className="stat-ic">▧</div></div>
          <div className="stat-value">184</div>
          <div className="stat-label">Pedidos no mês</div>
          <span className="stat-delta up">↑ 12% vs. mês anterior</span>
        </div>
        <div className="card stat-card">
          <div className="stat-top"><div className="stat-ic">◫</div></div>
          <div className="stat-value">R$ 96.4k</div>
          <div className="stat-label">Valor em estoque</div>
          <span className="stat-delta down">↓ 1,8% esta semana</span>
        </div>
        <div className="card stat-card">
          <div className="stat-top"><div className="stat-ic">⚠</div></div>
          <div className="stat-value">17</div>
          <div className="stat-label">Itens com estoque baixo</div>
          <span className="stat-delta down">3 novos hoje</span>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="section-head">
            <h3>Produtos mais vendidos</h3>
            <a className="link" href="#" onClick={(e) => { e.preventDefault(); navigate("/app/produtos"); }}>Ver produtos</a>
          </div>
          <table>
            <thead>
              <tr><th>Produto</th><th>Categoria</th><th>Vendidos</th><th>Estoque</th><th>Status</th></tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((p) => (
                <tr key={p.sku} style={{ cursor: "pointer" }} onClick={() => navigate(`/app/produtos/${p.sku}`)}>
                  <td className="prod-cell">
                    <div className="prod-thumb" style={{ background: p.color }}>{p.emoji}</div>
                    <div><div className="pname">{p.name}</div><div className="psku">{p.sku}</div></div>
                  </td>
                  <td>{p.cat}</td>
                  <td>{Math.floor(Math.random() * 40 + 10)}</td>
                  <td>{p.stock}</td>
                  <td><Tag status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="section-head">
            <h3>Movimentações recentes</h3>
            <a className="link" href="#" onClick={(e) => { e.preventDefault(); navigate("/app/movimentacoes"); }}>Ver tudo</a>
          </div>
          <div>
            {moves.map((m, i) => (
              <div className="move-row" key={i}>
                <div className={`move-ic ${m.type}`}>{m.type === "in" ? "↓" : "↑"}</div>
                <div className="move-body">
                  <div className="move-title">{m.title}</div>
                  <div className="move-sub">{m.sub}</div>
                </div>
                <div className="move-qty" style={{ color: m.type === "in" ? "var(--success)" : "var(--danger)" }}>{m.qty}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
