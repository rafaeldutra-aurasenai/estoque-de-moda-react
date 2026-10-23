import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { buscarProduto, excluirProduto } from "../api.js";
import Tag from "../components/Tag.jsx";
import { usePageHeader } from "../components/PageHeaderContext.jsx";
import { emojiDaCategoria } from "../utils/categoryEmoji.js";

function extrairDescricaoEExtra(descricaoBruta) {
  if (!descricaoBruta) return { desc: "", imageUrl: "", costPrice: "" };
  try {
    const parsed = JSON.parse(descricaoBruta);
    if (parsed && typeof parsed === "object" && parsed.__meta) {
      return {
        desc: parsed.desc || "",
        imageUrl: parsed.imageUrl || "",
        costPrice: parsed.costPrice !== undefined ? parsed.costPrice : "",
      };
    }
  } catch {
    // É uma descrição antiga
  }
  return { desc: descricaoBruta, imageUrl: "", costPrice: "" };
}

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

  async function handleExcluir() {
    const confirmou = window.confirm(
      `Tem a certeza de que deseja eliminar o produto "${product.name}" (SKU: ${product.sku})?\n\nEsta ação não poderá ser desfeita.`
    );

    if (!confirmou) return;

    setExcluindo(true);

    try {
      await excluirProduto(product.sku);
      navigate("/app/produtos");
    } catch (e) {
      alert(e.message || "Erro ao eliminar o produto.");
      setExcluindo(false);
    }
  }

  if (carregando) return <p style={{ padding: 20 }}>A carregar produto...</p>;

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

  const extra = extrairDescricaoEExtra(product.desc);
  const emoji = emojiDaCategoria(product.cat);

  const precoVenda = product.priceValue || 0;
  const precoCusto = Number(extra.costPrice) || 0;
  const lucroBruto = precoVenda - precoCusto;
  const margemLucro = precoVenda > 0 ? ((lucroBruto / precoVenda) * 100).toFixed(1) : 0;

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
            style={{
              background: product.color || "#EFEAE2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {extra.imageUrl ? (
              <img
                src={extra.imageUrl}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: 80 }}>{emoji}</span>
            )}
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
            {extra.desc || "Sem descrição registada."}
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

          {/* INFORMAÇÕES DE ESTOQUE E MARGEM */}
          <div className="card" style={{ padding: "16px 20px" }}>
            <div className="kv-row">
              <span>Stock total</span>
              <span>{product.stock} peças</span>
            </div>

            <div className="kv-row">
              <span>Stock mínimo</span>
              <span>{product.min} peças</span>
            </div>

            {extra.costPrice !== "" && (
              <>
                <div className="kv-row">
                  <span>Preço de Custo</span>
                  <span>R$ {precoCusto.toFixed(2)}</span>
                </div>
                <div className="kv-row">
                  <span>Margem de Lucro</span>
                  <span style={{ color: margemLucro < 0 ? "#c81e1e" : "#15803d", fontWeight: 600 }}>
                    {margemLucro}% (R$ {lucroBruto.toFixed(2)})
                  </span>
                </div>
              </>
            )}
          </div>

          {/* AÇÕES DE NAVEGAÇÃO E MANIPULAÇÃO */}
          <div
            className="form-actions"
            style={{
              justifyContent: "flex-start",
              marginTop: 20,
              gap: 10,
            }}
          >
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                navigate(
                  `/app/produtos/${encodeURIComponent(product.sku)}/editar`
                )
              }
            >
              ✏️ Editar produto
            </button>

            <button
              className="btn btn-ghost btn-sm"
              onClick={handleExcluir}
              disabled={excluindo}
              style={{
                color: "#c81e1e",
                borderColor: "#f8b4b4",
              }}
            >
              {excluindo ? "A eliminar..." : "🗑️ Eliminar produto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}