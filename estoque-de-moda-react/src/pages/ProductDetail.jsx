import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { buscarProduto, excluirProduto } from "../api.js";
import Tag from "../components/Tag.jsx";
import { usePageHeader } from "../components/PageHeaderContext.jsx";
import { emojiDaCategoria } from "../utils/categoryEmoji.js";

export default function ProductDetail() {
  const { sku } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const [activeSize, setActiveSize] = useState(0);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);

    buscarProduto(sku)
      .then((p) => {
        if (ativo) setProduct(p);
      })
      .catch(() => {
        if (ativo) setProduct(null);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [sku]);

  usePageHeader(
    "catálogo / produtos / detalhe",
    product ? product.name : "Produto não encontrado"
  );

  // Função para confirmar e excluir o produto
  async function handleExcluir() {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o produto "${product.name}" (SKU: ${product.sku})?\n\nEsta ação não poderá ser desfeita.`
    );

    if (!confirmou) return;

    setExcluindo(true);

    try {
      await excluirProduto(product.sku);
      navigate("/app/produtos");
    } catch (e) {
      alert(e.message || "Erro ao excluir o produto.");
      setExcluindo(false);
    }
  }

  if (carregando) return <p style={{ padding: 20 }}>Carregando produto...</p>;

  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <p>Produto não encontrado.</p>
        <Link
          to="/app/produtos"
          style={{ color: "var(--accent)", fontWeight: 600 }}
        >
          ← Voltar para produtos
        </Link>
      </div>
    );
  }

  const emoji = emojiDaCategoria(product.cat);

  return (
    <div>
      <a
        className="link"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate("/app/produtos");
        }}
        style={{
          fontSize: 13,
          color: "var(--accent)",
          fontWeight: 600,
        }}
      >
        ← Voltar para produtos
      </a>

      <div className="detail-grid" style={{ marginTop: 16 }}>
        <div>
          <div
            className="gallery-main"
            style={{ background: product.color || "#EFEAE2" }}
          >
            <span style={{ fontSize: 80 }}>{emoji}</span>
          </div>
        </div>

        <div>
          <span className="chip">{product.cat}</span>

          <h2
            className="serif"
            style={{
              fontSize: 26,
              margin: "10px 0 4px",
              fontWeight: 500,
            }}
          >
            {product.name}
          </h2>

          <div
            className="mono"
            style={{
              color: "var(--ink-faint)",
              fontSize: 12.5,
            }}
          >
            SKU: {product.sku}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              margin: "16px 0",
            }}
          >
            <span
              className="serif"
              style={{ fontSize: 28, fontWeight: 600 }}
            >
              {product.price}
            </span>
            <Tag status={product.status} />
          </div>

          <div
            style={{
              color: "var(--ink-soft)",
              fontSize: 13.5,
              marginBottom: 18,
              lineHeight: 1.5,
            }}
          >
            {product.desc || "Sem descrição registrada."}
          </div>

          {/* CORES */}
          {product.colors?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>
                Cores disponíveis
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {product.colors.map((c, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "4px 10px",
                      background: "#eee",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAMANHOS */}
          {product.sizes?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>
                Tamanhos
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {product.sizes.map((s, idx) => (
                  <div
                    key={s}
                    className={
                      "size-pill" + (idx === activeSize ? " active" : "")
                    }
                    onClick={() => setActiveSize(idx)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INFORMAÇÕES DE ESTOQUE */}
          <div className="card" style={{ padding: "16px 20px" }}>
            <div className="kv-row">
              <span>Estoque total</span>
              <span>{product.stock} peças</span>
            </div>

            <div className="kv-row">
              <span>Estoque mínimo</span>
              <span>{product.min} peças</span>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div
            className="form-actions"
            style={{
              justifyContent: "flex-start",
              marginTop: 20,
              gap: 10,
            }}
          >
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleExcluir}
              disabled={excluindo}
              style={{
                color: "#c81e1e",
                borderColor: "#f8b4b4",
              }}
            >
              {excluindo ? "Excluindo..." : "🗑️ Excluir produto"}
            </button>

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/app/movimentacoes")}
            >
              Registrar movimentação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}