
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { salvarSessao } from "../auth.js";

const API_URL = "http://localhost:3001/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "E-mail ou senha incorretos."
        );
      }

      // Salva o JWT e os dados do usuário
      salvarSessao(dados);

      // Entra no sistema
      navigate("/app/dashboard", {
        replace: true,
      });
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section>
      <div className="auth-shell">
        <div className="auth-form-wrap">
          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <h2>Entrar na sua conta</h2>

            <div className="field">
              <label htmlFor="email">
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="senha">
                Senha
              </label>

              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
                placeholder="Digite sua senha"
                required
              />
            </div>

            {erro && (
              <p
                style={{
                  color: "red",
                  marginTop: "10px",
                }}
              >
                {erro}
              </p>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? "Entrando..."
                : "Entrar"}
            </button>

            <div className="auth-foot">
              Ainda não tem conta?{" "}
              <Link to="/signup">
                Criar conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
