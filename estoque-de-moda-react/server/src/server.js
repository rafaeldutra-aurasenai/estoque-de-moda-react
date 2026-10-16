
import express from "express";
import { PASTA_UPLOADS } from "./config/upload.js";
import cors from "cors";
import "dotenv/config";

import { testarConexao } from "./config/db.js";
import autenticarToken from "./middlewares/authMiddleware.js";

import authRouter from "./routes/auth.js";
import produtosRouter from "./routes/produtos.js";
import fornecedoresRouter from "./routes/fornecedores.js";
import categoriasRouter from "./routes/categorias.js";
import movimentacoesRouter from "./routes/movimentacoes.js";
import pedidosRouter from "./routes/pedidos.js";
import configuracoesRouter from "./routes/configuracoes.js";
import usuariosRouter from "./routes/usuarios.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/uploads", express.static(PASTA_UPLOADS));

app.get("/api/health", async (req, res) => {
  try {
    await testarConexao();
    res.json({ status: "ok", banco: "conectado" });
  } catch (erro) {
    res.status(500).json({
      status: "erro",
      banco: "desconectado",
      mensagem: erro.message,
    });
  }
});

// Login e cadastro
app.use("/api/auth", authRouter);

// Todas as rotas seguintes exigem autenticação
app.use("/api", autenticarToken);

app.use("/api/produtos", produtosRouter);
app.use("/api/fornecedores", fornecedoresRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/movimentacoes", movimentacoesRouter);
app.use("/api/pedidos", pedidosRouter);
app.use("/api/configuracoes", configuracoesRouter);
app.use("/api/usuarios", usuariosRouter);

app.get("/", (req, res) => {
  res.json({
    mensagem: "API do Estoque de Moda funcionando!",
    status: "online",
  });
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, async () => {
  console.log(`API rodando em http://localhost:${PORT}`);

  try {
    await testarConexao();
    console.log("MySQL conectado com sucesso!");
  } catch (erro) {
    console.error("Falha na conexão com o MySQL:", erro.message);
  }
});