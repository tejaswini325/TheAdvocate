import React, { useState, useEffect } from 'react';
import { updateDocument, uploadDocument } from '../../api/documentApi';
import { getCases } from '../../api/caseApi';
import toast from 'react-hot-toast';
import { FiX, FiUpload } from 'react-icons/fi';

const DocumentForm = ({ document, cases: propCases, onClose }) => {
  const [formData, setFormData] = useState({
    caseId: document?.caseId?._id || document?.caseId || '',
    documentName: document?.documentName || '',
    documentType: document?.documentType || '',
    status: document?.status || 'Pending'
  });
  
  const [cases, setCases] = useState(propCases || []);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCases, setFetchingCases] = useState(!propCases);

  useEffect(() => {
    if (!propCases) {
      fetchCases();
    }
  }, [propCases]);

  const fetchCases = async () => {
    try {
      const response = await getCases({ limit: 100 });
      let casesList = [];
      if (response.data?.cases) casesList = response.data.cases;
      else if (response.cases) casesList = response.cases;
      else if (Array.isArray(response)) casesList = response;
      setCases(casesList);
    } catch (error) {
      toast.error('Failed to load cases');
    } finally {
      setFetchingCases(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      // Auto-fill document name
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setFormData({ ...formData, documentName: fileName });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.caseId) {
      toast.error('Please select a case');
      return;
    }

    setLoading(true);

    try {
      if (document) {
        // UPDATE existing document - this is what you need
        console.log('Updating document with:', formData);
        const response = await updateDocument(document._id, {
          caseId: formData.caseId,
          documentName: formData.documentName,
          documentType: formData.documentType,
          status: formData.status  // This will update the status
        });
        console.log('Update response:', response);
        toast.success('Document updated successfully');
      } else {
        // Upload new document
        const formDataToSend = new FormData();
        formDataToSend.append('caseId', formData.caseId);
        formDataToSend.append('documentName', formData.documentName);
        formDataToSend.append('documentType', formData.documentType);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('file', selectedFile);
        
        await uploadDocument(formDataToSend);
        toast.success('Document uploaded successfully');
      }
      onClose();
    } catch (error) {
      console.error('Operation error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {document ? 'Edit Document' : 'Upload Document'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Case *
            </label>
            <select
              name="caseId"
              value={formData.caseId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a case</option>
              {cases.map(caseItem => (
                <option key={caseItem._id} value={caseItem._id}>
                  {caseItem.caseTitle} ({caseItem.caseNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Name *
            </label>
            <input
              type="text"
              name="documentName"
              value={formData.documentName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type *
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="Contract">Contract</option>
              <option value="Pleading">Pleading</option>
              <option value="Motion">Motion</option>
              <option value="Brief">Brief</option>
              <option value="Evidence">Evidence</option>
              <option value="Correspondence">Correspondence</option>
              <option value="Court Order">Court Order</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          {!document && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File *
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                className="w-full px-3 py-2 border rounded-lg"
              />
              {selectedFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : document ? 'Update Document' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentForm;