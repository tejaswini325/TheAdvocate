import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiBell, FiUser } from 'react-icons/fi';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-end">
          {/* Right Side Icons - Only notifications and user */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <FiBell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Associate'}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-2">
                <FiUser className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;