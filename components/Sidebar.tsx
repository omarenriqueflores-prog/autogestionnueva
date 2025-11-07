
import React from 'react';
import type { View } from '../types';
import { WHATSAPP_URL, ICONS } from '../constants';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavLink: React.FC<{
    view: View;
    label: string;
    currentView: View;
    onNavigate: (view: View) => void;
    icon: React.ReactNode;
}> = ({ view, label, currentView, onNavigate, icon }) => {
    const isActive = currentView === view;
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onNavigate(view);
            }}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
        >
            <svg className="w-5 h-5 mr-3" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {icon}
            </svg>
            {label}
        </a>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const navItems = [
    { view: 'dashboard' as View, label: 'Inicio', icon: ICONS.dashboard },
    { view: 'invoices' as View, label: 'Mis Facturas', icon: ICONS.invoices },
    { view: 'claims' as View, label: 'Reclamos', icon: ICONS.claims },
    { view: 'report-payment' as View, label: 'Informar Pago', icon: ICONS['report-payment'] },
    { view: 'plans' as View, label: 'Planes y Precios', icon: ICONS.plans },
    { view: 'news' as View, label: 'Novedades', icon: ICONS.news },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-lg">
        <div className="p-4 border-b">
            <h2 className="text-2xl font-bold text-blue-600">Tartagal</h2>
            <p className="text-sm text-gray-500">Comunicaciones</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map(item => (
                <NavLink key={item.view} {...item} currentView={currentView} onNavigate={onNavigate} />
            ))}
        </nav>
        <div className="p-4 mt-auto border-t">
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {ICONS.whatsapp}
                </svg>
                Enviar WhatsApp
            </a>
        </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
      <div className={`fixed inset-y-0 left-0 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-white z-40 lg:hidden`}>
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
            {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
