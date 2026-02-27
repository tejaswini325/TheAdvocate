import React, { useState, useEffect } from 'react';
import { createCase, updateCase } from '../../api/caseApi';
import { getClients } from '../../api/clientApi';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { getUsers } from '../../api/authApi'; // Change this line
// Remove: import { getUsers } from '../../api/userApi';
const CaseForm = ({ case: caseItem, onClose }) => {
  const [formData, setFormData] = useState({
    caseTitle: caseItem?.caseTitle || '',
    caseNumber: caseItem?.caseNumber || '',
    clientId: caseItem?.clientId?._id || caseItem?.clientId || '',
    caseType: caseItem?.caseType || '',
    status: caseItem?.status || 'Open',
    priority: caseItem?.priority || 'Medium',
    description: caseItem?.description || '',
    startDate: caseItem?.startDate ? new Date(caseItem.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    nextHearingDate: caseItem?.nextHearingDate ? new Date(caseItem.nextHearingDate).toISOString().split('T')[0] : '',
    assignedTo: caseItem?.assignedTo?._id || caseItem?.assignedTo || ''
  });
  
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const [clientsRes, usersRes] = await Promise.all([
        getClients(1, 100),
        getUsers()
      ]);
      setClients(clientsRes.data.clients);
      setUsers(usersRes.data.users);
    } catch (error) {
      toast.error('Failed to load form data');
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (caseItem) {
        await updateCase(caseItem._id, formData);
        toast.success('Case updated successfully');
      } else {
        await createCase(formData);
        toast.success('Case created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {caseItem ? 'Edit Case' : 'Add New Case'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Title *
              </label>
              <input
                type="text"
                name="caseTitle"
                value={formData.caseTitle}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Number *
              </label>
              <input
                type="text"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client *
              </label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Type *
              </label>
              <input
                type="text"
                name="caseType"
                value={formData.caseType}
                onChange={handleChange}
                required
                placeholder="e.g., Civil, Criminal, Corporate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Hearing Date
              </label>
              <input
                type="date"
                name="nextHearingDate"
                value={formData.nextHearingDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Attorney *
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Attorney</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : caseItem ? 'Update Case' : 'Create Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseForm;