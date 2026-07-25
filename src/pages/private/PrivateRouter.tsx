import { Navigate, Route } from "react-router-dom";
import RoutesWithNotFound from "../../components/RoutesWithNotFound/RoutesWithNotFound";
import Layout from "../../components/layout/Layout";
import Ventas from "./ventas/Ventas";
import Envios from "./envios/Envios";
import EnvioDetalle from "./envios/EnvioDetalle";
import Receta from "./receta/Receta";

export const PrivateRouter = () => {
  return (
    <Layout>
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to="/private/ventas" replace />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/envios" element={<Envios />} />
        <Route path="/envios/:id" element={<EnvioDetalle />} />
        <Route path="/receta" element={<Receta />} />
        {/* Compatibilidad con rutas viejas */}
        <Route path="/add-clients" element={<Navigate to="/private/ventas" replace />} />
        <Route path="/recipe" element={<Navigate to="/private/receta" replace />} />
        <Route path="/dashboard" element={<Navigate to="/private/ventas" replace />} />
      </RoutesWithNotFound>
    </Layout>
  );
};
