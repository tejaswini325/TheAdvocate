import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CasePriorityChart = ({ data }) => {
  // Default data if none provided
  const chartData = data && data.length > 0 ? data : [
    { _id: 'Low', count: 0 },
    { _id: 'Medium', count: 0 },
    { _id: 'High', count: 0 }
  ];

  // Updated colors as requested
  const COLORS = {
    'Low': '#34D399',     // Soft Green
    'Medium': '#FBBF24',  // Warm Yellow
    'High': '#F87171'      // Soft Red
  };

  const formattedData = chartData.map(item => ({
    name: item._id,
    value: item.count,
    color: COLORS[item._id] || '#6B7280'
  })).sort((a, b) => {
    const order = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return order[b.name] - order[a.name];
  });

  const total = formattedData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-sm">{label} Priority</p>
          <p className="text-lg font-bold mt-1" style={{ color: payload[0].payload.color }}>
            {payload[0].value} cases
          </p>
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
          <h3 className="text-lg font-semibold text-gray-800">Cases by Priority</h3>
          <p className="text-sm text-gray-500 mt-1">Distribution by urgency level</p>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">No cases available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Cases by Priority</h3>
          <p className="text-sm text-gray-500 mt-1">Distribution by urgency level</p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
          Total: {total} cases
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            radius={[8, 8, 0, 0]}
            barSize={50}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {formattedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                className="hover:opacity-90 transition-opacity"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {formattedData.map((item, index) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
          return (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
              <div 
                className="w-3 h-3 rounded-full mx-auto mb-2" 
                style={{ backgroundColor: item.color }}
              />
              <p className="text-xs text-gray-500">{item.name}</p>
              <p className="text-lg font-bold text-gray-800 mt-1">{item.value}</p>
              <p className="text-xs text-gray-400">{percentage}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CasePriorityChart;