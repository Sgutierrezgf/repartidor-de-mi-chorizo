import { Navigate, Outlet } from 'react-router-dom';
import { useGlobalContext } from '../context/global.context';


export const PrivateGuard = () => {
    const { auth } = useGlobalContext();

  return (
    auth.token ? <Outlet /> : <Navigate to='/login' replace />
  )
}
