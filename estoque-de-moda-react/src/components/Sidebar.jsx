import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUsuario, limparSessao } from "../auth.js";

function Item({ to, icon, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
    >
      <span className="ic">{icon}</span>
      {children}
    </NavLink>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(getUsuario());
  useEffect(() => {
    const atualizar = () => setUsuario(getUsuario());
    window.addEventListener("sessao-atualizada", atualizar);
    window.addEventListener("storage", atualizar);
    return () => { window.removeEventListener("sessao-atualizada", atualizar); window.removeEventListener("storage", atualizar); };
  }, []);
  const nome = [usuario?.nome, usuario?.sobrenome].filter(Boolean).join(" ") || "Usuário";
  const iniciais = `${usuario?.nome?.[0] || "U"}${usuario?.sobrenome?.[0] || ""}`.toUpperCase();

  return (
    <aside className="sidebar">
      <NavLink to="/app/dashboard" className="brand">
        <div className="mark">M</div>
        <span>Estoque de Moda</span>
      </NavLink>

      <div className="nav-group">
        <div className="nav-label">Visão geral</div>
        <Item to="/app/dashboard" icon="◆">Dashboard</Item>
        <Item to="/app/notificacoes" icon="✦">Notificações</Item>
      </div>

      <div className="nav-group">
        <div className="nav-label">Catálogo</div>
        <Item to="/app/produtos" icon="▤">Produtos</Item>
        <Item to="/app/categorias" icon="▦">Categorias</Item>
      </div>

      <div className="nav-group">
        <div className="nav-label">Operação</div>
        <Item to="/app/movimentacoes" icon="⇅">Movimentações</Item>
        <Item to="/app/fornecedores" icon="◫">Fornecedores</Item>
        <Item to="/app/pedidos" icon="▧">Pedidos</Item>
      </div>

      <div className="nav-group">
        <div className="nav-label">Análise</div>
        <Item to="/app/relatorios" icon="▲">Relatórios</Item>
      </div>

      <div className="nav-group">
        <div className="nav-label">Conta</div>
        <Item to="/app/perfil" icon="●">Perfil</Item>
        <Item to="/app/configuracoes" icon="⚙">Configurações</Item>
      </div>

      <div className="sidebar-foot">
        <NavLink to="/app/perfil" className="mini-profile">
          {usuario?.fotoUrl ? <img className="avatar" src={`http://localhost:3001${usuario.fotoUrl}`} alt="Foto do perfil" style={{ objectFit: "cover" }} /> : <div className="avatar">{iniciais}</div>}
          <div>
            <div className="name">{nome}</div>
            <div className="role">{usuario?.empresa || (usuario?.papel === "dono" ? "Proprietário(a)" : "Conta de usuário")}</div>
          </div>
        </NavLink>
        <a
          className="nav-item"
          href="#"
          style={{ marginTop: 6 }}
          onClick={(e) => {
            e.preventDefault();
            limparSessao();
            navigate("/", { replace: true });
          }}
        >
          <span className="ic">⏻</span>Sair
        </a>
      </div>
    </aside>
  );
}
