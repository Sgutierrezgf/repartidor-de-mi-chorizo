import { Link } from 'react-router-dom';
import logo from '../../assets/img/chorizos.jpeg';
import { Button } from '../bottons/Button';

export const NavBar = () => {
  return (
    <nav className='flex justify-between items-center shadow-lg pb-4 pt-4 px-8 rounded-lg bg-white'>
      <div className='flex items-center gap-8'>
      <img src={logo} alt="chorizos" className='h-12 w-12 rounded-full object-cover' />
        <ul className='flex gap-4'>
         <li className='hover:text-red-500 '><Link to="/private/add-clients">clients</Link></li>
         <li className='hover:text-red-500 focus:text-purple-600'><Link to="/private/recipe">recipe</Link></li>
         <li className='hover:text-red-500 focus:text-purple-600'><Link to="/private/dashboard">dashboard</Link></li>
        </ul>
      </div>
      <div>
        <Button>Logout</Button>
      </div>
    </nav>
  )
}
