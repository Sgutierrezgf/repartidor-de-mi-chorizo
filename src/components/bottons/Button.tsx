import React from 'react'

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({children, onClick, type}: ButtonProps) => {
  return (
     <button
      type={type}
      onClick={onClick}
      className="w-24 bg-red-500 text-white font-medium py-2.5 rounded-lg hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {children}
    </button>
  )
}
