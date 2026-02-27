import React, { useState, useEffect } from 'react';
import { getDocuments, deleteDocument, viewDocument, downloadDocument } from '../../api/documentApi';
import { getCases } from '../../api/caseApi';
import { FiEye, FiDownload, FiEdit2, FiTrash2, FiPlus, FiFileText, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import DocumentForm from '../../components/forms/DocumentForm';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch documents
      const docsRes = await getDocuments();
      
      // Handle different response formats
      let docsList = [];
      if (docsRes?.data?.documents) {
        docsList = docsRes.data.documents;
      } else if (docsRes?.documents) {
        docsList = docsRes.documents;
      } else if (Array.isArray(docsRes)) {
        docsList = docsRes;
      } else if (docsRes?.data && Array.isArray(docsRes.data)) {
        docsList = docsRes.data;
      }
      
      setDocuments(docsList || []);
      
      // Fetch cases for reference
      try {
        const casesRes = await getCases({ limit: 100 });
        let casesList = [];
        if (casesRes?.data?.cases) casesList = casesRes.data.cases;
        else if (casesRes?.cases) casesList = casesRes.cases;
        else if (Array.isArray(casesRes)) casesList = casesRes;
        setCases(casesList || []);
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
      
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to fetch documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      await deleteDocument(selectedDocument._id);
      toast.success('Document deleted successfully');
      fetchData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleEdit = (document) => {
    setSelectedDocument(document);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedDocument(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedDocument(null);
    fetchData();
  };

  const getCaseTitle = (caseId) => {
    if (!caseId) return 'Unknown Case';
    if (typeof caseId === 'object' && caseId !== null) {
      return caseId.caseTitle || 'Unknown Case';
    }
    const caseItem = cases.find(c => c._id === caseId);
    return caseItem ? caseItem.caseTitle : 'Unknown Case';
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return '✅';
      case 'reviewed': return '👁️';
      case 'pending': return '⏳';
      default: return '📄';
    }
  };

  const filteredDocuments = (documents || []).filter(doc => {
    if (filter === 'all') return true;
    return doc?.status?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <FiFileText className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Documents</h1>
              <p className="text-blue-100 text-sm mt-1">Manage and organize your legal documents</p>
            </div>
          </div>
          
          <button
            onClick={handleAdd}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <FiPlus className="h-5 w-5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Documents</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{documents.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {documents.filter(d => d.status?.toLowerCase() === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Reviewed</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {documents.filter(d => d.status?.toLowerCase() === 'reviewed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {documents.filter(d => d.status?.toLowerCase() === 'approved').length}
          </p>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiFilter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Filter by status:</span>
            </div>
            <div className="flex space-x-2">
              {['all', 'pending', 'reviewed', 'approved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    filter === status
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                  {status !== 'all' && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                      {documents.filter(d => d.status?.toLowerCase() === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          {(!filteredDocuments || filteredDocuments.length === 0) ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No documents found</p>
              <p className="text-gray-400 mt-2">Click "Upload Document" to add your first document</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Case</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-md">
                          <FiFileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.documentName || 'Unnamed'}</p>
                          <p className="text-xs text-gray-400 mt-0.5">ID: {doc._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{doc.documentType || 'Other'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{getCaseTitle(doc.caseId)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 inline-flex items-center space-x-1 text-xs font-medium rounded-full border ${getStatusColor(doc.status)}`}>
                        <span>{getStatusIcon(doc.status)}</span>
                        <span>{doc.status || 'Pending'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => viewDocument(doc._id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                          title="View Document"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadDocument(doc._id)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                          title="Download Document"
                        >
                          <FiDownload className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEdit(doc)}
                              className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-all"
                              title="Edit"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              title="Delete"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <DocumentForm
          document={selectedDocument}
          cases={cases}
          onClose={handleModalClose}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
      />
    </div>
  );
};

export default Documents;