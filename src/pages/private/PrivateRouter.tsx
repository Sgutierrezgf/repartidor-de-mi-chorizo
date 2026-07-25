import { Navigate, Route } from "react-router-dom";
import RoutesWithNotFound from "../../components/RoutesWithNotFound/RoutesWithNotFound";
import Layout from "../../components/layout/Layout";
import Ventas from "./ventas/Ventas";
import Envios from "./envios/Envios";
import EnvioDetalle from "./envios/EnvioDetalle";
import Receta from "./receta/Receta";
import Resumen from "./resume/Resume";

export const PrivateRouter = () => {
  return (
    <Layout>
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to="/private/ventas" replace />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/envios" element={<Envios />} />
        <Route path="/envios/:id" element={<EnvioDetalle />} />
        <Route path="/receta" element={<Receta />} />
        <Route path="/resumen" element={<Resumen />} />
        <Route path="/add-clients" element={<Navigate to="/private/ventas" replace />} />
        <Route path="/recipe" element={<Navigate to="/private/receta" replace />} />
        <Route path="/resume" element={<Navigate to="/private/resumen" replace />} />
        <Route path="/dashboard" element={<Navigate to="/private/ventas" replace />} />
      </RoutesWithNotFound>
    </Layout>
  );
};
