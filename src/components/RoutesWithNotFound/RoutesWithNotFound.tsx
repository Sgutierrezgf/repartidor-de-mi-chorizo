import  { type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

interface Props {
    children: ReactNode
}

const RoutesWithNotFound = ({children}: Props) => {
  return (
    <Routes>
        {children}
        <Route path="*" element={<Navigate to='/404'/>} />
        <Route path="/404" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default RoutesWithNotFound