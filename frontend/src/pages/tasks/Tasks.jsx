import React, { useState, useEffect } from 'react';
import { getTasks, deleteTask, updateTask } from '../../api/taskApi';
import { getCases } from '../../api/caseApi';
import { FiEdit2, FiTrash2, FiPlus, FiCheckCircle, FiCircle, FiClock, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import TaskForm from '../../components/forms/TaskForm';
import Loader from '../../components/common/Loader';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, casesRes] = await Promise.all([
        getTasks(),
        getCases({ limit: 100 })
      ]);

      // Handle different response formats
      let tasksList = [];
      if (tasksRes?.data?.tasks) tasksList = tasksRes.data.tasks;
      else if (tasksRes?.tasks) tasksList = tasksRes.tasks;
      else if (Array.isArray(tasksRes)) tasksList = tasksRes;

      let casesList = [];
      if (casesRes?.data?.cases) casesList = casesRes.data.cases;
      else if (casesRes?.cases) casesList = casesRes.cases;
      else if (Array.isArray(casesRes)) casesList = casesRes;

      setTasks(tasksList || []);
      setCases(casesList || []);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(selectedTask._id);
      toast.success('Task deleted successfully');
      fetchData();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusToggle = async (task) => {
    try {
      const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
      const newPercentage = newStatus === 'Completed' ? 100 : 0;
      
      await updateTask(task._id, {
        ...task,
        status: newStatus,
        completionPercentage: newPercentage
      });
      
      toast.success(`Task marked as ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTask(null);
    fetchData();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status === 'Pending';
    if (filter === 'completed') return task.status === 'Completed';
    return true;
  });

  const getCaseTitle = (caseId) => {
    if (!caseId) return 'No Case';
    if (typeof caseId === 'object' && caseId !== null) {
      return caseId.caseTitle || 'Unknown Case';
    }
    const caseItem = cases.find(c => c._id === caseId);
    return caseItem ? caseItem.caseTitle : 'Unknown Case';
  };

  const getDueDateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600 bg-red-50' };
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-600 bg-orange-50' };
    if (diffDays <= 3) return { text: `${diffDays} days left`, color: 'text-yellow-600 bg-yellow-50' };
    return { text: `${diffDays} days left`, color: 'text-green-600 bg-green-50' };
  };

  if (loading) return <Loader />;

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <FiCheckCircle className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tasks</h1>
              <p className="text-blue-100 text-sm mt-1">Manage and track your legal tasks</p>
            </div>
          </div>
          
          <button
            onClick={handleAdd}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <FiPlus className="h-5 w-5" />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalTasks}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingTasks}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{completedTasks}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{completionRate}%</p>
        </div>
      </div>

      {/* Filters and Tasks List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiClock className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Filter by status:</span>
            </div>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All', count: totalTasks },
                { key: 'pending', label: 'Pending', count: pendingTasks },
                { key: 'completed', label: 'Completed', count: completedTasks }
              ].map((status) => (
                <button
                  key={status.key}
                  onClick={() => setFilter(status.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    filter === status.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                    {status.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="divide-y divide-gray-100">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No tasks found</p>
              <p className="text-gray-400 mt-2">Click "Add New Task" to create your first task</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const dueDateStatus = getDueDateStatus(task.dueDate);
              return (
                <div key={task._id} className="p-6 hover:bg-blue-50/30 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <button
                        onClick={() => handleStatusToggle(task)}
                        className="mt-1 focus:outline-none"
                      >
                        {task.status === 'Completed' ? (
                          <FiCheckCircle className="h-6 w-6 text-green-500 hover:text-green-600 transition-colors" />
                        ) : (
                          <FiCircle className="h-6 w-6 text-gray-300 hover:text-gray-400 transition-colors" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-3">
                          <h3 className={`text-base font-semibold ${
                            task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'
                          }`}>
                            {task.taskTitle}
                          </h3>
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            task.status === 'Completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium text-gray-700 mr-2">Case:</span>
                            <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                              {getCaseTitle(task.caseId)}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <FiCalendar className="h-4 w-4 mr-1 text-gray-400" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                          
                          <div className={`flex items-center text-xs px-2.5 py-1 rounded-full ${dueDateStatus.color}`}>
                            <FiClock className="h-3 w-3 mr-1" />
                            <span>{dueDateStatus.text}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-500">Progress</span>
                            <span className="text-xs font-medium text-gray-700">{task.completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                task.completionPercentage === 100 
                                  ? 'bg-green-500' 
                                  : task.completionPercentage >= 50 
                                    ? 'bg-blue-500' 
                                    : 'bg-yellow-500'
                              }`}
                              style={{ width: `${task.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all"
                        title="Edit Task"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                        title="Delete Task"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <TaskForm
          task={selectedTask}
          cases={cases}
          onClose={handleModalClose}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
      />
    </div>
  );
};

export default Tasks;