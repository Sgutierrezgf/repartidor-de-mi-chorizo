import { type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "../../pages/public/notfound/NotFound";

interface Props {
  children: ReactNode;
}

const RoutesWithNotFound = ({ children }: Props) => {
  return (
    <Routes>
      {children}
      <Route path="*" element={<Navigate to="404" replace />} />
      <Route path="404" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesWithNotFound;
