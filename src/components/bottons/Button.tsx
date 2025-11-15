import React from 'react'

interface ButtonProps {
  children: React.ReactNode;
}

export const Button = ({children}: ButtonProps) => {
  return (
    <button className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'>{children}</button>
  )
}
