"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { studentService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import * as XLSX from 'xlsx';

const AddStudentModal = ({ isOpen, onClose, onSubmit }) => {
  const commonInputClasses =
    "w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-[#525252] placeholder-[#B0B0B0]";

  const [activeTab, setActiveTab] = useState("manual");
  const [formData, setFormData] = useState({
    name: "",
    matricNumber: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    admissionYear: "",
    graduationYear: "",
    programOfStudy: "",
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);

  // Assuming 'user' and 'selectedSchoolId' are available in the component's scope
  // For example, from a context or props. Replace with actual implementation.
  const { user } = useAuth();
  const selectedSchoolId = "some-school-id"; // Replace with actual logic to get selected school ID

  const getBrandColor = () => user?.school?.brandColor || '#04BF68';
  const brandColor = getBrandColor();

  const handleFocus = (e) => {
    try {
      e.target.style.borderColor = brandColor;
      e.target.style.boxShadow = `0 0 0 3px ${brandColor}33`;
    } catch (err) {}
  };

  const handleBlur = (e) => {
    try {
      e.target.style.borderColor = '';
      e.target.style.boxShadow = '';
    } catch (err) {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      matricNumber: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      admissionYear: "",
      graduationYear: "",
      programOfStudy: "",
    });
    setUploadFile(null);
    setUploadProgress(0);
    setUploadErrors([]);
    setIsUploading(false);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      matricNumber: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      admissionYear: "",
      graduationYear: "",
      programOfStudy: "",
    });
    setActiveTab("manual");
    setUploadFile(null);
    setUploadProgress(0);
    setUploadErrors([]);
    setIsUploading(false);
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    clearForm();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['xlsx', 'xls', 'csv'];

    if (!validExtensions.includes(fileExtension)) {
      toast.error('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
      return;
    }

    setUploadFile(file);
    setUploadProgress(0);
    setUploadErrors([]);
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadErrors([]);

    try {
      // Get school_id from user or selected school
      const schoolId = user?.school_id || selectedSchoolId;

      if (!schoolId) {
        toast.error('School selection is required');
        setIsUploading(false);
        return;
      }

      // Simulate progress for upload
      setUploadProgress(30);

      // Create FormData and append the actual file
      const formData = new FormData();
      formData.append('school_id', schoolId);
      formData.append('file', uploadFile);

      // Call the bulk upload API
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/students/bulk-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      setUploadProgress(80);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, read as text for debugging
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an invalid response. Please try again.');
      }

      setUploadProgress(100);

      if (response.ok && result.status) {
        const { summary, failures } = result.data;

        if (summary.successful > 0) {
          toast.success(
            `Successfully uploaded ${summary.successful} student(s)!${
              summary.failed > 0 ? ` ${summary.failed} failed.` : ''
            }`
          );
        }

        if (failures && failures.length > 0) {
          setUploadErrors(failures);
          // toast.error(`${failures.length} error(s) occurred during upload. Check details below.`);
          toast.error(failures);
        }

        // If all successful, close modal and refresh
        if (summary.failed === 0 && failures.length === 0) {
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1500);
        }
      } else {
        // Handle API errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat();
          toast.error(errorMessages[0] || 'Upload failed');
        } else {
          toast.error(result.message || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred while processing the file');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-1000">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={handleClose}
      ></div>

      {/* MODAL */}
      <div className="bg-white rounded-xl w-[800px] max-h-[90vh] overflow-y-auto relative z-1001 shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-tms-text">
              Add Student Records
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex border-b mb-6">
            <button
              className={`px-6 py-2 font-medium ${
                activeTab === "manual" ? "text-tms-text" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("manual")}
              style={activeTab === 'manual' ? { borderBottom: `2px solid ${brandColor}` } : {}}
            >
              Manually
            </button>
            <button
              className={`px-6 py-2 font-medium ${
                activeTab === "upload" ? "text-tms-text" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("upload")}
              style={activeTab === 'upload' ? { borderBottom: `2px solid ${brandColor}` } : {}}
            >
              Upload Excel
            </button>
          </div>

          {activeTab === "manual" && (
            <form
              onSubmit={handleManualSubmit}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-tms-text mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={commonInputClasses}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tms-text placeholder-gray-400 mb-1">
                  Matric Number *
                </label>
                <input
                  type="text"
                  name="matricNumber"
                  required
                  value={formData.matricNumber}
                  onChange={handleInputChange}
                  placeholder="Enter matric number"
                  className={commonInputClasses}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tms-text mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={commonInputClasses}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tms-text mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className={commonInputClasses}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tms-text mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={commonInputClasses}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label className="block text-sm font-medium tms-text mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  required
                  className={commonInputClasses}
                  value={formData.gender}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tms-text mb-1">
                  Admission Year *
                </label>
                <select
                  name="admissionYear"
                  required
                  value={formData.admissionYear}
                  onChange={handleInputChange}
                  className={commonInputClasses}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="">Select Year</option>
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year} className="text-gray-900">
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tms-text mb-1">
                  Graduation Year *
                </label>
                <select
                  name="graduationYear"
                  required
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className={commonInputClasses}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option value="">Select Year</option>
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() + i
                  ).map((year) => (
                    <option key={year} value={year} className="text-gray-900">
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-tms-text mb-1">
                  Program of Study *
                </label>
                <input
                  type="text"
                  required
                  name="programOfStudy"
                  placeholder="Enter Course of Study"
                  value={formData.programOfStudy}
                  onChange={handleInputChange}
                  className={commonInputClasses}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div className="col-span-2 flex justify-center gap-4 mt-4">
                <Button
                  type="submit"
                  width="25%"
                  height="40px"
                  className="hover:opacity-90 text-white rounded-lg py-2.5"
                  style={{ backgroundColor: brandColor }}
                >
                  Add Student Record
                </Button>
              </div>
            </form>
          )}

          {activeTab === "upload" && (
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center" style={{ borderColor: `${brandColor}50` }}>
                {!uploadFile ? (
                  <>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="csvUpload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="csvUpload"
                      className={`${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex flex-col items-center`}
                    >
                      <div className="mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Drag and drop your Excel file here
                      </p>
                      <p className="text-gray-400 text-sm">
                        or click to browse (.xlsx, .xls, .csv)
                      </p>
                    </label>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {uploadFile.name}
                      </span>
                      {uploadProgress > 0 && (
                        <span className="text-sm text-gray-600">
                          {uploadProgress}%
                        </span>
                      )}
                    </div>
                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%`, backgroundColor: brandColor }}
                        ></div>
                      </div>
                    )}
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={handleFileUpload}
                        disabled={isUploading}
                        width="50%"
                        height="40px"
                        className="text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg py-2"
                        style={{ backgroundColor: brandColor }}
                      >
                        {isUploading ? 'Uploading...' : 'Upload File'}
                      </Button>
                      <button
                        onClick={() => {
                          setUploadFile(null);
                          setUploadProgress(0);
                          setUploadErrors([]);
                        }}
                        disabled={isUploading}
                          className="w-1/2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ borderColor: brandColor }}
                      >
                        Cancel
                      </button>
                    </div>
                    {uploadProgress === 100 && !isUploading && (
                      <button
                        onClick={() => {
                          setUploadFile(null);
                          setUploadProgress(0);
                          setUploadErrors([]);
                        }}
                        className="text-sm hover:underline mt-2"
                        style={{ color: brandColor }}
                      >
                        Upload another file
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Display upload errors */}
              {uploadErrors.length > 0 && (
                <div className="w-full mt-4 max-h-60 overflow-y-auto">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-red-800 mb-2">
                      Upload Errors ({uploadErrors.length})
                    </h3>
                    <ul className="text-xs text-red-700 space-y-1">
                      {uploadErrors.map((error, index) => (
                        <li key={index} className="list-disc list-inside">
                          {Array.isArray(error) ? error.join(', ') : error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;

