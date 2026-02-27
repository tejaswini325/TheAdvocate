import React, { useState, useEffect } from 'react';
import { getClients, deleteClient, searchClients } from '../../api/clientApi';
import { getCasesByClient } from '../../api/caseApi';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiUser, FiMail, FiPhone, FiMapPin, FiMoreVertical, FiBriefcase, FiCalendar, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ClientForm from '../../components/forms/ClientForm';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientCases, setClientCases] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchClients();
  }, [pagination.page]);

  const fetchClientCasesData = async (clientsList) => {
    const casesCount = {};
    for (const client of clientsList) {
      try {
        const response = await getCasesByClient(client._id);
        let casesForClient = [];
        if (response.data?.cases) casesForClient = response.data.cases;
        else if (response.cases) casesForClient = response.cases;
        else if (Array.isArray(response)) casesForClient = response;
        casesCount[client._id] = casesForClient.length;
      } catch (error) {
        casesCount[client._id] = 0;
      }
    }
    setClientCases(casesCount);
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getClients(pagination.page, pagination.limit);
      
      // Handle different response formats
      let clientsList = [];
      if (response.data?.clients) clientsList = response.data.clients;
      else if (response.clients) clientsList = response.clients;
      else if (Array.isArray(response)) clientsList = response;
      
      let paginationData = response.data?.pagination || response.pagination || {
        page: pagination.page,
        limit: pagination.limit,
        total: clientsList.length,
        pages: Math.ceil(clientsList.length / pagination.limit)
      };
      
      setClients(clientsList);
      setPagination(paginationData);
      
      // Fetch cases for each client
      if (clientsList.length > 0) {
        await fetchClientCasesData(clientsList);
      }
      
    } catch (error) {
      toast.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchClients();
      return;
    }
    
    try {
      setLoading(true);
      const response = await searchClients(searchTerm);
      
      let searchResults = [];
      if (response.data?.clients) searchResults = response.data.clients;
      else if (response.clients) searchResults = response.clients;
      else if (Array.isArray(response)) searchResults = response;
      
      setClients(searchResults);
      
      // Fetch cases for search results
      if (searchResults.length > 0) {
        await fetchClientCasesData(searchResults);
      }
      
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient(selectedClient._id);
      toast.success('Client deleted successfully');
      fetchClients();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete client');
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedClient(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedClient(null);
    fetchClients();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Calculate real stats
  const totalClients = pagination.total;
  const activeCases = Object.values(clientCases).reduce((sum, count) => sum + count, 0);
  
  const thisMonth = clients.filter(client => {
    const created = new Date(client.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;
  
  const lastMonth = clients.filter(client => {
    const created = new Date(client.createdAt);
    const now = new Date();
    const lastMonth = now.getMonth() - 1;
    const year = lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = lastMonth < 0 ? 11 : lastMonth;
    return created.getMonth() === month && created.getFullYear() === year;
  }).length;

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <FiUser className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Clients</h1>
              <p className="text-blue-100 text-sm mt-1">Manage your client relationships</p>
            </div>
          </div>
          
          {isAdmin && (
            <button
              onClick={handleAdd}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <FiPlus className="h-5 w-5" />
              <span>Add New Client</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards - Now with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalClients}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiUser className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">All registered clients</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Cases</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{activeCases}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiBriefcase className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Across all clients</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{thisMonth}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiCalendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">New clients this month</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Last Month</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{lastMonth}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <FiClock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Previous month</p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search clients by name, email or phone..."
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
          </div>
        </div>

        {/* Clients Table */}
        <div className="overflow-x-auto">
          {clients.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No clients found</p>
              <p className="text-gray-400 mt-2">Click "Add New Client" to create your first client</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cases</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-semibold text-sm">
                            {client.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'C'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">ID: {client._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiMail className="h-3.5 w-3.5 text-gray-400 mr-2" />
                          <span className="text-sm">{client.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiPhone className="h-3.5 w-3.5 text-gray-400 mr-2" />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-sm text-gray-600">
                        <FiMapPin className="h-3.5 w-3.5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{client.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
                        {clientCases[client._id] || 0} Cases
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1.5 rounded-full border border-green-100">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(client)}
                          disabled={!isAdmin}
                          className={`p-2 rounded-lg transition-all ${
                            isAdmin 
                              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          title="Edit"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                            title="Delete"
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

        {/* Pagination */}
        {clients.length > 0 && (
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
        <ClientForm
          client={selectedClient}
          onClose={handleModalClose}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
      />
    </div>
  );
};

export default Clients;