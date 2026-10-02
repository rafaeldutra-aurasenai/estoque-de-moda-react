import { Navigate, Outlet, useLocation } from "react-router-dom";
import { estaAutenticado } from "../auth.js";

export default function ProtectedRoute() {
const location = useLocation();

if (!estaAutenticado()) {
return (
<Navigate
to="/"
replace
state={{ from: location.pathname }}
/>
);
}

return <Outlet />;
}
