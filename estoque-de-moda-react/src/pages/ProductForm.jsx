import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { criarProduto } from "../api.js";
import { usePageHeader } from "../components/PageHeaderContext.jsx";
import { emojiDaCategoria } from "../utils/categoryEmoji.js";

const CATEGORIAS = [
  "Vestidos",
  "Blusas",
  "Camisetas",
  "Regatas",
  "Croppeds",
  "Camisas",
  "Calças",
  "Calças jeans",
  "Calças de alfaiataria",
  "Shorts",
  "Bermudas",
  "Saias",
  "Macacões",
  "Conjuntos",
  "Blazers",
  "Casacos",
  "Jaquetas",
  "Cardigãs",
  "Tricôs e malhas",
  "Moletom",
  "Moda social",
  "Moda esportiva",
  "Moda praia",
  "Moda íntima",
  "Pijamas",
  "Roupas infantis",
  "Roupas masculinas",
  "Roupas femininas",
  "Calçados",
  "Bolsas",
  "Cintos",
  "Bijuterias",
  "Acessórios",
  "Outros",
];

// Função utilitária para extrair o prefixo (ex: "Camisas" -> "CAM")
function getPrefixoCategoria(categoria) {
  return (categoria || "PROD")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();
}

// Gera um SKU automático único baseado na categoria
function criarSkuAutomatico(categoria) {
  const pref = getPrefixoCategoria(categoria);
  const tempoDiferencial = (Date.now() % 1000).toString().padStart(3, "0");
  const numeroAleatorio = Math.floor(100 + Math.random() * 900);
  return `${pref}-${tempoDiferencial}${numeroAleatorio}`;
}

const vazio = {
  sku: "",
  name: "",
  cat: "Vestidos",
  desc: "",
  price: "",
  stock: "",
  min: "",
  colorsText: "",
  sizesText: "",
};

export default function ProductForm() {
  usePageHeader("catálogo / produtos / novo", "Novo produto");

  const navigate = useNavigate();
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Gera o SKU automático inicial assim que o formulário abre
  useEffect(() => {
    setForm((f) => ({
      ...f,
      sku: criarSkuAutomatico(f.cat),
    }));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((f) => {
      const novoForm = { ...f, [name]: value };

      // Sempre que a pessoa mudar a Categoria, gera automaticamente o novo SKU
      if (name === "cat") {
        novoForm.sku = criarSkuAutomatico(value);
      }

      return novoForm;
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setErro("");

    if (!form.sku.trim() || !form.name.trim()) {
      setErro("Preencha ao menos o SKU e o nome do produto.");
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

    if (form.stock !== "" && (!Number.isInteger(estoque) || estoque < 0)) {
      setErro("O estoque deve ser um número inteiro não negativo.");
      return;
    }

    if (form.min !== "" && (!Number.isInteger(minimo) || minimo < 0)) {
      setErro("O estoque mínimo deve ser um número inteiro não negativo.");
      return;
    }

    setSalvando(true);

    try {
      await criarProduto({
        sku: form.sku.trim(),
        name: form.name.trim(),
        cat: form.cat,
        desc: form.desc.trim(),
        price: preco || 0,
        stock: estoque || 0,
        min: minimo || 0,
        colors: form.colorsText
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        sizes: form.sizesText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      navigate(`/app/produtos/${encodeURIComponent(form.sku.trim())}`);
    } catch (e) {
      setErro(
        e.message ||
          "Erro ao salvar. Confira se o backend está rodando e se o SKU já existe."
      );
    } finally {
      setSalvando(false);
    }
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 10,
                padding: 12,
                borderRadius: 8,
                background: "var(--accent-soft, #f4eee5)",
              }}
            >
              <span style={{ fontSize: 30 }}>
                {emojiDaCategoria(form.cat)}
              </span>
              <div>
                <strong>{form.cat}</strong>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  SKU gerado automaticamente
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="product-sku">SKU (Gerado Automaticamente)</label>
            <input
              id="product-sku"
              className="mono"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="Aguardando categoria..."
              required
            />
            <span style={{ fontSize: 11, color: "#666", marginTop: 4, display: "block" }}>
              ✨ Atualizado automaticamente ao selecionar a categoria. Você também pode alterar manualmente se desejar.
            </span>
          </div>
        </div>

        <div className="field">
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

      <div className="form-card">
        <h4>Preço e estoque</h4>

        <div className="field-row">
          <div className="field">
            <label htmlFor="product-price">Preço de venda (R$)</label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="349.90"
            />
          </div>

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
        </div>

        <div className="field-row">
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

      <div className="form-card">
        <h4>Variações</h4>

        <div className="field-row">
          <div className="field">
            <label htmlFor="product-colors">
              Cores disponíveis (separadas por vírgula)
            </label>
            <input
              id="product-colors"
              name="colorsText"
              value={form.colorsText}
              onChange={handleChange}
              placeholder="Preto, Branco, Vermelho"
            />
          </div>

          <div className="field">
            <label htmlFor="product-sizes">
              Tamanhos (separados por vírgula)
            </label>
            <input
              id="product-sizes"
              name="sizesText"
              value={form.sizesText}
              onChange={handleChange}
              placeholder="P, M, G, GG"
            />
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
          {salvando ? "Salvando..." : "Salvar produto"}
        </button>
      </div>
    </form>
  );
}