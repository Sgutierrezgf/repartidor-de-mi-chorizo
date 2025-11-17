import React from "react";

interface CardProps {
  children: React.ReactNode;
}

export const CardContainer = ({ children }: CardProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white border border-gray-300 rounded-xl shadow-md">
      {children}
    </div>
  );
};
