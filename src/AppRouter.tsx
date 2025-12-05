import { BrowserRouter, Navigate, Route } from "react-router-dom";
import Login from "./pages/public/login/Login";
import Orders from "./pages/public/orders/Orders";
import { PrivateGuard } from "./guard/PrivateGuard";
import { PrivateRouter } from "./pages/private/PrivateRouter";
import RoutesWithNotFound from "./components/RoutesWithNotFound/RoutesWithNotFound";
import Layout from "./components/layout/Layout";
import { ThemeProvider } from "./context/ThemeProvider";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Layout>
          <RoutesWithNotFound>
            <Route path="/" element={<Navigate to={"/login"} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />
            <Route element={<PrivateGuard />}>
              <Route path="/private/*" element={<PrivateRouter />} />
            </Route>
          </RoutesWithNotFound>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
