import { useState, useEffect } from "react";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const API_URL = "http://localhost:3001/api/categorias";

const ICONS = {
  Vestidos: { ic: "👗", bg: "var(--accent-soft)" },
  Blusas: { ic: "👚", bg: "#F5E9D3" },
  Calças: { ic: "👖", bg: "#EFEAE2" },
  Saias: { ic: "🩱", bg: "#E4EDE3" },
  Acessórios: { ic: "👜", bg: "#F5E9D3" },
  Casacos: { ic: "🧥", bg: "#EFEAE2" },
  Calçados: { ic: "👠", bg: "var(--accent-soft)" },
  Malharia: { ic: "🧶", bg: "#E4EDE3" },
};
const DEFAULT_ICON = { ic: "🏷", bg: "#EFEAE2" };

export default function Categories() {
  usePageHeader("catálogo / categorias", "Categorias");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
        setCategories(await res.json());
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Erro ao carregar categorias");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
    return () => controller.abort();
  }, []);

  return (
    <div>
      <div className="toolbar">
        <div></div>
        <button
          className="btn btn-primary btn-sm"
          disabled
          title="Categorias são geradas a partir dos produtos cadastrados"
        >
          + Nova categoria
        </button>
      </div>

      {loading && <p style={{ padding: 16 }}>Carregando categorias…</p>}
      {error && <p style={{ padding: 16, color: "var(--danger, red)" }}>Erro: {error}</p>}

      {!loading && !error && (
        <div className="cat-grid">
          {categories.length === 0 ? (
            <p style={{ padding: 16 }}>Nenhuma categoria encontrada. Cadastre produtos para elas aparecerem aqui.</p>
          ) : (
            categories.map((c) => {
              const icon = ICONS[c.name] || DEFAULT_ICON;
              return (
                <div className="cat-tile" key={c.name}>
                  <div className="ic" style={{ background: icon.bg }}>{icon.ic}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{c.name}</div>
                    <div className="count">{c.totalStock} peças · {c.skuCount} produtos</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}