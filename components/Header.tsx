
import React from 'react';
import type { User } from '../types';
import { ICONS } from '../constants';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="text-gray-500 focus:outline-none lg:hidden mr-4">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Bienvenido, {user.name.split(' ')[0]}</h1>
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 mr-4 hidden md:inline">{user.name}</span>
        <button
          onClick={onLogout}
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          title="Cerrar Sesión"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {ICONS.logout}
          </svg>
          <span className="ml-2 hidden sm:inline">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
