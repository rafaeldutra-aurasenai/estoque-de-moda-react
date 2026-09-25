import ProdutoRepository from "../repositories/ProdutoRepository.js";

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

function converterArray(valor) {
  if (Array.isArray(valor)) {
    return valor;
  }

  if (!valor) {
    return [];
  }

  try {
    const convertido = JSON.parse(valor);

    return Array.isArray(convertido) ? convertido : [];
  } catch {
    return [];
  }
}

function paraProduto(linha) {
  const estoque = Number(linha.stock) || 0;
  const estoqueMinimo = Number(linha.min_stock) || 0;

  const status =
    estoque === 0
      ? "out"
      : estoque <= estoqueMinimo
        ? "low"
        : "ok";

  return {
    sku: linha.sku,
    name: linha.name,
    cat: linha.cat,

    price: formatador.format(Number(linha.price) || 0),
    priceValue: Number(linha.price) || 0,

    stock: estoque,
    min: estoqueMinimo,
    status,

    emoji: linha.emoji || "👗",
    color: linha.color || "#EFEAE2",

    supplier: linha.supplier || "",
    location: linha.location || "",

    entry: linha.entry_date
      ? formatadorData
          .format(new Date(linha.entry_date))
          .replace(".", "")
      : "",

    colors: converterArray(linha.colors),
    sizes: converterArray(linha.sizes),

    desc: linha.descricao || ""
  };
}

const ProdutoService = {
  async listarTodos() {
    const linhas = await ProdutoRepository.listarTodos();

    return linhas.map(paraProduto);
  },

  async buscarPorSku(sku) {
    const linha = await ProdutoRepository.buscarPorSku(sku);

    return linha ? paraProduto(linha) : null;
  },

  async criar(dados) {
    await ProdutoRepository.criar(dados);

    return this.buscarPorSku(dados.sku);
  },

  async atualizar(sku, dados) {
    const existente = await ProdutoRepository.buscarPorSku(sku);

    if (!existente) {
      return null;
    }

    await ProdutoRepository.atualizar(sku, dados);

    return this.buscarPorSku(sku);
  },

  async remover(sku) {
    return ProdutoRepository.remover(sku);
  }
};

export default ProdutoService;