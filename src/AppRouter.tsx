import { BrowserRouter, Navigate, Route } from "react-router-dom";
import Login from "./pages/public/login/Login";
import Orders from "./pages/public/orders/Orders";
import { PrivateGuard } from "./guard/PrivateGuard";
import { PrivateRouter } from "./pages/private/PrivateRouter";
import RoutesWithNotFound from "./components/RoutesWithNotFound/RoutesWithNotFound";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to="/pedidos" replace />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route path="/orders" element={<Navigate to="/pedidos" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateGuard />}>
          <Route path="/private/*" element={<PrivateRouter />} />
        </Route>
      </RoutesWithNotFound>
    </BrowserRouter>
  );
};

export default AppRouter;
