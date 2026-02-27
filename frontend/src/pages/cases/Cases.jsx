import React, { useState, useEffect } from 'react';
import { getCases, deleteCase, searchCases } from '../../api/caseApi';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiRefreshCw, FiBriefcase, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import CaseForm from '../../components/forms/CaseForm';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    caseType: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchCases();
  }, [pagination.page]);

  // Only refetch when filters change, not on every render
  useEffect(() => {
    if (!loading) {
      fetchCases();
    }
  }, [filters.status, filters.priority, filters.caseType]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      
      // Build query params - only include non-empty filters
      const params = {};
      params.page = pagination.page;
      params.limit = pagination.limit;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.caseType) params.caseType = filters.caseType;
      
      const response = await getCases(params);
      
      // Handle different response formats
      let casesData = [];
      let paginationData = {
        page: pagination.page,
        limit: pagination.limit,
        total: 0,
        pages: 0
      };
      
      if (response.data?.cases) {
        casesData = response.data.cases;
        paginationData = response.data.pagination || paginationData;
      } else if (response.cases) {
        casesData = response.cases;
        paginationData = response.pagination || paginationData;
      } else if (Array.isArray(response)) {
        casesData = response;
        paginationData.total = response.length;
        paginationData.pages = Math.ceil(response.length / pagination.limit);
      } else if (response.data && Array.isArray(response.data)) {
        casesData = response.data;
        paginationData.total = response.data.length;
        paginationData.pages = Math.ceil(response.data.length / pagination.limit);
      }
      
      setCases(casesData);
      setPagination(paginationData);
      
    } catch (error) {
      toast.error('Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCases();
      return;
    }
    
    try {
      setLoading(true);
      const response = await searchCases(searchTerm);
      
      let searchResults = [];
      if (response.data?.cases) searchResults = response.data.cases;
      else if (response.cases) searchResults = response.cases;
      else if (Array.isArray(response)) searchResults = response;
      else if (response.data && Array.isArray(response.data)) searchResults = response.data;
      
      setCases(searchResults);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCase(selectedCase._id);
      toast.success('Case deleted successfully');
      fetchCases();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete case');
    }
  };

  const handleEdit = (caseItem) => {
    setSelectedCase(caseItem);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedCase(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCase(null);
    fetchCases();
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      caseType: ''
    });
    setSearchTerm('');
    setPagination({ ...pagination, page: 1 });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Calculate stats
  const totalCases = cases.length;
  const openCases = cases.filter(c => c.status === 'Open' || c.status === 'In Progress' || c.status === 'Pending Review').length;
  const closedCases = cases.filter(c => c.status === 'Closed').length;
  const highPriority = cases.filter(c => c.priority === 'High').length;

  if (loading && cases.length === 0) return <Loader />;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header with gradient - ORIGINAL SIZE */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <FiBriefcase className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Cases</h1>
              <p className="text-blue-100 text-sm mt-1">Manage and track your legal cases</p>
            </div>
          </div>
          
          <button
            onClick={handleAdd}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <FiPlus className="h-5 w-5" />
            <span>Add New Case</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - ORIGINAL SIZE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Cases</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalCases}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Open Cases</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{openCases}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Closed Cases</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{closedCases}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">High Priority</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{highPriority}</p>
        </div>
      </div>

      {/* Search and Filters - ORIGINAL SIZE */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Search Bar - ORIGINAL SIZE */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search cases by title, number or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 ${
                showFilters 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiFilter className="h-5 w-5" />
              <span>Filters</span>
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-200"
              title="Clear filters"
            >
              <FiRefreshCw className="h-5 w-5" />
            </button>
          </div>

          {/* Filter Panel - ORIGINAL SIZE */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-100/50 rounded-xl">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Case Type</label>
                <input
                  type="text"
                  placeholder="e.g., Civil, Criminal"
                  value={filters.caseType}
                  onChange={(e) => setFilters({ ...filters, caseType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Cases Table - ONLY TABLE TEXT SIZE REDUCED */}
        <div className="overflow-x-auto">
          {cases.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No cases found</p>
              <p className="text-gray-400 mt-2">Click "Add New Case" to create your first case</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Hearing</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cases.map((caseItem) => (
                  <tr key={caseItem._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        {caseItem.caseNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{caseItem.caseTitle}</p>
                        <p className="text-xs text-gray-400 mt-0.5">ID: {caseItem._id?.slice(-6)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">
                        {caseItem.clientId?.name || caseItem.clientName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                        {caseItem.caseType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityBadge(caseItem.priority)}`}>
                        {caseItem.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-xs text-gray-600">
                        <FiCalendar className="h-3 w-3 text-gray-400 mr-1" />
                        {caseItem.nextHearingDate ? new Date(caseItem.nextHearingDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(caseItem)}
                          className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all"
                          title="Edit Case"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setSelectedCase(caseItem);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                            title="Delete Case"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination - ORIGINAL SIZE */}
        {cases.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setPagination({ ...pagination, page })}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <CaseForm
          case={selectedCase}
          onClose={handleModalClose}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Case"
        message="Are you sure you want to delete this case? This action cannot be undone."
      />
    </div>
  );
};

export default Cases;