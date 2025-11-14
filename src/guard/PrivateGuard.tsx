import { Navigate, Outlet } from 'react-router-dom';
import { useGlobalContext } from '../context/global.context';


export const PrivateGuard = () => {
    const { auth } = useGlobalContext();
  console.log('PrivateGuard auth:', auth);

  return (
    auth.token ? <Outlet /> : <Navigate to='/login' replace />
  )
}
