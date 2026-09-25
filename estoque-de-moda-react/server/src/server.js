import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import produtosRouter from './routes/produtos.js';
import fornecedoresRouter from './routes/fornecedores.js';
import categoriasRouter from './routes/categorias.js';
import movimentacoesRouter from './routes/movimentacoes.js';
import pedidosRouter from './routes/pedidos.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/produtos', produtosRouter);
app.use('/api/fornecedores', fornecedoresRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/movimentacoes', movimentacoesRouter);
app.use('/api/pedidos', pedidosRouter);

app.get('/', (req, res) => {
  res.send('API do Estoque de Moda no ar 🚀');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);