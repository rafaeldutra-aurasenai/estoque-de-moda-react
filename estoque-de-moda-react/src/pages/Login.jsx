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
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), senha }),
      });
      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(dados.mensagem || dados.erro || "E-mail ou senha incorretos.");
      }

      salvarSessao(dados);
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      setErro(err.message || "Não foi possível conectar ao servidor. Verifique se a API está ligada.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="login-page">
      <div className="auth-shell">
        <aside className="auth-art login-art">
          <div className="login-art-photo" aria-hidden="true" />
          <div className="login-art-overlay" aria-hidden="true" />
          <div className="brand-mark login-brand"><span className="brand-symbol">✃</span> Estoque de Moda</div>
          <div className="pitch login-pitch">
            <span className="login-kicker">GESTÃO • MODA • ORGANIZAÇÃO</span>
            <h1>Sua coleção organizada. Seu negócio em movimento.</h1>
            <p>Gerencie peças, cores, tamanhos, fornecedores e movimentações de estoque em um só lugar — para você cuidar do que sua marca faz de melhor.</p>
            <div className="login-tags"><span>Controle de estoque</span><span>Entradas e saídas</span><span>Visão do negócio</span></div>
          </div>
          <div className="login-art-footer">FEITO PARA QUEM VIVE A MODA <span>EST. • MODA</span></div>
        </aside>

        <div className="auth-form-wrap login-form-wrap">
          <form className="auth-form login-form" onSubmit={handleSubmit}>
            <div className="login-mobile-brand"><span className="brand-symbol">✳</span> Estoque de Moda</div>
            <div className="eyebrow">BEM-VINDO DE VOLTA</div>
            <h2>Entre na sua conta</h2>
            <p className="sub">Acesse seu espaço de gestão e continue de onde parou.</p>

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@suaempresa.com" required />
            </div>

            <div className="field">
              <label htmlFor="senha">Senha</label>
              <div className="login-password-wrap">
                <input id="senha" type={mostrarSenha ? "text" : "password"} autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" required />
                <button type="button" className="login-show-password" onClick={() => setMostrarSenha((v) => !v)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}>{mostrarSenha ? "Ocultar" : "Mostrar"}</button>
              </div>
            </div>

            {erro && <p role="alert" className="login-error">{erro}</p>}

            <button className="btn btn-primary login-submit" type="submit" disabled={carregando}>
              {carregando ? "Entrando…" : "Entrar na plataforma  →"}
            </button>

            <div className="auth-foot login-auth-foot">Ainda não tem conta? <Link to="/signup">Criar conta</Link></div>
            <p className="login-privacy">Seus dados de estoque reunidos em um único lugar.</p>
          </form>
        </div>
      </div>
      <style>{`
        .login-page{min-height:100vh;background:#faf8f4;color:#27231f}.login-art{isolation:isolate;background:#49362f!important;padding:42px 48px!important;min-height:100vh}.login-art-photo,.login-art-overlay{position:absolute;inset:0;z-index:-2}.login-art-photo{background-image:url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85');background-size:cover;background-position:center}.login-art-overlay{z-index:-1;background:linear-gradient(180deg,rgba(34,25,22,.52),rgba(42,28,24,.76) 55%,rgba(37,25,22,.92))}.login-brand{display:flex;align-items:center;gap:10px;font-size:20px!important}.brand-symbol{display:inline-grid;place-items:center;width:34px;height:34px;border:1px solid rgba(255,255,255,.65);border-radius:50%;font-size:22px}.login-pitch{max-width:490px!important;margin:auto 0}.login-kicker{font-size:10px;letter-spacing:.2em;font-weight:700;color:#ead1b6}.login-pitch h1{font-size:clamp(34px,4vw,52px)!important;line-height:1.08!important;letter-spacing:-.035em;margin:20px 0!important}.login-pitch p{font-size:15px!important;line-height:1.8!important;max-width:430px}.login-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:25px}.login-tags span{border:1px solid rgba(255,255,255,.35);border-radius:30px;padding:8px 12px;font-size:11px;color:#fff;background:rgba(255,255,255,.08)}.login-art-footer{position:relative;display:flex;justify-content:space-between;gap:12px;font-size:10px;letter-spacing:.16em;color:rgba(255,255,255,.72)}.login-form-wrap{padding:48px!important}.login-form{max-width:400px!important}.login-form .eyebrow{color:#96745c!important;letter-spacing:.18em!important;font-weight:700}.login-form h2{font-size:32px!important;letter-spacing:-.03em;margin:0 0 8px!important}.login-form .sub{line-height:1.65;margin-bottom:32px!important}.login-form .field{margin-bottom:20px}.login-form .field label{font-size:12px;margin-bottom:8px}.login-form .field input{min-height:46px;border-radius:10px;background:#fff;border-color:#e5ded6}.login-password-wrap{position:relative}.login-password-wrap input{padding-right:76px!important}.login-show-password{position:absolute;right:9px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:#80644f;font-size:11px;font-weight:700;cursor:pointer;padding:7px}.login-error{color:#a83232;background:#fff0ef;border:1px solid #f2d1ce;border-radius:8px;padding:10px 12px;font-size:13px}.login-submit{width:100%;min-height:47px;border-radius:10px;margin-top:8px}.login-auth-foot{margin-top:24px;text-align:center}.login-auth-foot a{font-weight:700}.login-privacy{margin-top:42px;text-align:center;color:#a49a90;font-size:11px}.login-mobile-brand{display:none}@media(max-width:900px){.login-art{display:flex!important;min-height:290px!important;padding:26px!important}.login-art .login-pitch{margin:28px 0 10px}.login-pitch h1{font-size:32px!important}.login-art-footer{display:none}.login-form-wrap{padding:32px 24px!important}.login-mobile-brand{display:flex;align-items:center;gap:9px;font-weight:700;margin-bottom:32px}.login-mobile-brand .brand-symbol{color:#765540;border-color:#bda894}}
      `}</style>
    </section>
  );
}
