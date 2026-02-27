import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, color, change }) => {
  const isPositive = change && change.startsWith('+');
  
  const getGradient = (color) => {
    return color || 'from-blue-500 to-blue-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {value}
            </p>
          </div>
          <div className={`bg-gradient-to-br ${getGradient(color)} p-4 rounded-xl shadow-lg`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        
        {change && (
          <div className="mt-4 flex items-center">
            <div className={`flex items-center ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <FiTrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <FiTrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-semibold">{change}</span>
            </div>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        )}
      </div>
      
      {/* Decorative bottom bar */}
      <div className={`h-1 bg-gradient-to-r ${getGradient(color)}`}></div>
    </div>
  );
};

export default StatCard;