
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listarProdutos,
  listarMovimentacoes,
} from "../api.js";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

function obterLista(resposta, chaves = []) {
  if (Array.isArray(resposta)) return resposta;

  for (const chave of chaves) {
    if (Array.isArray(resposta?.[chave])) {
      return resposta[chave];
    }
  }

  return [];
}

function dataISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function moeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function dataFormatada(valor) {
  if (!valor) return "—";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return String(valor);

  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function csvCampo(valor) {
  return `"${String(valor ?? "").replaceAll('"', '""')}"`;
}

export default function Reports() {
  usePageHeader("análise / relatórios", "Relatórios");

  const hoje = dataISO();
  const primeiroDia = dataISO(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [produtos, setProdutos] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [inicio, setInicio] = useState(primeiroDia);
  const [fim, setFim] = useState(hoje);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const [produtosResposta, movimentacoesResposta] =
        await Promise.all([
          listarProdutos(),
          listarMovimentacoes(),
        ]);

      setProdutos(
        obterLista(produtosResposta, [
          "produtos",
          "products",
          "data",
        ])
      );

      setMovimentacoes(
        obterLista(movimentacoesResposta, [
          "movimentacoes",
          "movements",
          "data",
        ])
      );
    } catch (e) {
      setErro(
        e.message || "Não foi possível carregar os relatórios."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const produtosCalculados = useMemo(() => {
    return produtos.map((p) => {
      const estoque = Number(p.stock ?? p.estoque ?? 0);
      const minimo = Number(
        p.min_stock ?? p.min ?? p.estoque_minimo ?? 0
      );
      const preco = Number(p.price ?? p.preco ?? 0);

      return {
        ...p,
        estoque,
        minimo,
        preco,
        valorEstoque: estoque * preco,
        categoria: p.cat ?? p.categoria ?? "Sem categoria",
        nome: p.name ?? p.nome ?? "Produto sem nome",
        skuExibicao: p.sku ?? p.codigo ?? "—",
        critico: estoque <= minimo,
      };
    });
  }, [produtos]);

  const movimentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return movimentacoes
      .filter((m) => {
        const valorData =
          m.criado_em ?? m.created_at ?? m.data;

        const dia = valorData
          ? dataISO(new Date(valorData))
          : "";

        const dentroDoPeriodo =
          (!inicio || dia >= inicio) &&
          (!fim || dia <= fim);

        const texto = [
          m.product_name ?? m.nome_produto ?? "",
          m.sku ?? "",
          m.reason ?? m.observacao ?? "",
        ]
          .join(" ")
          .toLocaleLowerCase("pt-BR");

        return (
          dentroDoPeriodo &&
          (!termo || texto.includes(termo))
        );
      })
      .sort(
        (a, b) =>
          new Date(
            b.criado_em ?? b.created_at ?? b.data ?? 0
          ) -
          new Date(
            a.criado_em ?? a.created_at ?? a.data ?? 0
          )
      );
  }, [movimentacoes, inicio, fim, busca]);

  const resumo = useMemo(() => {
    const entradas = movimentosFiltrados.filter((m) =>
      ["in", "entrada"].includes(
        String(m.type ?? m.tipo ?? "").toLowerCase()
      )
    );

    const saidas = movimentosFiltrados.filter((m) =>
      ["out", "saida", "saída"].includes(
        String(m.type ?? m.tipo ?? "").toLowerCase()
      )
    );

    return {
      unidades: produtosCalculados.reduce(
        (total, p) => total + p.estoque,
        0
      ),

      valor: produtosCalculados.reduce(
        (total, p) => total + p.valorEstoque,
        0
      ),

      criticos: produtosCalculados.filter(
        (p) => p.critico
      ),

      entradasQtd: entradas.reduce(
        (total, m) =>
          total + Number(m.qty ?? m.quantidade ?? 0),
        0
      ),

      saidasQtd: saidas.reduce(
        (total, m) =>
          total + Number(m.qty ?? m.quantidade ?? 0),
        0
      ),

      entradasMov: entradas.length,
      saidasMov: saidas.length,
    };
  }, [produtosCalculados, movimentosFiltrados]);

  const categorias = useMemo(() => {
    const mapa = new Map();

    produtosCalculados.forEach((p) => {
      const atual = mapa.get(p.categoria) || {
        nome: p.categoria,
        produtos: 0,
        unidades: 0,
        valor: 0,
      };

      atual.produtos += 1;
      atual.unidades += p.estoque;
      atual.valor += p.valorEstoque;

      mapa.set(p.categoria, atual);
    });

    return [...mapa.values()].sort(
      (a, b) => b.valor - a.valor
    );
  }, [produtosCalculados]);

  function exportarCSV() {
    const linhas = [
      ["RELATÓRIO DE ESTOQUE"],
      ["Período", inicio, fim],
      [],
      ["RESUMO"],
      ["Indicador", "Valor"],
      ["Produtos cadastrados", produtosCalculados.length],
      ["Unidades em estoque", resumo.unidades],
      ["Valor estimado do estoque", resumo.valor.toFixed(2)],
      ["Produtos com estoque crítico", resumo.criticos.length],
      ["Unidades que entraram", resumo.entradasQtd],
      ["Unidades que saíram", resumo.saidasQtd],
      [],
      ["PRODUTOS"],
      [
        "SKU",
        "Produto",
        "Categoria",
        "Preço",
        "Estoque",
        "Estoque mínimo",
        "Valor em estoque",
        "Situação",
      ],
      ...produtosCalculados.map((p) => [
        p.skuExibicao,
        p.nome,
        p.categoria,
        p.preco.toFixed(2),
        p.estoque,
        p.minimo,
        p.valorEstoque.toFixed(2),
        p.critico ? "Crítico" : "Normal",
      ]),
      [],
      ["MOVIMENTAÇÕES - registros recentes da API"],
      ["Data", "SKU", "Produto", "Tipo", "Quantidade", "Observação"],
      ...movimentosFiltrados.map((m) => [
        dataFormatada(m.criado_em ?? m.created_at ?? m.data),
        m.sku,
        m.product_name ?? m.nome_produto,
        ["in", "entrada"].includes(
          String(m.type ?? m.tipo ?? "").toLowerCase()
        )
          ? "Entrada"
          : "Saída",
        m.qty ?? m.quantidade,
        m.reason ?? m.observacao,
      ]),
    ];

    const conteudo =
      "\uFEFF" +
      linhas
        .map((linha) => linha.map(csvCampo).join(";"))
        .join("\r\n");

    const arquivo = new Blob([conteudo], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");

    link.href = url;
    link.download = `relatorio-estoque-${dataISO()}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  const card = {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius)",
    padding: 18,
    minWidth: 0,
  };

  const botao = {
    border: "1px solid var(--line)",
    borderRadius: 8,
    padding: "9px 13px",
    background: "var(--surface)",
    color: "var(--ink)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  };

  const campo = {
    display: "block",
    width: "100%",
    marginTop: 6,
    border: "1px solid var(--line)",
    borderRadius: 8,
    padding: "9px 10px",
    background: "var(--surface)",
    color: "var(--ink)",
  };

  const rotulo = {
    fontSize: 13,
    color: "var(--ink-soft)",
    marginBottom: 8,
  };

  const numero = {
    fontSize: 25,
    fontWeight: 700,
    overflowWrap: "anywhere",
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <section
        style={{
          ...card,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>
            Relatório do estoque
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "var(--ink-soft)",
              fontSize: 13,
            }}
          >
            Indicadores calculados com os dados da sua loja.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            style={botao}
            onClick={carregar}
            disabled={carregando}
          >
            {carregando ? "Atualizando..." : "↻ Atualizar"}
          </button>

          <button
            type="button"
            style={botao}
            onClick={exportarCSV}
            disabled={carregando || Boolean(erro)}
          >
            ⇩ Exportar CSV
          </button>

          <button
            type="button"
            style={botao}
            onClick={() => window.print()}
          >
            Imprimir / PDF
          </button>
        </div>
      </section>

      {erro && (
        <section
          role="alert"
          style={{
            ...card,
            borderColor: "var(--danger, #b42318)",
          }}
        >
          <strong>Não foi possível gerar o relatório.</strong>
          <p>{erro}</p>
          <button style={botao} onClick={carregar}>
            Tentar novamente
          </button>
        </section>
      )}

      {carregando && (
        <section style={card}>
          Carregando informações do banco de dados...
        </section>
      )}

      {!carregando && !erro && (
        <>
          <div className="grid-4" style={{ marginBottom: 0 }}>
            <div className="card stat-card">
              <div style={rotulo}>Produtos cadastrados</div>
              <div style={numero}>{produtosCalculados.length}</div>
              <small>SKUs cadastrados nesta loja</small>
            </div>

            <div className="card stat-card">
              <div style={rotulo}>Unidades em estoque</div>
              <div style={numero}>
                {resumo.unidades.toLocaleString("pt-BR")}
              </div>
              <small>Quantidade disponível</small>
            </div>

            <div className="card stat-card">
              <div style={rotulo}>Valor estimado do estoque</div>
              <div style={{ ...numero, fontSize: 22 }}>
                {moeda(resumo.valor)}
              </div>
              <small>Preço cadastrado × quantidade</small>
            </div>

            <div className="card stat-card">
              <div style={rotulo}>Estoque crítico</div>
              <div
                style={{
                  ...numero,
                  color: resumo.criticos.length
                    ? "var(--danger, #b42318)"
                    : "var(--success, #16803d)",
                }}
              >
                {resumo.criticos.length}
              </div>
              <small>No mínimo ou abaixo dele</small>
            </div>
          </div>

          <section
            style={{
              ...card,
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 14,
              alignItems: "end",
            }}
          >
            <div>
              <label htmlFor="relatorio-inicio">Data inicial</label>
              <input
                id="relatorio-inicio"
                type="date"
                value={inicio}
                max={fim || undefined}
                onChange={(e) => setInicio(e.target.value)}
                style={campo}
              />
            </div>

            <div>
              <label htmlFor="relatorio-fim">Data final</label>
              <input
                id="relatorio-fim"
                type="date"
                value={fim}
                min={inicio || undefined}
                max={hoje}
                onChange={(e) => setFim(e.target.value)}
                style={campo}
              />
            </div>

            <div>
              <label htmlFor="relatorio-busca">
                Buscar movimentação
              </label>
              <input
                id="relatorio-busca"
                type="search"
                placeholder="Produto, SKU ou observação"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={campo}
              />
            </div>

            <button
              type="button"
              style={botao}
              onClick={() => {
                setInicio(primeiroDia);
                setFim(hoje);
                setBusca("");
              }}
            >
              Limpar filtros
            </button>
          </section>

          <div className="grid-4" style={{ marginBottom: 0 }}>
            <div style={card}>
              <div style={rotulo}>Unidades que entraram</div>
              <div style={numero}>
                {resumo.entradasQtd.toLocaleString("pt-BR")}
              </div>
              <small>{resumo.entradasMov} movimentações</small>
            </div>

            <div style={card}>
              <div style={rotulo}>Unidades que saíram</div>
              <div style={numero}>
                {resumo.saidasQtd.toLocaleString("pt-BR")}
              </div>
              <small>{resumo.saidasMov} movimentações</small>
            </div>

            <div style={card}>
              <div style={rotulo}>Saldo de movimentações</div>
              <div style={numero}>
                {(resumo.entradasQtd - resumo.saidasQtd)
                  .toLocaleString("pt-BR")}
              </div>
              <small>Entradas menos saídas</small>
            </div>

            <div style={card}>
              <div style={rotulo}>Movimentações no período</div>
              <div style={numero}>{movimentosFiltrados.length}</div>
              <small>Registros retornados pela API</small>
            </div>
          </div>

          <div className="grid-3" style={{ alignItems: "start" }}>
            <section style={card}>
              <div className="section-head">
                <h3>Estoque por categoria</h3>
              </div>

              {categorias.length === 0 ? (
                <p>Nenhum produto cadastrado.</p>
              ) : (
                <div style={{ display: "grid", gap: 16 }}>
                  {categorias.map((c) => {
                    const percentual =
                      resumo.valor > 0
                        ? (c.valor / resumo.valor) * 100
                        : 0;

                    return (
                      <div key={c.nome}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 10,
                            fontSize: 13,
                            marginBottom: 6,
                          }}
                        >
                          <strong>{c.nome}</strong>
                          <span>{moeda(c.valor)}</span>
                        </div>

                        <div className="progress">
                          <div
                            style={{ width: `${percentual}%` }}
                          />
                        </div>

                        <small>
                          {c.produtos} produtos · {c.unidades} unidades
                          {" · "}
                          {percentual.toLocaleString("pt-BR", {
                            maximumFractionDigits: 1,
                          })}
                          % do valor
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section style={card}>
              <div className="section-head">
                <h3>Produtos com estoque crítico</h3>
                <span>{resumo.criticos.length} itens</span>
              </div>

              {resumo.criticos.length === 0 ? (
                <p>Nenhum produto no nível crítico.</p>
              ) : (
                resumo.criticos.map((p) => (
                  <div
                    key={p.skuExibicao}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 0",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    <div
                      className="prod-thumb"
                      style={{
                        background: p.color || "var(--accent-soft)",
                      }}
                    >
                      {p.emoji || "👗"}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: 13 }}>
                        {p.nome}
                      </strong>
                      <div style={{ fontSize: 12 }}>
                        {p.skuExibicao} · mínimo {p.minimo}
                      </div>
                    </div>

                    <strong
                      style={{
                        color: "var(--danger, #b42318)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.estoque} un.
                    </strong>
                  </div>
                ))
              )}
            </section>
          </div>

          <section style={card}>
            <div className="section-head">
              <h3>Movimentações do período</h3>
              <span>Até 50 registros recentes</span>
            </div>

            {movimentosFiltrados.length === 0 ? (
              <p>
                Nenhuma movimentação encontrada para os filtros escolhidos.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                    minWidth: 650,
                  }}
                >
                  <thead>
                    <tr style={{ textAlign: "left" }}>
                      {[
                        "Data",
                        "Produto",
                        "SKU",
                        "Tipo",
                        "Quantidade",
                        "Observação",
                      ].map((titulo) => (
                        <th
                          key={titulo}
                          style={{
                            padding: 10,
                            borderBottom: "1px solid var(--line)",
                          }}
                        >
                          {titulo}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {movimentosFiltrados.map((m, i) => {
                      const tipo = String(
                        m.type ?? m.tipo ?? "out"
                      ).toLowerCase();

                      const entrada =
                        tipo === "in" || tipo === "entrada";

                      return (
                        <tr
                          key={m.id ?? `${m.sku}-${i}`}
                          style={{
                            borderBottom: "1px solid var(--line)",
                          }}
                        >
                          <td style={{ padding: 10 }}>
                            {dataFormatada(
                              m.criado_em ?? m.created_at ?? m.data
                            )}
                          </td>
                          <td style={{ padding: 10 }}>
                            {m.product_name ?? m.nome_produto ?? "—"}
                          </td>
                          <td style={{ padding: 10 }}>
                            {m.sku ?? "—"}
                          </td>
                          <td style={{ padding: 10 }}>
                            <span
                              style={{
                                borderRadius: 20,
                                padding: "4px 9px",
                                background: entrada
                                  ? "#e8f7ed"
                                  : "#fff0ed",
                                color: entrada
                                  ? "#176b36"
                                  : "#a12b20",
                                fontWeight: 600,
                              }}
                            >
                              {entrada ? "Entrada" : "Saída"}
                            </span>
                          </td>
                          <td style={{ padding: 10, fontWeight: 700 }}>
                            {Number(m.qty ?? m.quantidade ?? 0)}
                          </td>
                          <td style={{ padding: 10 }}>
                            {m.reason ?? m.observacao ?? "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      <style>{`
        @media print {
          aside, nav, button, input {
            display: none !important;
          }

          body {
            background: white !important;
          }

          .card {
            break-inside: avoid;
            box-shadow: none !important;
          }
        }

        @media (max-width: 760px) {
          .grid-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
