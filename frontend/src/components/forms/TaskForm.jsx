import React, { useState, useEffect } from 'react';
import { createTask, updateTask } from '../../api/taskApi';
import { getUsers } from '../../api/authApi';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

const TaskForm = ({ task, cases, onClose }) => {
  const [formData, setFormData] = useState({
    caseId: task?.caseId?._id || task?.caseId || '',
    taskTitle: task?.taskTitle || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    status: task?.status || 'Pending',
    completionPercentage: task?.completionPercentage || 0,
    assignedTo: task?.assignedTo?._id || task?.assignedTo || '' // Add this
  });
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      console.log("Available users:", response);
      
      let usersList = [];
      if (response.data?.users) usersList = response.data.users;
      else if (response.users) usersList = response.users;
      else if (Array.isArray(response)) usersList = response;
      else if (response.data && Array.isArray(response.data)) usersList = response.data;
      
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error('Failed to load attorneys');
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.name === 'completionPercentage' 
      ? parseInt(e.target.value) 
      : e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate assignedTo
    if (!formData.assignedTo) {
      toast.error('Please select an attorney');
      return;
    }
    
    setLoading(true);

    try {
      if (task) {
        await updateTask(task._id, formData);
        toast.success('Task updated successfully');
      } else {
        await createTask(formData);
        toast.success('Task created successfully');
      }
      onClose();
    } catch (error) {
      console.error("Task error:", error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUsers) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-5 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Loading attorneys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Case *
            </label>
            <select
              name="caseId"
              value={formData.caseId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Case</option>
              {cases.map(caseItem => (
                <option key={caseItem._id} value={caseItem._id}>
                  {caseItem.caseTitle} ({caseItem.caseNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              name="taskTitle"
              value={formData.taskTitle}
              onChange={handleChange}
              required
              placeholder="Enter task title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To *
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an Attorney</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
            {users.length === 0 && (
              <p className="text-sm text-red-500 mt-1">No attorneys found. Please add users first.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Completion Percentage: {formData.completionPercentage}%
            </label>
            <input
              type="range"
              name="completionPercentage"
              min="0"
              max="100"
              step="5"
              value={formData.completionPercentage}
              onChange={handleChange}
              className="w-full"
            />
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
              disabled={loading || users.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;