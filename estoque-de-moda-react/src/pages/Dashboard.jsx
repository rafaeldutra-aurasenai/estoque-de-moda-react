import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  listarProdutos,
  listarMovimentacoes
} from "../api.js";

import Tag from "../components/Tag.jsx";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

export default function Dashboard() {
  usePageHeader("painel / visão geral", "Dashboard");

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [moves, setMoves] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");

        const [produtos, movimentacoes] = await Promise.all([
          listarProdutos(),
          listarMovimentacoes()
        ]);

        setProducts(produtos);
        setMoves(movimentacoes);
      } catch (error) {
        console.error(error);

        setErro(
          "Não foi possível carregar os dados do dashboard."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const totalEstoque = products.reduce(
    (total, produto) => total + Number(produto.stock || 0),
    0
  );

  const produtosEstoqueBaixo = products.filter(
    (produto) => produto.status !== "ok"
  );

  const valorEstoque = products.reduce(
    (total, produto) =>
      total +
      Number(produto.priceValue || 0) *
      Number(produto.stock || 0),
    0
  );

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);

  if (carregando) {
    return <p>Carregando dashboard...</p>;
  }

  return (
    <div>
      {erro && (
        <div
          style={{
            background: "#fbe4e4",
            color: "#8a2c2c",
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 16
          }}
        >
          {erro}
        </div>
      )}

      <div
        className="grid-4"
        style={{ marginBottom: 20 }}
      >
        <div className="card stat-card">
          <div className="stat-value">
            {totalEstoque.toLocaleString("pt-BR")}
          </div>

          <div className="stat-label">
            Peças em estoque
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-value">
            {products.length}
          </div>

          <div className="stat-label">
            Produtos cadastrados
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-value">
            {formatarMoeda(valorEstoque)}
          </div>

          <div className="stat-label">
            Valor em estoque
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-value">
            {produtosEstoqueBaixo.length}
          </div>

          <div className="stat-label">
            Itens com estoque baixo
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="section-head">
            <h3>Produtos cadastrados</h3>

            <a
              className="link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/app/produtos");
              }}
            >
              Ver produtos
            </a>
          </div>

          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Estoque</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.slice(0, 5).map((produto) => (
                <tr
                  key={produto.sku}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(
                      `/app/produtos/${produto.sku}`
                    )
                  }
                >
                  <td className="prod-cell">
                    <div
                      className="prod-thumb"
                      style={{
                        background: produto.color
                      }}
                    >
                      {produto.emoji}
                    </div>

                    <div>
                      <div className="pname">
                        {produto.name}
                      </div>

                      <div className="psku">
                        {produto.sku}
                      </div>
                    </div>
                  </td>

                  <td>{produto.cat}</td>
                  <td>{produto.stock}</td>

                  <td>
                    <Tag status={produto.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="section-head">
            <h3>Movimentações recentes</h3>

            <a
              className="link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/app/movimentacoes");
              }}
            >
              Ver tudo
            </a>
          </div>

          {moves.slice(0, 5).map((movimento) => (
            <div
              className="move-row"
              key={movimento.id}
            >
              <div
                className={`move-ic ${movimento.type}`}
              >
                {movimento.type === "in" ? "↓" : "↑"}
              </div>

              <div className="move-body">
                <div className="move-title">
                  {movimento.product_name}
                </div>

                <div className="move-sub">
                  {movimento.reason || movimento.sku}
                </div>
              </div>

              <div
                className="move-qty"
                style={{
                  color:
                    movimento.type === "in"
                      ? "var(--success)"
                      : "var(--danger)"
                }}
              >
                {movimento.type === "in" ? "+" : "-"}
                {movimento.qty}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}