import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Table = ({ 
  headers, 
  rows, 
  onActionClick, 
  onEdit, 
  onDelete, 
  showActions = true,
  pagination = { from: 1 }, // DEFAULT TO 1 IF PAGINATION IS NOT PROVIDED
  showSerialNumber = true // ALLOW TOGGLING SERIAL NUMBER COLUMN
}) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const { user } = useAuth();
  const getBrandColor = () => user?.school?.brandColor || '#04BF68';
  const brandColor = getBrandColor();

  return (
    <div className="w-full rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="w-full min-w-[600px] whitespace-nowrap">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs md:text-sm font-medium text-gray-500">
              {showSerialNumber && (
                <th className="px-2 md:px-4 py-3 pl-4 w-16">S/N</th>
              )}
              {headers.map((header, index) => (
                <th key={index} className="px-2 md:px-4 py-3 last:pr-4">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-xs md:text-sm text-gray-700 hover:bg-gray-50">
                {showSerialNumber && (
                  <td className="px-2 md:px-4 py-3 pl-4 text-gray-500">
                    {pagination.from + rowIndex}
                  </td>
                )}
                {Object.keys(row).map((key, colIndex) => {
                  if (key === 'action') {
                    return (
                      <td key={colIndex} className="px-2 md:px-4 py-3 first:pl-4 last:pr-4">
                        <div className="flex items-center gap-1 md:gap-2">
                          <button
                            onClick={() => onActionClick(row)}
                            className="rounded-lg px-2 md:px-3 py-1 text-[10px] md:text-xs text-white whitespace-nowrap"
                            style={{ backgroundColor: brandColor }}
                          >
                            {row[key]}
                          </button>
                          {showActions && (
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
                                  <div className="absolute right-8 bottom-0 mt-2 w-24 md:w-32 rounded-md bg-white shadow-2xl ring-1 ring-gray-200 ring-opacity-5 z-20" style={{overflow: 'visible'}}>
                                    <div className="py-1 flex flex-col" role="menu" style={{overflow: 'visible'}}>
                                      <button
                                        onClick={() => {
                                          onEdit?.(row);
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
                                      <button
                                        onClick={() => {
                                          onDelete?.(row);
                                          setOpenDropdownIndex(null);
                                        }}
                                        className="flex items-center w-full px-3 md:px-4 py-2 text-xs md:text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                                        role="menuitem"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  }
                  if (key === 'status') {
                    const statusColors = {
                      Approved: 'text-green-600 bg-green-50',
                      Pending: 'text-yellow-600 bg-yellow-50',
                      Declined: 'text-red-600 bg-red-50',
                    };
                    return (
                      <td key={colIndex} className="px-2 md:px-4 py-3 first:pl-4 last:pr-4">
                        <span
                          className={`inline-flex rounded-full px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium whitespace-nowrap ${
                            statusColors[row[key]] || 'text-gray-600 bg-gray-50'
                          }`}
                        >
                          {row[key]}
                        </span>
                      </td>
                    );
                  }
                  return (
                    <td key={colIndex} className="px-2 md:px-4 py-3 first:pl-4 last:pr-4">
                      {row[key]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;