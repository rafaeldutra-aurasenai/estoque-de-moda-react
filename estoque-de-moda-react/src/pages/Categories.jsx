import { useEffect, useMemo, useState } from "react";
import { usePageHeader } from "../components/PageHeaderContext.jsx";
import { apiFetch } from "../auth.js";

const API_URL = "http://localhost:3001/api/categorias";

// Catálogo inicial focado exclusivamente em roupas.
// Os números de estoque/produtos são preenchidos quando a API retorna
// uma categoria com o mesmo nome. Categorias ainda sem produtos ficam em zero.
const CATEGORIAS_ROUPAS = [
  {
    name: "Partes de Cima",
    icon: "👚",
    description: "Roupas para o tronco e os ombros",
    items: ["Camisetas / T-Shirts", "Camisas e Blusas", "Polos", "Regatas e Tops", "Tricôs e Malhas"],
  },
  {
    name: "Partes de Baixo",
    icon: "👖",
    description: "Roupas para pernas e quadril",
    items: ["Calças", "Shorts e Bermudas", "Saias"],
  },
  {
    name: "Peças Únicas",
    icon: "👗",
    description: "Peças que vestem o corpo inteiro",
    items: ["Vestidos", "Macacões e Macaquinhos"],
  },
  {
    name: "Agasalhos e Terceira Peça",
    icon: "🧥",
    description: "Peças para sobreposição e dias frios",
    items: ["Jaquetas", "Blazers e Coletes", "Casacos e Sobretudos", "Moletons", "Cardigãs e Kimonos"],
  },
  {
    name: "Moda Praia e Banho",
    icon: "🌊",
    description: "Roupas para praia e piscina",
    items: ["Biquínis e Maiôs", "Sungas e Bermudas de Praia", "Saídas de Praia"],
  },
  {
    name: "Dormir e Ficar em Casa",
    icon: "🌙",
    description: "Peças confortáveis para descanso e casa",
    items: ["Pijamas", "Camisolas e Robes", "Roupas de Ficar em Casa"],
  },
  {
    name: "Roupas Esportivas",
    icon: "🏃",
    description: "Vestuário para treino e atividades físicas",
    items: ["Leggings e Bermudas de Treino", "Tops Esportivos e Camisetas Dry-Fit", "Conjuntos de Ginástica / Agasalhos Esportivos"],
  },
];

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

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
        const res = await apiFetch(API_URL, { signal: controller.signal });
        if (!res.ok) {
          let mensagem = `Erro ${res.status}: ${res.statusText}`;
          try {
            const body = await res.json();
            mensagem = body.erro || body.mensagem || mensagem;
          } catch {
            // Mantém a mensagem HTTP caso a resposta não seja JSON.
          }
          throw new Error(mensagem);
        }
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Erro ao carregar categorias");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchCategories();
    return () => controller.abort();
  }, []);

  const categoryCounts = useMemo(() => {
    const result = new Map();
    for (const category of categories) {
      const key = normalize(category.name || category.nome);
      if (key) {
        result.set(key, {
          totalStock: Number(category.totalStock ?? category.total_estoque ?? 0),
          skuCount: Number(category.skuCount ?? category.quantidadeProdutos ?? category.total_produtos ?? 0),
        });
      }
    }
    return result;
  }, [categories]);

  return (
    <div>
      <div className="toolbar">
        <div>
          <p style={{ margin: 0, color: "var(--muted, #777)", fontSize: 13 }}>
            Catálogo organizado por tipo de roupa. Acessórios, calçados e lingeries não estão incluídos.
          </p>
        </div>
        <span className="count">{CATEGORIAS_ROUPAS.length} grupos de roupas</span>
      </div>

      {loading && <p style={{ padding: 16 }}>Carregando dados do estoque…</p>}
      {error && (
        <p style={{ padding: 16, color: "var(--danger, #b42318)" }}>
          Não foi possível carregar as quantidades do estoque: {error}. A lista de categorias continua disponível abaixo.
        </p>
      )}

      <div className="cat-grid">
        {CATEGORIAS_ROUPAS.map((category) => {
          const matchingCounts = category.items.reduce(
            (totals, item) => {
              const count = categoryCounts.get(normalize(item));
              if (count) {
                totals.totalStock += count.totalStock;
                totals.skuCount += count.skuCount;
              }
              return totals;
            },
            { totalStock: 0, skuCount: 0 }
          );

          return (
            <section
              className="cat-tile"
              key={category.name}
              style={{ alignItems: "flex-start", gap: 12, minWidth: 0 }}
            >
              <div
                className="ic"
                style={{
                  background: "var(--accent-soft, #f3eee7)",
                  flexShrink: 0,
                  fontSize: 24,
                }}
                aria-hidden="true"
              >
                {category.icon}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{category.name}</div>
                <div className="count" style={{ marginTop: 4 }}>
                  {category.description}
                </div>
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {category.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        display: "inline-block",
                        padding: "5px 8px",
                        borderRadius: 6,
                        background: "var(--surface-muted, #f5f5f4)",
                        fontSize: 12,
                        lineHeight: 1.35,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="count" style={{ marginTop: 10 }}>
                  {matchingCounts.totalStock} peças · {matchingCounts.skuCount} produtos nas subcategorias correspondentes
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
