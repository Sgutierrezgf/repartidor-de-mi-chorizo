import { Navigate, Route } from "react-router-dom";
import AddClient from "./add-clients/AddClient";
import Recipes from "./recipe-detalis/Recipes";
import RoutesWithNotFound from "../../components/RoutesWithNotFound/RoutesWithNotFound";
import Layout from "../../components/layout/Layout";
import Resume from "./resume/Resume";

export const PrivateRouter = () => {
  return (
    <Layout>
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to="/add-client" />} />
        <Route path="/add-clients" element={<AddClient />} />
        <Route path="/recipe" element={<Recipes />} />
        <Route path="/resume" element={<Resume />} />
      </RoutesWithNotFound>
    </Layout>
  );
};
