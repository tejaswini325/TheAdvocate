import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DocumentStatusChart = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { _id: 'Pending', count: 0 },
    { _id: 'Reviewed', count: 0 },
    { _id: 'Approved', count: 0 }
  ];

  const COLORS = {
    'Pending': '#F59E0B',    // Amber
    'Reviewed': '#4F46E5',   // Indigo
    'Approved': '#10B981'    // Emerald
  };

  const formattedData = chartData.map(item => ({
    name: item._id,
    value: item.count,
    color: COLORS[item._id] || '#6B7280'
  }));

  const total = formattedData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-sm" style={{ color: data.color }}>{data.name}</p>
          <p className="text-lg font-bold mt-1">{data.value} documents</p>
          <p className="text-xs text-gray-500 mt-1">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Document Status</h3>
          <p className="text-sm text-gray-500 mt-1">Document review progress</p>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">No documents available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Document Status</h3>
          <p className="text-sm text-gray-500 mt-1">Document review progress</p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
          {total} total
        </div>
      </div>
      
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {formattedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
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
          <span className="text-3xl font-bold text-gray-800">{total}</span>
          <span className="text-sm text-gray-500 mt-1">Documents</span>
        </div>
      </div>
      
      {/* Progress Bar Summary */}
      <div className="space-y-4 mt-6">
        {formattedData.map((item, index) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-800">{item.value}</span>
                  <span className="text-xs text-gray-400 ml-1">({percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentStatusChart;