
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../auth.js";
import { usePageHeader } from "../components/PageHeaderContext.jsx";
import Tag from "../components/Tag.jsx";

const API_URL = "http://localhost:3001/api/fornecedores";

function Campo({ titulo, valor }) {
  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "var(--ink-soft)",
          marginBottom: 5,
        }}
      >
        {titulo}
      </div>
      <div style={{ fontWeight: 500, overflowWrap: "anywhere" }}>
        {valor || "Não informado"}
      </div>
    </div>
  );
}

export default function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fornecedor, setFornecedor] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  usePageHeader(
    "operação / fornecedores / detalhes",
    fornecedor?.name || "Detalhes do fornecedor"
  );

  useEffect(() => {
    let ativo = true;

    async function carregarFornecedor() {
      setCarregando(true);
      setErro("");

      try {
        const resposta = await apiFetch(
          `${API_URL}/${encodeURIComponent(id)}`
        );

        const dados = await resposta.json().catch(() => null);

        if (!resposta.ok) {
          throw new Error(
            dados?.error ||
              dados?.erro ||
              `Erro ${resposta.status} ao carregar fornecedor.`
          );
        }

        if (ativo) {
          setFornecedor(dados);
        }
      } catch (e) {
        if (ativo) {
          setErro(e.message || "Não foi possível carregar o fornecedor.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarFornecedor();

    return () => {
      ativo = false;
    };
  }, [id]);

  if (carregando) {
    return <p>Carregando informações do fornecedor...</p>;
  }

  if (erro || !fornecedor) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <h3>Não foi possível abrir o fornecedor</h3>
        <p>{erro || "Fornecedor não encontrado."}</p>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/app/fornecedores")}
        >
          Voltar para fornecedores
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div>
        <Link
          to="/app/fornecedores"
          style={{
            color: "var(--accent)",
            fontWeight: 600,
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          ← Voltar para fornecedores
        </Link>
      </div>

      <section className="card" style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <span className="chip">
              {fornecedor.cat || "Sem categoria"}
            </span>

            <h2 style={{ margin: "12px 0 6px" }}>
              {fornecedor.name || "Fornecedor"}
            </h2>

            <p
              style={{
                margin: 0,
                color: "var(--ink-soft)",
                fontSize: 13,
              }}
            >
              Código do fornecedor: {fornecedor.id}
            </p>
          </div>

          <Tag status={fornecedor.status || "Ativo"} />
        </div>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h3>Dados cadastrais</h3>

        <div className="grid-3">
          <Campo titulo="Razão social" valor={fornecedor.name} />
          <Campo titulo="CNPJ" valor={fornecedor.cnpj} />
          <Campo titulo="Categoria" valor={fornecedor.cat} />
          <Campo titulo="Telefone" valor={fornecedor.phone} />
          <Campo titulo="E-mail" valor={fornecedor.email} />
          <Campo titulo="Status" valor={fornecedor.status} />
          <Campo titulo="Contato" valor={fornecedor.contato} />
          <Campo titulo="Cidade" valor={fornecedor.cidade} />
          <Campo titulo="Endereço" valor={fornecedor.endereco} />
        </div>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h3>Produtos fornecidos</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>
          {fornecedor.products || "Nenhum produto informado."}
        </p>
      </section>

      {fornecedor.notes && (
        <section className="card" style={{ padding: 24 }}>
          <h3>Observações</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {fornecedor.notes}
          </p>
        </section>
      )}

      <div className="form-actions">
        <button
          className="btn btn-ghost"
          onClick={() => navigate("/app/fornecedores")}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
