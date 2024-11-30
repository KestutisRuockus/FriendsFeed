import { NavLink } from 'react-router-dom';
import {navLinks} from './navLinks';
import { NavLinksProps } from './types';
import Logo from "../../assets/Logo.png"
import { useState } from 'react';
import { auth } from '../../firebase/firebaseConfig';

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  const createNavLink = (link: NavLinksProps, index: number) => {
    return (
      <NavLink 
        key={index} 
        to={link.path}
        className={`text-primary font-bold text-xl px-8 py-1 rounded-2xl hover:text-hover hover:scale-125 
          transition-all duration-500 ease-in-out`} 
      >
        {link.name}
      </NavLink>
    )
  }

  const handleBarsIcon = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (error) {
      if(error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  return (
    <nav className='flex w-full h-[68px] justify-between items-center py-4 bg-secondary relative transition-all duration-500 ease-in-out'>
      <img width={52} src={Logo} alt="FriendFeed" className='absolute left-2 top-2 z-30'/>
      <i 
        onClick={handleBarsIcon} 
        className={`block md:!hidden fa-solid fa-bars${isOpen ? '-staggered' : ''} 
                  text-3xl cursor-pointer hover:opacity-50 transition-colors duration-500 ease-in-out absolute right-6 top-6 z-20`}
      />
      <div 
        className={`w-full flex md:flex-row flex-col justify-end max-md:gap-2 max-md:py-8 items-center
          max-md:absolute z-10 ${isOpen ? 'left-0' : 'max-md:-left-full'} top-0 transition-all duration-500 bg-secondary rounded-br-xl`}
      >
          {navLinks.map((navLink, index) => createNavLink(navLink, index))}
          <button
          className='text-primary text-nowrap font-bold text-xl px-8 py-1 rounded-2xl hover:text-hover hover:scale-125 
            transition-all duration-500 ease-in-out'
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </nav>
  )
}

export default Navbar;