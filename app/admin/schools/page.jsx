'use client';

import { useState, useEffect } from 'react';
import SchoolsTable from '@/components/ui/SchoolsTable';
import Button from '@/components/ui/Button';
import AddSchoolModal from '@/components/modals/AddSchoolModal';
import ViewSchoolModal from '@/components/modals/ViewSchoolModal';
import EditSchoolModal from '@/components/modals/EditSchoolModal';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import useDebounce from '@/hooks/useDebounce';

// Helper function to get token from cookies
const getCookieToken = () => {
  const nameEQ = 'token=';
  const parts = document.cookie?.split(';') || [];
  for (let c of parts) {
    c = c.trim();
    if (c.startsWith(nameEQ)) {
      return decodeURIComponent(c.slice(nameEQ.length));
    }
  }
  return null;
};

const Schools = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 2000); // 2 seconds debounce
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    nextPageUrl: null,
    from: 1,
    lastPage: 1,
    perPage: 15,
    to: 0,
    total: 0
  });
  const [tableData, setTableData] = useState({
    headers: ['Name', 'Address', 'Status', 'Actions'],
    rows: []
  });

  const fetchSchools = async (page = 1, filter = '') => {
    setIsLoading(true);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schools`);
      url.searchParams.append('page', page);
      if (filter) {
        url.searchParams.append('filter', filter);
      }
      
      const response = await fetch(url.toString(), {
        headers: {
        //'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
          'Authorization': `Bearer ${getCookieToken()}`,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();

      if (data.status) {
        setSchools(data.data);
        const formattedRows = data.data;

        setTableData(prev => ({
          ...prev,
          rows: formattedRows
        }));
        setPagination({
          currentPage: data.meta.currentPage,
          nextPageUrl: data.meta.nextPageUrl,
          from: data.meta.from,
          lastPage: data.meta.lastPage,
          perPage: data.meta.perPage,
          to: data.meta.to,
          total: data.meta.total
        });
      } else {
        toast.error(data.message || 'Failed to fetch schools');
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Failed to fetch schools');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSchool = async (schoolData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schools`, {
        method: 'POST',
        headers: {
        //'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
          'Authorization': `Bearer ${getCookieToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolData)
      });

      const data = await response.json();

      if (data.status) {
        toast.success(data.message);
        setIsModalOpen(false);
        fetchSchools();
      } else {
        // Show the main error message in the toast
        toast.error(data.message || 'Failed to add school');
        // Throw the error object to be caught by the modal for field-level errors
        throw { errors: data.errors };
      }
    } catch (error) {
      if (error.errors) {
        throw error; // Re-throw to be handled by the modal
      }
      console.error('Error adding school:', error);
      toast.error('Failed to add school');
    }
  };

  const handleEditSchool = async (schoolId, schoolData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schools/${schoolId}`, {
        method: 'PUT',
        headers: {
        //'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
          'Authorization': `Bearer ${getCookieToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolData)
      });

      const data = await response.json();

      if (data.status) {
        toast.success(data.message);
        setIsEditModalOpen(false);
        fetchSchools();
      } else {
        toast.error(data.message || 'Failed to update school');
      }
    } catch (error) {
      console.error('Error updating school:', error);
      toast.error('Failed to update school');
    }
  };

  const handleDeleteSchool = async () => {
    if (!selectedSchool) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schools/${selectedSchool.id}`, {
        method: 'DELETE',
        headers: {
        //'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
          'Authorization': `Bearer ${getCookieToken()}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.status) {
        toast.success('School deleted successfully');
        setIsDeleteModalOpen(false);
        fetchSchools();
      } else {
        toast.error(data.message || 'Failed to delete school');
      }
    } catch (error) {
      console.error('Error deleting school:', error);
      toast.error('Failed to delete school');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Address', accessor: 'address' },
    { header: 'Subdomain', accessor: 'subdomain' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 1 ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (_, row) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setSelectedSchool(row);
              setIsViewModalOpen(true);
            }}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View
          </Button>
          <Button
            onClick={() => {
              setSelectedSchool(row);
              setIsEditModalOpen(true);
            }}
            className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              setSelectedSchool(row);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSchools(1, debouncedSearchTerm);
    } else {
      fetchSchools();
    }
  }, [debouncedSearchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (page) => {
    fetchSchools(page);
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search schools..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-[300px] px-4 py-2 border border-tms-lightGreen rounded-lg focus:outline-none focus:border-tms-lightGreen text-black placeholder-tms-lightGreen bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-tms-lightGreen hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Add School
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">

          <SchoolsTable
            headers={tableData.headers}
            rows={tableData.rows}
            isLoading={isLoading}
            pagination={pagination}
            onView={(school) => {
              setSelectedSchool(school);
              setIsViewModalOpen(true);
            }}
            onEdit={(school) => {
              setSelectedSchool(school);
              setIsEditModalOpen(true);
            }}
            onDelete={(school) => {
              setSelectedSchool(school);
              setIsDeleteModalOpen(true);
            }}
          />

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>
              Showing {pagination.from} to {pagination.to} of {pagination.total} results
            </span>
            <div className="flex items-center gap-2">
              {/* First Page */}
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                onClick={() => fetchSchools(1)}
                disabled={pagination.currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Previous Page */}
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                onClick={() => fetchSchools(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {[...Array(pagination.lastPage)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show current page, first page, last page, and one page before and after current
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.lastPage ||
                    (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        className={`px-3 py-1 rounded-lg ${
                          pagination.currentPage === pageNumber
                            ? 'bg-tms-lightGreen text-white'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => fetchSchools(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === pagination.currentPage - 2 ||
                    pageNumber === pagination.currentPage + 2
                  ) {
                    return <span key={pageNumber} className="px-2">...</span>;
                  }
                  return null;
                })}
              </div>
              
              {/* Next Page */}
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                onClick={() => fetchSchools(pagination.currentPage + 1)}
                disabled={!pagination.nextPageUrl}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Last Page */}
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                onClick={() => fetchSchools(pagination.lastPage)}
                disabled={pagination.currentPage === pagination.lastPage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add School Modal */}
      {isModalOpen && (
        <AddSchoolModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddSchool}
        />
      )}

      {/* View School Modal */}
      {isViewModalOpen && selectedSchool && (
        <ViewSchoolModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedSchool(null);
          }}
          school={selectedSchool}
        />
      )}

      {/* Edit School Modal */}
      {isEditModalOpen && selectedSchool && (
        <EditSchoolModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSchool(null);
          }}
          onSubmit={(data) => handleEditSchool(selectedSchool.id, data)}
          school={selectedSchool}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedSchool(null);
          }}
          onConfirm={handleDeleteSchool}
          title="Delete School"
          message={`Are you sure you want to delete ${selectedSchool?.name}? This action cannot be undone.`}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default Schools;