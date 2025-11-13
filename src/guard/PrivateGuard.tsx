import { Navigate, Outlet } from 'react-router-dom';


export const PrivateGuard = () => {
    const authenticated = true; 


  return (
    authenticated ? <Outlet /> : <Navigate to='/login' replace />
  )
}
