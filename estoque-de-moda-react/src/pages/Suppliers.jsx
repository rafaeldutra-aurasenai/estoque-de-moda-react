import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Tag from "../components/Tag.jsx";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const API_URL = "http://localhost:3001/api/fornecedores";

export default function Suppliers() {
  usePageHeader("operação / fornecedores", "Fornecedores");
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSuppliers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
        const data = await res.json();
        setSuppliers(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Erro ao carregar fornecedores");
      } finally {
        setLoading(false);
      }
    }

    fetchSuppliers();
    return () => controller.abort();
  }, []);

  const filteredSuppliers = useMemo(() => {
    if (!search.trim()) return suppliers;
    const term = search.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name?.toLowerCase().includes(term) ||
        s.cat?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.cnpj?.toLowerCase().includes(term)
    );
  }, [suppliers, search]);

  return (
    <div>
      <div className="toolbar">
        <div className="searchbox" style={{ width: 320 }}>
          🔍
          <input
            placeholder="Buscar fornecedor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate("/app/fornecedores/novo")}>
          + Novo fornecedor
        </button>
      </div>

      <div className="card">
        {loading && <p style={{ padding: 16 }}>Carregando fornecedores…</p>}
        {error && <p style={{ padding: 16, color: "var(--danger, red)" }}>Erro: {error}</p>}

        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Fornecedor</th>
                <th>CNPJ</th>
                <th>Categoria</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th>Produtos</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 16 }}>
                    Nenhum fornecedor encontrado.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s) => (
                  <tr
                    key={s.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/app/fornecedores/${s.id}`)}
                  >
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>{s.cnpj}</td>
                    <td>{s.cat}</td>
                    <td>{s.phone}</td>
                    <td>{s.email}</td>
                    <td>{s.products}</td>
                    <td><Tag status={s.status} /></td>
                    <td><span style={{ color: "var(--accent)", fontWeight: 600 }}>Ver →</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}