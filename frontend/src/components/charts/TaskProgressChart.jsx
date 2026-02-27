import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const TaskProgressChart = ({ percentage }) => {
  const validPercentage = Math.min(100, Math.max(0, Number(percentage) || 0));
  
  const data = [
    { name: 'Completed', value: validPercentage },
    { name: 'Remaining', value: 100 - validPercentage }
  ];

  const COLORS = ['#4F46E5', '#E5E7EB'];

  const getStatusColor = () => {
    if (validPercentage >= 75) return '#10B981';
    if (validPercentage >= 50) return '#F59E0B';
    if (validPercentage >= 25) return '#4F46E5';
    return '#EF4444';
  };

  const getStatusMessage = () => {
    if (validPercentage === 100) return 'All Tasks Completed! 🎉';
    if (validPercentage >= 75) return 'Almost There!';
    if (validPercentage >= 50) return 'Halfway Done';
    if (validPercentage >= 25) return 'Making Progress';
    return 'Just Started';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-sm">{payload[0].name}</p>
          <p className="text-lg font-bold mt-1" style={{ color: payload[0].payload.color }}>
            {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Task Completion</h3>
          <p className="text-sm text-gray-500 mt-1">Overall progress tracker</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          validPercentage >= 75 ? 'bg-green-50 text-green-600' :
          validPercentage >= 50 ? 'bg-amber-50 text-amber-600' :
          'bg-red-50 text-red-600'
        }`}>
          {getStatusMessage()}
        </div>
      </div>
      
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? getStatusColor() : COLORS[1]} 
                  stroke="white" 
                  strokeWidth={3}
                  className="hover:opacity-90 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-gray-800">{validPercentage}%</span>
          <span className="text-sm text-gray-500 mt-1">Complete</span>
        </div>
      </div>
      
      {/* Stats Summary - Matching other charts */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
          <div 
            className="w-3 h-3 rounded-full mx-auto mb-2" 
            style={{ backgroundColor: getStatusColor() }}
          />
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{validPercentage}%</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
          <div 
            className="w-3 h-3 rounded-full mx-auto mb-2" 
            style={{ backgroundColor: COLORS[1] }}
          />
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{100 - validPercentage}%</p>
        </div>
      </div>
      
      {/* Progress bar with label */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-500">Progress</span>
          <span className="text-xs font-medium text-gray-700">{validPercentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="h-2.5 rounded-full transition-all duration-500"
            style={{ 
              width: `${validPercentage}%`,
              backgroundColor: getStatusColor()
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskProgressChart;