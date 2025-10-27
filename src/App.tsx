import Layout from "./components/layout/Layout";
import AddClient from "./pages/add-clients/AddClient";
import Dashboard from "./pages/dashboard/Dashboard";
import Recipes from "./pages/recipe-detalis/Recipes";

function App() {
  return (
    <Layout>
      <AddClient />
      <Recipes />
      <Dashboard />
    </Layout>
  );
}

export default App;
