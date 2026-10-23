import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { criarProduto, atualizarProduto, buscarProduto } from "../api.js";
import { usePageHeader } from "../components/PageHeaderContext.jsx";
import { emojiDaCategoria } from "../utils/categoryEmoji.js";

const CATEGORIAS = [
  "Vestidos", "Blusas", "Camisetas", "Regatas", "Croppeds", "Camisas",
  "Calças", "Calças jeans", "Calças de alfaiataria", "Shorts", "Bermudas",
  "Saias", "Macacões", "Conjuntos", "Blazers", "Casacos", "Jaquetas",
  "Cardigãs", "Tricôs e malhas", "Moletom", "Moda social", "Moda esportiva",
  "Moda praia", "Moda íntima", "Pijamas", "Roupas infantis", "Roupas masculinas",
  "Roupas femininas", "Calçados", "Bolsas", "Cintos", "Bijuterias", "Acessórios", "Outros"
];

const TAMANHOS_OPCOES = ["PP", "P", "M", "G", "GG", "XGG", "36", "38", "40", "42", "44", "46", "Único"];
const CORES_SUGERIDAS = ["Preto", "Branco", "Vermelho", "Azul", "Rosa", "Verde", "Bege", "Cinza", "Nude"];

function getPrefixoCategoria(categoria) {
  return (categoria || "PROD")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();
}

function criarSkuAutomatico(categoria) {
  const pref = getPrefixoCategoria(categoria);
  const tempoDiferencial = (Date.now() % 1000).toString().padStart(3, "0");
  const numeroAleatorio = Math.floor(100 + Math.random() * 900);
  return `${pref}-${tempoDiferencial}${numeroAleatorio}`;
}

// Utilitário para extrair metadados guardados na descrição
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
    // É uma descrição antiga em texto simples
  }
  return { desc: descricaoBruta, imageUrl: "", costPrice: "" };
}

const vazio = {
  sku: "",
  name: "",
  cat: "Vestidos",
  desc: "",
  price: "",
  costPrice: "",
  stock: "",
  min: "",
  imageUrl: "",
  colors: [],
  sizes: [],
};

export default function ProductForm() {
  const { sku: skuParam } = useParams();
  const isEditing = Boolean(skuParam);

  usePageHeader(
    isEditing ? "catálogo / produtos / editar" : "catálogo / produtos / novo",
    isEditing ? `Editar produto (${skuParam})` : "Novo produto"
  );

  const navigate = useNavigate();
  const [form, setForm] = useState(vazio);
  const [corInput, setCorInput] = useState("");
  const [carregandoDados, setCarregandoDados] = useState(isEditing);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [erroImagem, setErroImagem] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setCarregandoDados(true);
      buscarProduto(skuParam)
        .then((p) => {
          if (p) {
            const extra = extrairDescricaoEExtra(p.desc);
            setForm({
              sku: p.sku || "",
              name: p.name || "",
              cat: p.cat || "Vestidos",
              desc: extra.desc,
              price: p.priceValue !== undefined ? p.priceValue : "",
              costPrice: extra.costPrice,
              stock: p.stock !== undefined ? p.stock : "",
              min: p.min !== undefined ? p.min : "",
              imageUrl: extra.imageUrl,
              colors: Array.isArray(p.colors) ? p.colors : [],
              sizes: Array.isArray(p.sizes) ? p.sizes : [],
            });
          } else {
            setErro("Produto não encontrado.");
          }
        })
        .catch(() => setErro("Erro ao carregar dados do produto."))
        .finally(() => setCarregandoDados(false));
    } else {
      setForm((f) => ({
        ...f,
        sku: criarSkuAutomatico(f.cat),
      }));
    }
  }, [skuParam, isEditing]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "imageUrl") {
      setErroImagem(false);
    }

    setForm((f) => {
      const novoForm = { ...f, [name]: value };

      if (name === "cat" && !isEditing) {
        novoForm.sku = criarSkuAutomatico(value);
      }

      return novoForm;
    });
  }

  function toggleTamanho(tamanho) {
    setForm((f) => {
      const selecionado = f.sizes.includes(tamanho);
      return {
        ...f,
        sizes: selecionado
          ? f.sizes.filter((s) => s !== tamanho)
          : [...f.sizes, tamanho],
      };
    });
  }

  function handleAdicionarCor(nomeCor) {
    const cor = (nomeCor || corInput).trim();
    if (!cor) return;
    if (!form.colors.includes(cor)) {
      setForm((f) => ({ ...f, colors: [...f.colors, cor] }));
    }
    setCorInput("");
  }

  function handleRemoverCor(corParaRemover) {
    setForm((f) => ({
      ...f,
      colors: f.colors.filter((c) => c !== corParaRemover),
    }));
  }

  // Cálculos de Margem de Lucro em Tempo Real
  const precoVenda = Number(form.price) || 0;
  const precoCusto = Number(form.costPrice) || 0;
  const lucroBruto = precoVenda - precoCusto;
  const margemLucro = precoVenda > 0 ? ((lucroBruto / precoVenda) * 100).toFixed(1) : 0;

  async function handleSave(e) {
    e.preventDefault();
    setErro("");

    if (!form.sku.trim() || !form.name.trim()) {
      setErro("Preencha pelo menos o SKU e o nome do produto.");
      return;
    }

    if (!form.cat.trim()) {
      setErro("Selecione uma categoria para o produto.");
      return;
    }

    const preco = Number(form.price);
    const estoque = Number(form.stock);
    const minimo = Number(form.min);

    if (form.price !== "" && (!Number.isFinite(preco) || preco < 0)) {
      setErro("Informe um preço válido e não negativo.");
      return;
    }

    setSalvando(true);

    try {
      // Empacota a descrição, URL da imagem e preço de custo juntos
      const descEmpacotada = JSON.stringify({
        __meta: true,
        desc: form.desc.trim(),
        imageUrl: form.imageUrl.trim(),
        costPrice: form.costPrice !== "" ? Number(form.costPrice) : "",
      });

      const payload = {
        sku: form.sku.trim(),
        name: form.name.trim(),
        cat: form.cat,
        desc: descEmpacotada,
        price: preco || 0,
        stock: estoque || 0,
        min: minimo || 0,
        colors: form.colors,
        sizes: form.sizes,
      };

      if (isEditing) {
        await atualizarProduto(skuParam, payload);
      } else {
        await criarProduto(payload);
      }

      navigate(`/app/produtos/${encodeURIComponent(form.sku.trim())}`);
    } catch (e) {
      setErro(e.message || "Erro ao salvar produto.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoDados) {
    return <p style={{ padding: 20 }}>A carregar dados do produto...</p>;
  }

  return (
    <form className="form-shell" onSubmit={handleSave}>
      {erro && (
        <div
          role="alert"
          style={{
            background: "#fbe4e4",
            color: "#8a2c2c",
            padding: "12px 16px",
            borderRadius: 8,
          }}
        >
          {erro}
        </div>
      )}

      {/* INFORMAÇÕES DO PRODUTO */}
      <div className="form-card">
        <h4>Informações do produto</h4>

        <div className="field">
          <label htmlFor="product-name">Nome do produto</label>
          <input
            id="product-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex.: Camisa Polo Azul"
            required
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="product-category">Categoria</label>
            <select
              id="product-category"
              name="cat"
              value={form.cat}
              onChange={handleChange}
              required
            >
              {CATEGORIAS.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {emojiDaCategoria(categoria)} {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="product-sku">SKU</label>
            <input
              id="product-sku"
              className="mono"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              disabled={isEditing}
              required
            />
          </div>
        </div>

        {/* CAMPO DE URL DA FOTO COM PRÉ-VISUALIZAÇÃO */}
        <div className="field-row" style={{ alignItems: "flex-start", marginTop: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="product-image">URL da foto do produto</label>
            <input
              id="product-image"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Ex.: https://images.unsplash.com/photo-1521572267360-ee0c2909d518"
            />
            <span style={{ fontSize: 11, color: "#666", marginTop: 4, display: "block" }}>
              Cole o link direto da imagem (http:// ou https://).
            </span>
          </div>

          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              border: "1px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fafafa",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {form.imageUrl && !erroImagem ? (
              <img
                src={form.imageUrl}
                alt="Pré-visualização"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={() => setErroImagem(true)}
              />
            ) : (
              <span style={{ fontSize: 36 }}>{emojiDaCategoria(form.cat)}</span>
            )}
          </div>
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <label htmlFor="product-description">Descrição</label>
          <textarea
            id="product-description"
            rows={3}
            name="desc"
            value={form.desc}
            onChange={handleChange}
            placeholder="Descreva o produto..."
          />
        </div>
      </div>

      {/* PREÇO, CUSTO E MARGEM DE LUCRO */}
      <div className="form-card">
        <h4>Preço, Custo e Estoque</h4>

        <div className="field-row">
          <div className="field">
            <label htmlFor="product-cost">Preço de Custo (R$)</label>
            <input
              id="product-cost"
              type="number"
              min="0"
              step="0.01"
              name="costPrice"
              value={form.costPrice}
              onChange={handleChange}
              placeholder="50.00"
            />
          </div>

          <div className="field">
            <label htmlFor="product-price">Preço de Venda (R$)</label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="120.00"
            />
          </div>
        </div>

        {/* CARD INDICADOR DE MARGEM DE LUCRO EM TEMPO REAL */}
        {(precoVenda > 0 || precoCusto > 0) && (
          <div
            style={{
              background: margemLucro < 0 ? "#fde8e8" : "#f0fdf4",
              border: `1px solid ${margemLucro < 0 ? "#f8b4b4" : "#bbf7d0"}`,
              borderRadius: 8,
              padding: "12px 16px",
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Lucro Bruto por Peça</div>
              <strong style={{ fontSize: 16 }}>
                R$ {lucroBruto.toFixed(2)}
              </strong>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Margem de Lucro</div>
              <strong
                style={{
                  fontSize: 16,
                  color: margemLucro < 0 ? "#c81e1e" : "#15803d",
                }}
              >
                {margemLucro}%
              </strong>
            </div>
          </div>
        )}

        <div className="field-row" style={{ marginTop: 14 }}>
          <div className="field">
            <label htmlFor="product-stock">Quantidade em estoque</label>
            <input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="42"
            />
          </div>

          <div className="field">
            <label htmlFor="product-min">Estoque mínimo</label>
            <input
              id="product-min"
              type="number"
              min="0"
              step="1"
              name="min"
              value={form.min}
              onChange={handleChange}
              placeholder="10"
            />
          </div>
        </div>
      </div>

      {/* VARIAÇÕES (CHIPS PARA TAMANHOS E TAGS PARA CORES) */}
      <div className="form-card">
        <h4>Variações de Grade</h4>

        <div className="field" style={{ marginBottom: 20 }}>
          <label>Tamanhos disponíveis</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
            {TAMANHOS_OPCOES.map((tamanho) => {
              const selecionado = form.sizes.includes(tamanho);
              return (
                <button
                  type="button"
                  key={tamanho}
                  onClick={() => toggleTamanho(tamanho)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1.5px solid ${selecionado ? "var(--accent, #333)" : "#ddd"}`,
                    background: selecionado ? "var(--accent, #333)" : "#fff",
                    color: selecionado ? "#fff" : "#333",
                    fontWeight: selecionado ? 600 : 400,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  {tamanho}
                </button>
              );
            })}
          </div>
        </div>

        <div className="field">
          <label htmlFor="color-input">Cores da peça</label>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <input
              id="color-input"
              value={corInput}
              onChange={(e) => setCorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdicionarCor();
                }
              }}
              placeholder="Digite o nome da cor e pressione Enter..."
            />
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => handleAdicionarCor()}
            >
              + Adicionar
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            <span style={{ fontSize: 12, opacity: 0.7 }}>Sugestões:</span>
            {CORES_SUGERIDAS.map((cor) => (
              <span
                key={cor}
                onClick={() => handleAdicionarCor(cor)}
                style={{
                  fontSize: 12,
                  cursor: "pointer",
                  color: "var(--accent, #0066cc)",
                  textDecoration: "underline",
                }}
              >
                {cor}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {form.colors.map((cor) => (
              <span
                key={cor}
                style={{
                  background: "#f0f0f0",
                  padding: "4px 10px",
                  borderRadius: 16,
                  fontSize: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {cor}
                <button
                  type="button"
                  onClick={() => handleRemoverCor(cor)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#888",
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate("/app/produtos")}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={salvando}
        >
          {salvando ? "A guardar..." : isEditing ? "Salvar alterações" : "Salvar produto"}
        </button>
      </div>
    </form>
  );
}