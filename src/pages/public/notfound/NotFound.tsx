import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-6xl font-bold text-blood">404</h1>
      <p className="mt-3 text-ink-muted">Esa página no existe en tu registro.</p>
      <Link
        to="/pedidos"
        className="mt-6 text-sm font-semibold text-blood hover:underline"
      >
        Ir a pedidos
      </Link>
    </div>
  );
};

export default NotFound;
