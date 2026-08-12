import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarProduto } from "../api.js";
import { usePageHeader } from "../components/PageHeaderContext.jsx";

const vazio = {
  sku: "", name: "", cat: "Vestidos", desc: "",
  price: "", stock: "", min: "",
  colorsText: "", sizesText: "",
};

export default function ProductForm() {
  usePageHeader("catálogo / produtos / novo", "Novo produto");
  const navigate = useNavigate();
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.sku || !form.name) {
      setErro("Preencha ao menos SKU e nome do produto.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      await criarProduto({
        sku: form.sku,
        name: form.name,
        cat: form.cat,
        desc: form.desc,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        min: Number(form.min) || 0,
        colors: form.colorsText.split(",").map((c) => c.trim()).filter(Boolean),
        sizes: form.sizesText.split(",").map((s) => s.trim()).filter(Boolean),
      });
      navigate(`/app/produtos/${form.sku}`);
    } catch {
      setErro("Erro ao salvar. Confira se o backend está rodando e se o SKU já não existe.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form className="form-shell" onSubmit={handleSave}>
      {erro && <div style={{ background: "#fbe4e4", color: "#8a2c2c", padding: "12px 16px", borderRadius: 8 }}>{erro}</div>}

      <div className="form-card">
        <h4>Informações do produto</h4>
        <div className="field"><label>Nome do produto</label><input name="name" value={form.name} onChange={handleChange} /></div>
        <div className="field-row">
          <div className="field">
            <label>Categoria</label>
            <select name="cat" value={form.cat} onChange={handleChange}>
              <option>Vestidos</option>
              <option>Blusas</option>
              <option>Calças</option>
              <option>Saias</option>
              <option>Acessórios</option>
            </select>
          </div>
          <div className="field"><label>SKU</label><input className="mono" name="sku" value={form.sku} onChange={handleChange} placeholder="EX-0001-XX" /></div>
        </div>
        <div className="field">
          <label>Descrição</label>
          <textarea rows={3} name="desc" value={form.desc} onChange={handleChange} />
        </div>
      </div>

      <div className="form-card">
        <h4>Preço e estoque</h4>
        <div className="field-row">
          <div className="field"><label>Preço de venda</label><input name="price" value={form.price} onChange={handleChange} placeholder="349.90" /></div>
          <div className="field"><label>Quantidade em estoque</label><input name="stock" value={form.stock} onChange={handleChange} placeholder="42" /></div>
        </div>
        <div className="field-row">
          <div className="field"><label>Estoque mínimo</label><input name="min" value={form.min} onChange={handleChange} placeholder="10" /></div>
        </div>
      </div>

      <div className="form-card">
        <h4>Variações</h4>
        <div className="field-row">
          <div className="field"><label>Cores disponíveis (separadas por vírgula)</label><input name="colorsText" value={form.colorsText} onChange={handleChange} placeholder="#5C222B, #23201D" /></div>
          <div className="field"><label>Tamanhos (separados por vírgula)</label><input name="sizesText" value={form.sizesText} onChange={handleChange} placeholder="P, M, G, GG" /></div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={() => navigate("/app/produtos")}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={salvando}>{salvando ? "Salvando..." : "Salvar produto"}</button>
      </div>
    </form>
  );
}
