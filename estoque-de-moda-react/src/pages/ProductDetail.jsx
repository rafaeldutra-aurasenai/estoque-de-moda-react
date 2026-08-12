import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { buscarProduto } from "../api.js";
import Tag from "../components/Tag.jsx";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

export default function ProductDetail() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [activeSize, setActiveSize] = useState(0);

  useEffect(() => {
    buscarProduto(sku).then((p) => { setProduct(p); setCarregando(false); });
  }, [sku]);

  usePageHeader("catálogo / produtos / detalhe", product ? product.name : "Produto não encontrado");

  if (carregando) return <p>Carregando...</p>;

  if (!product) {
    return (
      <div>
        <p>Produto não encontrado.</p>
        <Link to="/app/produtos" style={{ color: "var(--accent)", fontWeight: 600 }}>← Voltar para produtos</Link>
      </div>
    );
  }

  return (
    <div>
      <a
        className="link"
        href="#"
        onClick={(e) => { e.preventDefault(); navigate("/app/produtos"); }}
        style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}
      >
        ← Voltar para produtos
      </a>

      <div className="detail-grid" style={{ marginTop: 16 }}>
        <div>
          <div className="gallery-main" style={{ background: product.color }}>{product.emoji}</div>
          <div className="gallery-thumbs">
            <div className="active" style={{ background: product.color }}>{product.emoji}</div>
            <div style={{ background: "#EFEAE2" }}>🧵</div>
            <div style={{ background: "#EFEAE2" }}>📐</div>
            <div style={{ background: "#EFEAE2" }}>🏷</div>
          </div>
        </div>
        <div>
          <span className="chip">{product.cat}</span>
          <h2 className="serif" style={{ fontSize: 26, margin: "10px 0 4px", fontWeight: 500 }}>{product.name}</h2>
          <div className="mono" style={{ color: "var(--ink-faint)", fontSize: 12.5 }}>SKU: {product.sku}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "16px 0" }}>
            <span className="serif" style={{ fontSize: 28, fontWeight: 600 }}>{product.price}</span>
            <Tag status={product.status} />
          </div>
          <div style={{ color: "var(--ink-soft)", fontSize: 13.5, marginBottom: 18, lineHeight: 1.5 }}>{product.desc}</div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>Cor</div>
            <div className="variant-swatches">
              {product.colors.map((c, i) => (
                <div className="swatch" key={i} style={{ background: c }}></div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>Tamanho</div>
            <div style={{ display: "flex", gap: 8 }}>
              {product.sizes.map((s, idx) => (
                <div
                  key={s}
                  className={"size-pill" + (idx === activeSize ? " active" : "")}
                  onClick={() => setActiveSize(idx)}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: "16px 20px" }}>
            <div className="kv-row"><span>Fornecedor</span><span>{product.supplier}</span></div>
            <div className="kv-row"><span>Estoque total</span><span>{product.stock} peças</span></div>
            <div className="kv-row"><span>Estoque mínimo</span><span>{product.min} peças</span></div>
            <div className="kv-row"><span>Localização</span><span>{product.location}</span></div>
            <div className="kv-row"><span>Última entrada</span><span>{product.entry}</span></div>
          </div>

          <div className="form-actions" style={{ justifyContent: "flex-start", marginTop: 18 }}>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/app/produtos/novo")}>Editar produto</button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/app/movimentacoes")}>Registrar movimentação</button>
          </div>
        </div>
      </div>
    </div>
  );
}
