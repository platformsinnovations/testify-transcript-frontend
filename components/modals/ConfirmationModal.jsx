"use client";

import { useAuth } from "@/contexts/AuthContext";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { user } = useAuth();

  // GET BRAND COLOR
  const getBrandColor = () => user?.school?.brandColor || "#04BF68";
  const brandColor = getBrandColor();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-1000">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      ></div>

      {/* MODAL */}
      <div
        className="bg-white rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto relative z-1001 shadow-xl">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-200"
          style={{ backgroundColor: brandColor }}
        >
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <p className="text-gray-600 text-sm">{message}</p>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
