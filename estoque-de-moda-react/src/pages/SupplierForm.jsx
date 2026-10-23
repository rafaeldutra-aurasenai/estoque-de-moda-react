
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageHeader } from "../components/PageHeaderContext.jsx";
import { apiFetch } from "../auth.js";
import { listarCategorias } from "../api.js";

const API_URL = "http://localhost:3001/api/fornecedores";

const CATEGORIAS_PADRAO = [
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
  "Moletons",
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

export default function SupplierForm() {
  usePageHeader("operação / fornecedores / novo", "Novo fornecedor");

  const navigate = useNavigate();

  const [categorias, setCategorias] = useState(CATEGORIAS_PADRAO);

  const [form, setForm] = useState({
    name: "",
    cnpj: "",
    cat: "Vestidos",
    phone: "",
    email: "",
    products: "",
    status: "Ativo",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarCategorias() {
      try {
        const resposta = await listarCategorias();

        const nomes = (Array.isArray(resposta) ? resposta : [])
          .map((item) =>
            typeof item === "string"
              ? item
              : item.name ?? item.cat ?? item.categoria
          )
          .filter(Boolean);

        if (ativo) {
          setCategorias((atuais) =>
            [...new Set([...atuais, ...nomes])].sort((a, b) =>
              a.localeCompare(b, "pt-BR")
            )
          );
        }
      } catch {
        // A lista padrão continua disponível se a API falhar.
      }
    }

    carregarCategorias();

    return () => {
      ativo = false;
    };
  }, []);

  function handleChange(field, value) {
    setForm((atual) => ({
      ...atual,
      [field]: value,
    }));
    setError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Informe a razão social do fornecedor.");
      return;
    }

    if (!form.cat) {
      setError("Selecione a categoria fornecida.");
      return;
    }

    setSaving(true);

    try {
      const resposta = await apiFetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          cnpj: form.cnpj.trim(),
          cat: form.cat,
          phone: form.phone.trim(),
          email: form.email.trim(),
          products: form.products.trim(),
          status: form.status,
        }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.erro ||
          dados.error ||
          dados.mensagem ||
          `Erro ${resposta.status}: ${resposta.statusText}`
        );
      }

      navigate("/app/fornecedores");
    } catch (err) {
      setError(
        err.message || "Não foi possível salvar o fornecedor."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-shell" onSubmit={handleSave}>
      <div className="form-card">
        <h4>Dados do fornecedor</h4>

        <div className="field">
          <label htmlFor="supplier-name">Razão social</label>
          <input
            id="supplier-name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ex.: Textura Confecções Ltda."
            required
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="supplier-cnpj">CNPJ</label>
            <input
              id="supplier-cnpj"
              value={form.cnpj}
              onChange={(e) => handleChange("cnpj", e.target.value)}
              placeholder="00.000.000/0001-00"
            />
          </div>

          <div className="field">
            <label htmlFor="supplier-category">
              Categoria fornecida
            </label>

            <select
              id="supplier-category"
              value={form.cat}
              onChange={(e) => handleChange("cat", e.target.value)}
              required
            >
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-card">
        <h4>Contato</h4>

        <div className="field-row">
          <div className="field">
            <label htmlFor="supplier-phone">Telefone</label>
            <input
              id="supplier-phone"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(11) 90000-0000"
            />
          </div>

          <div className="field">
            <label htmlFor="supplier-email">E-mail</label>
            <input
              id="supplier-email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="contato@fornecedor.com.br"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="supplier-products">Produtos fornecidos</label>
          <input
            id="supplier-products"
            value={form.products}
            onChange={(e) => handleChange("products", e.target.value)}
            placeholder="Vestidos, saias, blusas"
          />
        </div>

        <div className="field">
          <label htmlFor="supplier-status">Status</label>
          <select
            id="supplier-status"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option>Ativo</option>
            <option>Inativo</option>
            <option>Pendente</option>
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" style={{ color: "var(--danger, #b42318)" }}>
          {error}
        </p>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate("/app/fornecedores")}
          disabled={saving}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar fornecedor"}
        </button>
      </div>
    </form>
  );
}
