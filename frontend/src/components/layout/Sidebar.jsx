import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiBriefcase, 
  FiCheckSquare, 
  FiFileText,
  FiLogOut,
  FiShield
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: FiHome },
    { path: '/clients', name: 'Clients', icon: FiUsers },
    { path: '/cases', name: 'Cases', icon: FiBriefcase },
    { path: '/tasks', name: 'Tasks', icon: FiCheckSquare },
    { path: '/documents', name: 'Documents', icon: FiFileText },
  ];

  return (
    <aside className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen flex flex-col shadow-2xl">
      {/* Logo Area - Increased text size */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-lg">
            <FiShield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">TheAdvocate</h1>
            <p className="text-xs text-blue-300 mt-0.5 tracking-wide">Navigate Justice with Ease</p>
          </div>
        </div>
      </div>
      
      {/* Navigation - Increased text size */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3.5 text-base rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* User Info & Logout - Increased text size */}
      <div className="p-5 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-2.5">
            <FiUsers className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">{user?.name || 'Admin'}</p>
            <p className="text-sm text-blue-300 mt-0.5">{user?.role || 'Admin'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3.5 text-base text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors group"
        >
          <FiLogOut className="mr-3 h-5 w-5 group-hover:text-white" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;