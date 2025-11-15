import type { ReactNode } from "react";
import { NavBar } from "../navbar/NavBar";
import { Footer } from "../footer/Footer";

interface ChildrenProps {
  children: ReactNode;
}

const Layout = ({ children }: ChildrenProps) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
