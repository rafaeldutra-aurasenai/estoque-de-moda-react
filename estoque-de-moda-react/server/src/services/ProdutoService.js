
import ProdutoRepository from "../repositories/ProdutoRepository.js";

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function converterArray(valor) {
  if (Array.isArray(valor)) return valor;

  if (typeof valor === "string") {
    try {
      const resultado = JSON.parse(valor);
      return Array.isArray(resultado) ? resultado : [];
    } catch {
      return [];
    }
  }

  return [];
}

function paraProduto(linha) {
  const estoque = Number(linha.stock) || 0;
  const estoqueMinimo = Number(linha.min_stock) || 0;

  return {
    sku: linha.sku,
    name: linha.name,
    cat: linha.cat,
    price: formatador.format(Number(linha.price) || 0),
    priceValue: Number(linha.price) || 0,
    stock: estoque,
    min: estoqueMinimo,
    status:
      estoque === 0
        ? "out"
        : estoque <= estoqueMinimo
          ? "low"
          : "ok",
    emoji: linha.emoji || "👗",
    color: linha.color || "#EFEAE2",
    supplier: linha.supplier || "",
    location: linha.location || "",
    entry: linha.entry_date
      ? formatadorData.format(new Date(linha.entry_date)).replace(".", "")
      : "",
    colors: converterArray(linha.colors),
    sizes: converterArray(linha.sizes),
    desc: linha.descricao || "",
  };
}

const ProdutoService = {
  async listarTodos(lojaId) {
    const linhas = await ProdutoRepository.listarTodos(lojaId);
    return linhas.map(paraProduto);
  },

  async buscarPorSku(sku, lojaId) {
    const linha = await ProdutoRepository.buscarPorSku(sku, lojaId);
    return linha ? paraProduto(linha) : null;
  },

  async criar(dados, lojaId) {
    await ProdutoRepository.criar(dados, lojaId);
    return this.buscarPorSku(dados.sku, lojaId);
  },

  async atualizar(sku, dados, lojaId) {
    const existente = await ProdutoRepository.buscarPorSku(sku, lojaId);

    if (!existente) return null;

    const atualizado = await ProdutoRepository.atualizar(
      sku,
      lojaId,
      dados
    );

    if (!atualizado) return null;

    return this.buscarPorSku(sku, lojaId);
  },

  async remover(sku, lojaId) {
    return ProdutoRepository.remover(sku, lojaId);
  },
};

export default ProdutoService;