import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Forgot from "./pages/Forgot.jsx";

import OrderForm from "./pages/OrderForm.jsx";

import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import ProductForm from "./pages/ProductForm.jsx";
import Categories from "./pages/Categories.jsx";
import Movements from "./pages/Movements.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import SupplierForm from "./pages/SupplierForm.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Reports from "./pages/Reports.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
return ( <Routes>


  {/* PUBLICO */}
  <Route
    path="/"
    element={<Login />}
  />

  <Route
    path="/signup"
    element={<Signup />}
  />

  <Route
    path="/forgot"
    element={<Forgot />}
  />


  {/* PROTEGIDO POR JWT */}
  <Route element={<ProtectedRoute />}>

    <Route
      path="/app"
      element={<AppLayout />}
    >

      <Route
        index
        element={
          <Navigate
            to="dashboard"
            replace
          />
        }
      />

      <Route
        path="dashboard"
        element={<Dashboard />}
      />

      <Route
        path="produtos"
        element={<Products />}
      />

      <Route
        path="produtos/novo"
        element={<ProductForm />}
      />

      <Route
        path="produtos/:sku"
        element={<ProductDetail />}
      />

      <Route
        path="categorias"
        element={<Categories />}
      />

      <Route
        path="movimentacoes"
        element={<Movements />}
      />

      <Route
        path="fornecedores"
        element={<Suppliers />}
      />

      <Route
        path="fornecedores/novo"
        element={<SupplierForm />}
      />

      <Route
        path="pedidos"
        element={<Orders />}
      />

      <Route
        path="pedidos/novo"
        element={<OrderForm />}
      />

      <Route
        path="pedidos/:id"
        element={<OrderDetail />}
      />

      <Route
        path="relatorios"
        element={<Reports />}
      />

      <Route
        path="notificacoes"
        element={<Notifications />}
      />

      <Route
        path="perfil"
        element={<Profile />}
      />

      <Route
        path="configuracoes"
        element={<Settings />}
      />

    </Route>

  </Route>


  {/* QUALQUER ROTA DESCONHECIDA */}
  <Route
    path="*"
    element={
      <Navigate
        to="/"
        replace
      />
    }
  />

</Routes>


);
}
