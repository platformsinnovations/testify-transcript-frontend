import { useState } from 'react';

const SchoolsTable = ({ 
  headers, 
  rows, 
  isLoading,
  onView,
  onEdit,
  onDelete,
  pagination = { from: 1 } // DEFAULT TO 1 IF PAGINATION IS NOT PROVIDED
}) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] whitespace-nowrap">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs md:text-sm font-medium text-gray-500">
              <th className="px-2 md:px-4 py-3 pl-4 w-16">S/N</th>
              {headers.slice(0, -1).map((header, index) => (
                <th key={index} className="px-2 md:px-4 py-3">
                  {header}
                </th>
              ))}
              <th className="px-2 md:px-4 py-3 pr-4 text-center w-[140px]">
                {headers[headers.length - 1]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-xs md:text-sm text-gray-700 hover:bg-gray-50">
                <td className="px-2 md:px-4 py-3 pl-4 text-gray-500">{pagination.from + rowIndex}</td>
                <td className="px-2 md:px-4 py-3">{row.name}</td>
                <td className="px-2 md:px-4 py-3">{row.address}</td>
                <td className="px-2 md:px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    row.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {row.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-2 md:px-4 py-3 pr-4">
                  <div className="flex items-center justify-end gap-1 md:gap-2">
                    <button
                      onClick={() => onView(row)}
                      className="rounded-lg bg-tms-lightGreen px-2 md:px-3 py-1 text-[10px] md:text-xs text-white hover:opacity-90 whitespace-nowrap"
                    >
                      View
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdownIndex(openDropdownIndex === rowIndex ? null : rowIndex)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 md:h-5 md:w-5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {openDropdownIndex === rowIndex && (
                        <>
                          <div
                            className="fixed inset-0 h-full w-full z-10"
                            onClick={() => setOpenDropdownIndex(null)}
                          />
                          <div className="absolute right-8 -top-10 mt-8 w-24 md:w-32 rounded-md bg-white shadow-2xl ring-1 ring-gray-200 ring-opacity-5 z-20" style={{overflow: 'visible'}}>
                            <div className="py-1 flex flex-col" role="menu" style={{overflow: 'visible'}}>
                              <button
                                onClick={() => {
                                  onEdit(row);
                                  setOpenDropdownIndex(null);
                                }}
                                className="flex items-center w-full px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              {/* <button
                                onClick={() => {
                                  onDelete(row);
                                  setOpenDropdownIndex(null);
                                }}
                                className="flex items-center w-full px-3 md:px-4 py-2 text-xs md:text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                                role="menuitem"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button> */}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolsTable;