import { type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const RoutesWithNotFound = ({ children }: Props) => {
  return (
    <Routes>
      {children}
      <Route path="*" element={<Navigate to="404" replace />} />
      <Route
        path="404"
        element={
          <div className="rounded-lg border border-line bg-surface p-8 text-center">
            <h1 className="font-display text-2xl font-bold">No encontrado</h1>
            <p className="mt-2 text-ink-muted">Esa página no existe en tu registro.</p>
          </div>
        }
      />
    </Routes>
  );
};

export default RoutesWithNotFound;
