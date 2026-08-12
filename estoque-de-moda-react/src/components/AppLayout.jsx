import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { PageHeaderContext } from "./PageHeaderContext.jsx";

export default function AppLayout() {
  const [header, setHeader] = useState({ crumb: "painel / visão geral", title: "Dashboard" });
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <div>
            <div className="crumb">{header.crumb}</div>
            <h1>{header.title}</h1>
          </div>
          <div className="topbar-actions">
            <div className="searchbox">
              🔍
              <input
                placeholder="Buscar produtos, SKU, pedidos…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate("/app/produtos");
                }}
              />
            </div>
            <button className="icon-btn" title="Notificações" onClick={() => navigate("/app/notificacoes")}>
              ✉<span className="dot-badge"></span>
            </button>
            <button className="icon-btn" title="Notificações" onClick={() => navigate("/app/notificacoes")}>
              🔔<span className="dot-badge"></span>
            </button>
          </div>
        </div>

        <div className="content">
          <PageHeaderContext.Provider value={setHeader}>
            <Outlet />
          </PageHeaderContext.Provider>
        </div>
      </div>
    </div>
  );
}
