import ProdutoRepository from '../repositories/ProdutoRepository.js';

const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const formatadorData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

// Transforma uma linha do banco no formato que a tela React já espera
// (mesmo "shape" que existia em src/data.js)
function paraProduto(linha) {
  const status = linha.stock === 0 ? 'out' : linha.stock <= linha.min_stock ? 'low' : 'ok';
  return {
    sku: linha.sku,
    name: linha.name,
    cat: linha.cat,
    price: formatador.format(linha.price),
    priceValue: Number(linha.price),
    stock: linha.stock,
    min: linha.min_stock,
    status,
    emoji: linha.emoji,
    color: linha.color,
    supplier: linha.supplier,
    location: linha.location,
    entry: linha.entry_date ? formatadorData.format(new Date(linha.entry_date)).replace('.', '') : '',
    colors: typeof linha.colors === 'string' ? JSON.parse(linha.colors) : linha.colors,
    sizes: typeof linha.sizes === 'string' ? JSON.parse(linha.sizes) : linha.sizes,
    desc: linha.descricao,
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

  // Retorna null se o produto não existir
  async atualizar(sku, dados) {
    const existente = await ProdutoRepository.buscarPorSku(sku);
    if (!existente) return null;

    await ProdutoRepository.atualizar(sku, dados);
    return this.buscarPorSku(sku);
  },

  async remover(sku) {
    return ProdutoRepository.remover(sku);
  },
};

export default ProdutoService;
