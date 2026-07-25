import type { ReactNode } from "react";
import { NavBar } from "../navbar/NavBar";

interface ChildrenProps {
  children: ReactNode;
}

const Layout = ({ children }: ChildrenProps) => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-20">{children}</div>
    </div>
  );
};

export default Layout;
