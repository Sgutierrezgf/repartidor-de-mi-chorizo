import React from "react";

interface CardProps {
  children: React.ReactNode;
}

export const CardContainer = ({ children }: CardProps) => {
  return (
    <div className="mx-auto mt-8 p-6 bg-white border border-gray-300 rounded-xl shadow-md">
      {children}
    </div>
  );
};
