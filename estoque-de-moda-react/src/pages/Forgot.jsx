import { Link } from "react-router-dom";

export default function Forgot() {
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <section>
      <div className="auth-shell">
        <div className="auth-art">
          <div className="brand-mark">ESTOQUE DE MODA</div>
          <div className="pitch">
            <h1>Vamos recuperar seu acesso.</h1>
            <p>Enviaremos um link de redefinição para o e-mail cadastrado na sua conta.</p>
          </div>
        </div>
        <div className="auth-form-wrap">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="eyebrow">Recuperar acesso</div>
            <h2>Esqueceu a senha?</h2>
            <div className="sub">Informe o e-mail da conta para receber o link de redefinição.</div>
            <div className="field"><label htmlFor="email-recuperacao">E-mail</label><input id="email-recuperacao" type="email" placeholder="voce@marca.com.br" required /></div>
            <p role="status" style={{ fontSize: 13, color: "var(--ink-soft)" }}>A recuperação automática ainda não está configurada neste projeto. Para não informar algo incorreto, nenhum e-mail será enviado.</p>
            <button className="btn btn-primary" type="submit" disabled>Recuperação indisponível</button>
            <div className="auth-foot">
              <Link to="/">← Voltar para o login</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
