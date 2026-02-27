import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const RecentCasesTable = ({ cases }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleRowClick = (caseId) => {
    navigate(`/cases/${caseId}`);
  };

  const handleViewAllClick = () => {
    navigate('/cases');
  };

  if (!cases || cases.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No recent cases</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Case Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned To
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cases.map((caseItem) => (
            <tr
              key={caseItem._id}
              onClick={() => handleRowClick(caseItem._id)}
              className="hover:bg-blue-50 cursor-pointer transition-colors group"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800">
                  {caseItem.caseNumber}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900 font-medium">
                  {caseItem.caseTitle}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-600">
                  {caseItem.clientId?.name || 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(caseItem.status)}`}>
                  {caseItem.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityColor(caseItem.priority)}`}>
                  {caseItem.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-600">
                  {caseItem.assignedTo?.name || 'Unassigned'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentCasesTable;