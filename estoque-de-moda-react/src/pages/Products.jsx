import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listarProdutos } from "../api.js";
import Tag from "../components/Tag.jsx";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const filters = ["Todos", "Vestidos", "Blusas", "Calças", "Saias", "Acessórios"];

export default function Products() {
  usePageHeader("catálogo / produtos", "Produtos");
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [view, setView] = useState("grid");
  const [products, setProducts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarProdutos()
      .then(setProducts)
      .catch(() => setErro("Não foi possível conectar à API. O backend está rodando (npm run dev na pasta server)?"))
      .finally(() => setCarregando(false));
  }, []);

  const filtered = activeFilter === "Todos" ? products : products.filter((p) => p.cat === activeFilter);

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
        <div style={{ display: "flex", gap: 10 }}>
          <div className="view-toggle">
            <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>▦ Grade</button>
            <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>☰ Lista</button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/app/produtos/novo")}>+ Novo produto</button>
        </div>
      </div>

      {erro && <div style={{ background: "#fbe4e4", color: "#8a2c2c", padding: "12px 16px", borderRadius: 8, marginBottom: 16 }}>{erro}</div>}
      {carregando && <p>Carregando produtos...</p>}

      <div className="product-grid">
        {filtered.map((p) => (
          <div className="pcard" key={p.sku} onClick={() => navigate(`/app/produtos/${p.sku}`)}>
            <div className="pimg" style={{ background: p.color }}>
              {p.emoji}
              <Tag status={p.status} />
            </div>
            <div className="pbody">
              <div className="pname">{p.name}</div>
              <div className="pcat">{p.cat} · <span className="mono">{p.sku}</span></div>
              <div className="pfoot">
                <span className="price">{p.price}</span>
                <span style={{ padding: "5px 10px", color: "var(--accent)", background: "var(--accent-soft)", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Ver →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <span>Mostrando 1–{filtered.length} de {products.length} produtos</span>
        <div className="pg-btns">
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>›</button>
        </div>
      </div>
    </div>
  );
}
