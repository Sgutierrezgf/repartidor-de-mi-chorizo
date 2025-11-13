import type { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

interface ChildrenProps {
  children: ReactNode;
}

const Layout = ({ children }: ChildrenProps) => {
  return (
    <div>
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
