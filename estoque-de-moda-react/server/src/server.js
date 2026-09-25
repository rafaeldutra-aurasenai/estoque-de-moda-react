import express from "express";
import cors from "cors";
import "dotenv/config";

import { testarConexao } from "./config/db.js";

import produtosRouter from "./routes/produtos.js";
import fornecedoresRouter from "./routes/fornecedores.js";
import categoriasRouter from "./routes/categorias.js";
import movimentacoesRouter from "./routes/movimentacoes.js";
import pedidosRouter from "./routes/pedidos.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());

app.use("/api/produtos", produtosRouter);
app.use("/api/fornecedores", fornecedoresRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/movimentacoes", movimentacoesRouter);
app.use("/api/pedidos", pedidosRouter);

app.get("/", (req, res) => {
  res.json({
    mensagem: "API do Estoque de Moda funcionando!",
    status: "online"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await testarConexao();

    res.json({
      status: "ok",
      banco: "conectado"
    });
  } catch (erro) {
    res.status(500).json({
      status: "erro",
      banco: "desconectado",
      mensagem: erro.message
    });
  }
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, async () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);

  try {
    await testarConexao();
  } catch (erro) {
    console.error("A API iniciou, mas o banco não está conectado.");
  }
});