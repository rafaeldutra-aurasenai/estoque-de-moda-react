import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { salvarSessao } from "../auth.js";

const API_URL = "http://localhost:3001/api";

export default function Signup() {
const navigate = useNavigate();

const [form, setForm] = useState({
nome: "",
sobrenome: "",
empresa: "",
email: "",
senha: "",
});

const [erro, setErro] = useState("");
const [carregando, setCarregando] = useState(false);

function alterar(campo, valor) {
setForm((anterior) => ({
...anterior,
[campo]: valor,
}));
}

async function handleSubmit(e) {
e.preventDefault();


setErro("");
setCarregando(true);

try {
  const resposta = await fetch(
    `${API_URL}/auth/registro`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(form),
    }
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem ||
      "Não foi possível criar a conta."
    );
  }

  // Salva o JWT recebido
  salvarSessao(dados);

  // Vai direto para o painel
  navigate("/app/dashboard", {
    replace: true,
  });

} catch (err) {
  setErro(err.message);
} finally {
  setCarregando(false);
}


}

return ( <section>


  <div className="auth-shell">

    <div className="auth-art">

      <div className="brand-mark">
        ESTOQUE DE MODA
      </div>

      <div className="pitch">

        <h1>
          Comece a organizar
          sua coleção hoje.
        </h1>

        <p>
          Crie sua conta e comece
          com o estoque vazio para
          cadastrar seus próprios produtos.
        </p>

      </div>

      <div className="stat-row">

        <div>
          <b>5 min</b>
          <span>para configurar</span>
        </div>

        <div>
          <b>0</b>
          <span>produtos iniciais</span>
        </div>

      </div>

    </div>

    <div className="auth-form-wrap">

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <div className="eyebrow">
          Nova conta
        </div>

        <h2>
          Criar sua conta
        </h2>

        <div className="sub">
          Leva menos de dois minutos.
        </div>

        <div className="field-row">

          <div className="field">

            <label>
              Nome
            </label>

            <input
              placeholder="Ana"
              value={form.nome}
              onChange={(e) =>
                alterar(
                  "nome",
                  e.target.value
                )
              }
              required
            />

          </div>

          <div className="field">

            <label>
              Sobrenome
            </label>

            <input
              placeholder="Duarte"
              value={form.sobrenome}
              onChange={(e) =>
                alterar(
                  "sobrenome",
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <div className="field">

          <label>
            Nome da marca
          </label>

          <input
            placeholder="Minha Loja"
            value={form.empresa}
            onChange={(e) =>
              alterar(
                "empresa",
                e.target.value
              )
            }
          />

        </div>

        <div className="field">

          <label>
            E-mail
          </label>

          <input
            type="email"
            placeholder="voce@marca.com.br"
            value={form.email}
            onChange={(e) =>
              alterar(
                "email",
                e.target.value
              )
            }
            required
          />

        </div>

        <div className="field">

          <label>
            Senha
          </label>

          <input
            type="password"
            placeholder="Mínimo de 6 caracteres"
            value={form.senha}
            onChange={(e) =>
              alterar(
                "senha",
                e.target.value
              )
            }
            minLength={6}
            required
          />

        </div>

        {erro && (
          <p
            style={{
              color: "var(--danger, red)",
              fontSize: 13,
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
            ? "Criando..."
            : "Criar conta"}
        </button>

        <div className="auth-foot">
          Já tem conta?{" "}
          <Link to="/">
            Entrar
          </Link>
        </div>

      </form>

    </div>

  </div>

</section>


);
}
