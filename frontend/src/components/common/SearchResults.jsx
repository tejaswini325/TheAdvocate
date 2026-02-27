import React from 'react';
import { FiFileText, FiUser, FiBriefcase, FiX } from 'react-icons/fi';

const SearchResults = ({ results, onResultClick, isSearching, onClose }) => {
  const { cases, clients } = results;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
      {/* Header */}
      <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">Search Results</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FiX className="h-4 w-4" />
        </button>
      </div>

      {isSearching ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Searching...</p>
        </div>
      ) : (
        <div className="divide-y">
          {/* Cases Section */}
          {cases.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
                Cases ({cases.length})
              </p>
              {cases.map((caseItem) => (
                <button
                  key={caseItem._id}
                  onClick={() => onResultClick('cases', caseItem._id)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200">
                      <FiBriefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {caseItem.caseTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        #{caseItem.caseNumber} • {caseItem.status}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Clients Section */}
          {clients.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
                Clients ({clients.length})
              </p>
              {clients.map((client) => (
                <button
                  key={client._id}
                  onClick={() => onResultClick('clients', client._id)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200">
                      <FiUser className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {client.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {client.email} • {client.phone}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {cases.length === 0 && clients.length === 0 && (
            <div className="p-8 text-center">
              <FiFileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;