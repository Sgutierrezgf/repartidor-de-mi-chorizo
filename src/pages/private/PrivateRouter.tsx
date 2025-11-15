import { Navigate, Route } from "react-router-dom";
import AddClient from "./add-clients/AddClient";
import Dashboard from "./dashboard/Dashboard";
import Recipes from "./recipe-detalis/Recipes";
import RoutesWithNotFound from "../../components/RoutesWithNotFound/RoutesWithNotFound";
import Layout from "../../components/layout/Layout";

export const PrivateRouter = () => {
  return (
      <Layout>
    <RoutesWithNotFound>
        <Route path="/" element={<Navigate to="/add-client" />} />
        <Route path="/add-clients" element={<AddClient />} />
        <Route path="/recipe" element={<Recipes />} />
        <Route path="/dashboard" element={<Dashboard />} />
    </RoutesWithNotFound>
      </Layout>
  );
};
