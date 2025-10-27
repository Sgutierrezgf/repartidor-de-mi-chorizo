import { ReactNode } from "react";

interface ChildrenProps {
  children: ReactNode;
}

const Layout = ({ children }: ChildrenProps) => {
  return (
    <div>
      <nav>Hola</nav>
      {children}
    </div>
  );
};

export default Layout;
