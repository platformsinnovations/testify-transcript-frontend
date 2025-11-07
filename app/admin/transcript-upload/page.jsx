"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  Loader2,
  Clock,
  File,
  X,
  GraduationCap,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const TranscriptUpload = () => {
  const { user } = useAuth();
  const yearDropdownRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [expiresIn, setExpiresIn] = useState("3600");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedPath, setUploadedPath] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [yearSearchOpen, setYearSearchOpen] = useState(false);
  const [yearSearchInput, setYearSearchInput] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // YEAR CONFIGURATION 
  const YEAR_START = 2000;
  const YEAR_END = new Date().getFullYear();

  // Generate years array from YEAR_START to YEAR_END (descending order)
  const getAvailableYears = () => {
    const years = [];
    for (let year = YEAR_END; year >= YEAR_START; year--) {
      years.push(year);
    }
    return years;
  };

  const availableYears = getAvailableYears();

  // FILTER YEARS BASED ON SEARCH INPUT
  const getFilteredYears = () => {
    if (!yearSearchInput) return availableYears;
    return availableYears.filter((year) =>
      year.toString().includes(yearSearchInput)
    );
  };

  const filteredYears = getFilteredYears();

  // CLOSE YEAR DROPDOWN ON SELECTION
  const handleYearSelect = (year) => {
    setGraduationYear(year);
    setYearSearchOpen(false);
    setYearSearchInput("");
  };

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setYearSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // HIDE SUCCESS MESSAGE AFTER 5 SECONDS
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const getBrandColor = () => {
    return user?.school?.brandColor || "#04BF68"; // DEFAULT COLOR
  };

  const brandColor = getBrandColor();

  const estimateUploadTime = (fileSizeMB, uploadSpeedMbps = 0.384) => {
    if (!fileSizeMB) return "";
    const timeSeconds = (fileSizeMB * 8) / uploadSpeedMbps + 60;
    const minutes = Math.floor(timeSeconds / 60);
    const seconds = Math.round(timeSeconds % 60);
    return `${minutes} min ${seconds} sec`;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/zip",
        "application/x-zip-compressed",
      ];
      const allowedExts = [".pdf", ".zip"];
      const name = (selectedFile.name || "").toLowerCase();
      const hasAllowedExt = allowedExts.some((ext) => name.endsWith(ext));
      
      if (!allowedTypes.includes(selectedFile.type) && !hasAllowedExt) {
        alert("Please select a PDF or ZIP file");
        return;
      }

      const maxSize = 15 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast.error("File size must be less than 15MB");
        return;
      }

      setFile(selectedFile);
      setFilename(selectedFile.name);
      const sizeMB = selectedFile.size / 1024 / 1024;
      setEstimatedTime(estimateUploadTime(sizeMB, 0.384));
      setUploadStatus(null);
      setErrorMessage("");
      
      // TOAST NOTIFICATION FOR FILE SELECTION
      toast.success(`File selected: ${selectedFile.name}`, {
        duration: 2500,
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    if (!filename.trim()) {
      toast.error("Please enter a filename");
      return;
    }

    if (!graduationYear) {
      toast.error("Please enter a graduation year");
      return;
    }

    const year = parseInt(graduationYear);
    if (isNaN(year) || year < 1900 || year > 2100) {
      toast.error("Please enter a valid graduation year");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    setErrorMessage("");

    try {
      setUploadProgress(10);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/uploads/presign`;
      const contentTypeToSend =
        file.type ||
        (filename.toLowerCase().endsWith(".zip")
          ? "application/zip"
          : "application/pdf");
      
      const requestBody = {
        filename: filename,
        content_type: contentTypeToSend,
        graduation_year: year,
        expires_in: expiresIn,
      };

      console.log("Making request to:", apiUrl);
      console.log("Request body:", requestBody);

      // GET TOKEN FROM COOKIES, SESSION STORAGE, OR LOCAL STORAGE
      const getCookieToken = () => {
        const nameEQ = "token=";
        const cookies = document.cookie.split(";");
        for (let c of cookies) {
          c = c.trim();
          if (c.startsWith(nameEQ)) {
            return decodeURIComponent(c.slice(nameEQ.length));
          }
        }
        return null;
      };

      const token =
        getCookieToken() ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      console.log("Token found:", !!token);
      
      const requestHeaders = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      console.log("Request headers:", { 
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token.substring(0, 20)}...` : "None"
      });
      
      const presignResponse = await fetch(apiUrl, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", presignResponse.status);

      if (!presignResponse.ok) {
        const errorText = await presignResponse.text();
        console.log("Error response:", errorText);
        throw new Error(
          `API Error: ${presignResponse.status} - ${
            errorText || "Failed to get presigned URL"
          }`
        );
      }

      const presignData = await presignResponse.json();
      console.log("Presign response data:", presignData);

      if (!presignData.status || !presignData.data?.url) {
        throw new Error(presignData.message || "Invalid response from server");
      }

      setUploadProgress(30);

      const { url, headers } = presignData.data;
      console.log("PRESIGNED URL:", url);

      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": headers["Content-Type"],
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
      }

      setUploadProgress(100);
      setUploadStatus("success");
      setUploadedPath(presignData.data.path);
      setShowSuccessMessage(true);

      // TOAST NOTIFICATION FOR SUCCESSFUL UPLOAD
      toast.success(`Transcript uploaded successfully! ✨\nFile: ${filename}`, {
        duration: 4000,
      });

      setTimeout(() => {
        setFile(null);
        setFilename("");
        setGraduationYear("");
        setUploadProgress(0);
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");

      let errorMsg = "Upload failed. Please try again.";

      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        errorMsg = "Network error: Cannot connect to the API.";
      } else if (error.message.includes("API Error:")) {
        errorMsg = error.message;
      } else {
        errorMsg = error.message || "Upload failed. Please try again.";
      }

      setErrorMessage(errorMsg);

      // TOAST NOTIFICATION FOR UPLOAD ERROR
      toast.error(errorMsg, {
        duration: 4000,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Upload Transcript
          </h1>
          <p className="text-base text-gray-500">
            Upload student transcripts to the system
          </p>
        </div>

        {!isModalOpen && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div
              className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full cursor-pointer"
              style={{ backgroundColor: `${brandColor}20` }}
            >
              <Upload
                className="w-8 h-8"
                style={{ color: brandColor }}
                onClick={() => setIsModalOpen(true)}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Upload?
            </h2>
            <p className="text-gray-600 text-center mb-6 max-w-sm">
              Upload student transcripts as PDF files to the database
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{ backgroundColor: brandColor }}
              className="text-white hover:opacity-90 rounded-lg px-6 py-3 font-semibold flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Click To Upload Transcript(s)
            </button>
          </div>
        )}

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => {
              setIsModalOpen(false);
              setFile(null);
              setFilename("");
              setGraduationYear("");
              setErrorMessage("");
              setUploadProgress(0);
            }}
          >
            <div
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ backgroundColor: `${brandColor}20` }}
                  >
                    <Upload className="w-5 h-5" style={{ color: brandColor }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Upload Transcript
                    </h2>
                    <p className="text-xs text-gray-500">
                      Upload PDF or ZIP to the database
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setFile(null);
                    setFilename("");
                    setGraduationYear("");
                    setErrorMessage("");
                    setUploadProgress(0);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div
                  className="p-6 text-center transition-all duration-300 border-2 border-dashed cursor-pointer rounded-xl"
                  style={{
                    borderColor: `${brandColor}50`,
                    backgroundColor: `${brandColor}08`,
                  }}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {!file ? (
                    <div>
                      <Upload
                        className="w-10 h-10 mx-auto mb-2"
                        style={{ color: `${brandColor}99` }}
                      />
                      <p className="mb-1 text-sm font-medium text-gray-700">
                        Drag & drop or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF or ZIP • Max 15MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${brandColor}20` }}
                      >
                        <FileText
                          className="w-8 h-8"
                          style={{ color: brandColor }}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                          <br />
                          Est. Upload Time:{" "}
                          {estimateUploadTime(file.size / 1024 / 1024, 0.384)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.zip,application/pdf,application/zip"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div>
                      <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
                        <GraduationCap className="w-3 h-3" />
                        Graduation Year <span className="text-red-500">*</span>
                      </label>
                      <div className="relative" ref={yearDropdownRef}>
                        {/* SEARCHABLE DROPDOWN BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            setYearSearchOpen(!yearSearchOpen);
                            setYearSearchInput("");
                          }}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#04BF68] focus:ring-2 focus:ring-[#04BF68]/20 text-left flex items-center justify-between"
                        >
                          <span>{graduationYear || "Select a year"}</span>
                          <span className="text-gray-400">▼</span>
                        </button>

                        {/* DROPDOWN MENU */}
                        {yearSearchOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xs shadow-lg z-50 max-h-64 flex flex-col">
                            {/* SEARCH INPUT */}
                            <input
                              type="text"
                              placeholder="Search year..."
                              value={yearSearchInput}
                              onChange={(e) => setYearSearchInput(e.target.value)}
                              className="px-3 py-2 text-sm border-b border-gray-200 outline-none focus:border-tms-lightGreen sticky top-0 bg-white"
                              autoFocus
                            />

                            {/* YEARS LIST */}
                            <div className="overflow-y-auto">
                              {filteredYears.length > 0 ? (
                                filteredYears.map((year) => (
                                  <button
                                    key={year}
                                    type="button"
                                    onClick={() => handleYearSelect(year)}
                                    className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                                      graduationYear === year
                                        ? "bg-tms-lightGreen/20 text-gray-900 font-semibold"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    {year}
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                  No years found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                {/* <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
                        <File className="w-3 h-3" />
                        Filename
                      </label>
                      <input
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder="filename.extension"
                        readOnly
                        className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 placeholder-gray-400 transition-all border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
                        File Type
                      </label>
                      <input
                        type="text"
                        value={
                          file
                            ? (file.name.split(".").pop() || "").toUpperCase()
                            : "PDF / ZIP"
                        }
                        readOnly
                        className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
                        <GraduationCap className="w-3 h-3" />
                        Graduation Year <span className="text-red-500">*</span>
                      </label>
                      <div className="relative" ref={yearDropdownRef}>
                     
                        <button
                          type="button"
                          onClick={() => {
                            setYearSearchOpen(!yearSearchOpen);
                            setYearSearchInput("");
                          }}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg outline-none focus:border-[#04BF68] focus:ring-2 focus:ring-[#04BF68]/20 text-left flex items-center justify-between"
                        >
                          <span>{graduationYear || "Select a year"}</span>
                          <span className="text-gray-400">▼</span>
                        </button>

                      
                        {yearSearchOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 flex flex-col">
                       
                            <input
                              type="text"
                              placeholder="Search year..."
                              value={yearSearchInput}
                              onChange={(e) => setYearSearchInput(e.target.value)}
                              className="px-3 py-2 text-sm border-b border-gray-200 outline-none focus:border-[#04BF68] sticky top-0 bg-white"
                              autoFocus
                            />

                       
                            <div className="overflow-y-auto">
                              {filteredYears.length > 0 ? (
                                filteredYears.map((year) => (
                                  <button
                                    key={year}
                                    type="button"
                                    onClick={() => handleYearSelect(year)}
                                    className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                                      graduationYear === year
                                        ? "bg-[#04BF68]/20 text-gray-900 font-semibold"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    {year}
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                  No years found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
                        <Clock className="w-3 h-3" />
                        Expires (sec)
                      </label>
                      <input
                        type="number"
                        value={expiresIn}
                        onChange={(e) => setExpiresIn(e.target.value)}
                        placeholder="3600"
                        min="60"
                        max="604800"
                        className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-all border border-gray-300 rounded-lg outline-none focus:border-[#04BF68] focus:ring-2 focus:ring-[#04BF68]/20"
                      />
                    </div>
                  </div>
                </div> */}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Uploading...</span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: brandColor }}
                      >
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${uploadProgress}%`,
                          backgroundColor: brandColor,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                {showSuccessMessage && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-semibold">
                      ✓ Upload successful!
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Path: {uploadedPath}
                    </p>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setFile(null);
                    setFilename("");
                    setGraduationYear("");
                    setErrorMessage("");
                    setUploadProgress(0);
                    toast.success("File selected successfully!");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading || !filename.trim() || !graduationYear}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 text-white ${
                    !file || uploading || !filename.trim() || !graduationYear
                      ? "cursor-not-allowed opacity-50"
                      : "shadow-lg hover:shadow-xl hover:opacity-90"
                  }`}
                  style={{
                    backgroundColor:
                      !file || uploading || !filename.trim() || !graduationYear
                        ? "#d1d5db"
                        : brandColor,
                  }}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptUpload;



























// WORKING VERSION
// "use client";

// import { useState } from "react";
// import {
//   Upload,
//   FileText,
//   Loader2,
//   Clock,
//   File,
//   X,
//   GraduationCap,
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { useAuth } from "@/contexts/AuthContext";

// const TranscriptUpload = () => {
//   const { user } = useAuth();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [file, setFile] = useState(null);
//   const [filename, setFilename] = useState("");
//   const [graduationYear, setGraduationYear] = useState("");
//   const [expiresIn, setExpiresIn] = useState("3600");
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [uploadedPath, setUploadedPath] = useState("");
//   const [estimatedTime, setEstimatedTime] = useState("");

//   // GET BRAND COLOR FROM USER'S SCHOOL OR USE DEFAULT
//   const getBrandColor = () => {
//     return user?.school?.brandColor || "#04BF68"; // Default color
//   };

//   const brandColor = getBrandColor();

//   const estimateUploadTime = (fileSizeMB, uploadSpeedMbps = 0.384) => {
//     if (!fileSizeMB) return "";
//     const timeSeconds = (fileSizeMB * 8) / uploadSpeedMbps + 60;
//     const minutes = Math.floor(timeSeconds / 60);
//     const seconds = Math.round(timeSeconds % 60);
//     return `${minutes} min ${seconds} sec`;
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];

//     if (selectedFile) {
//       const allowedTypes = [
//         "application/pdf",
//         "application/zip",
//         "application/x-zip-compressed",
//       ];
//       const allowedExts = [".pdf", ".zip"];
//       const name = (selectedFile.name || "").toLowerCase();
//       const hasAllowedExt = allowedExts.some((ext) => name.endsWith(ext));
      
//       if (!allowedTypes.includes(selectedFile.type) && !hasAllowedExt) {
//         alert("Please select a PDF or ZIP file");
//         return;
//       }

//       const maxSize = 15 * 1024 * 1024;
//       if (selectedFile.size > maxSize) {
//         alert("File size must be less than 15MB");
//         return;
//       }

//       setFile(selectedFile);
//       setFilename(selectedFile.name);
//       const sizeMB = selectedFile.size / 1024 / 1024;
//       setEstimatedTime(estimateUploadTime(sizeMB, 0.384));
//       setUploadStatus(null);
//       setErrorMessage("");
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file first");
//       return;
//     }

//     if (!filename.trim()) {
//       alert("Please enter a filename");
//       return;
//     }

//     if (!graduationYear) {
//       alert("Please enter a graduation year");
//       return;
//     }

//     const year = parseInt(graduationYear);
//     if (isNaN(year) || year < 1900 || year > 2100) {
//       alert("Please enter a valid graduation year");
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(0);
//     setUploadStatus(null);
//     setErrorMessage("");

//     try {
//       setUploadProgress(10);

//       const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/uploads/presign`;
//       const contentTypeToSend =
//         file.type ||
//         (filename.toLowerCase().endsWith(".zip")
//           ? "application/zip"
//           : "application/pdf");
      
//       const requestBody = {
//         filename: filename,
//         content_type: contentTypeToSend,
//         graduation_year: year,
//         expires_in: expiresIn,
//       };

//       console.log("Making request to:", apiUrl);
//       console.log("Request body:", requestBody);

//       // Get token from cookies first (session), then fall back to storage
//       const getCookieToken = () => {
//         const nameEQ = "token=";
//         const cookies = document.cookie.split(";");
//         for (let c of cookies) {
//           c = c.trim();
//           if (c.startsWith(nameEQ)) {
//             return decodeURIComponent(c.slice(nameEQ.length));
//           }
//         }
//         return null;
//       };

//       const token =
//         getCookieToken() ||
//         sessionStorage.getItem("token") ||
//         localStorage.getItem("token");

//       console.log("Token found:", !!token);
      
//       const requestHeaders = {
//         "Content-Type": "application/json",
//         ...(token && { Authorization: `Bearer ${token}` }),
//       };

//       console.log("Request headers:", { 
//         "Content-Type": "application/json",
//         "Authorization": token ? `Bearer ${token.substring(0, 20)}...` : "None"
//       });
      
//       const presignResponse = await fetch(apiUrl, {
//         method: "POST",
//         headers: requestHeaders,
//         body: JSON.stringify(requestBody),
//       });

//       console.log("Response status:", presignResponse.status);

//       if (!presignResponse.ok) {
//         const errorText = await presignResponse.text();
//         console.log("Error response:", errorText);
//         throw new Error(
//           `API Error: ${presignResponse.status} - ${
//             errorText || "Failed to get presigned URL"
//           }`
//         );
//       }

//       const presignData = await presignResponse.json();
//       console.log("Presign response data:", presignData);

//       if (!presignData.status || !presignData.data?.url) {
//         throw new Error(presignData.message || "Invalid response from server");
//       }

//       setUploadProgress(30);

//       const { url, headers } = presignData.data;
//       console.log("PRESIGNED URL:", url);

//       const uploadResponse = await fetch(url, {
//         method: "PUT",
//         headers: {
//           "Content-Type": headers["Content-Type"],
//         },
//         body: file,
//       });

//       if (!uploadResponse.ok) {
//         throw new Error("Failed to upload file to S3");
//       }

//       setUploadProgress(100);
//       setUploadStatus("success");
//       setUploadedPath(presignData.data.path);

//       setTimeout(() => {
//         setFile(null);
//         setFilename("");
//         setGraduationYear("");
//         setUploadProgress(0);
//       }, 3000);
//     } catch (error) {
//       console.error("Upload error:", error);
//       setUploadStatus("error");

//       let errorMsg = "Upload failed. Please try again.";

//       if (
//         error.name === "TypeError" &&
//         error.message.includes("Failed to fetch")
//       ) {
//         errorMsg = "Network error: Cannot connect to the API.";
//       } else if (error.message.includes("API Error:")) {
//         errorMsg = error.message;
//       } else {
//         errorMsg = error.message || "Upload failed. Please try again.";
//       }

//       setErrorMessage(errorMsg);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-gray-50 p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-1">
//             Upload Transcript
//           </h1>
//           <p className="text-base text-gray-500">
//             Upload student transcripts to the system
//           </p>
//         </div>

//         {!isModalOpen && (
//           <div className="flex flex-col items-center justify-center py-16 px-4">
//             <div
//               className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full cursor-pointer"
//               style={{ backgroundColor: `${brandColor}20` }}
//             >
//               <Upload
//                 className="w-8 h-8"
//                 style={{ color: brandColor }}
//                 onClick={() => setIsModalOpen(true)}
//               />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Ready to Upload?
//             </h2>
//             <p className="text-gray-600 text-center mb-6 max-w-sm">
//               Upload student transcripts as PDF files to the database
//             </p>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               style={{ backgroundColor: brandColor }}
//               className="text-white hover:opacity-90 rounded-lg px-6 py-3 font-semibold flex items-center gap-2"
//             >
//               <Upload className="w-4 h-4" />
//               Click To Upload Transcript(s)
//             </button>
//           </div>
//         )}

//         {isModalOpen && (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
//             onClick={() => {
//               setIsModalOpen(false);
//               setFile(null);
//               setFilename("");
//               setGraduationYear("");
//               setErrorMessage("");
//               setUploadProgress(0);
//             }}
//           >
//             <div
//               className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
//                 <div className="flex items-center gap-3">
//                   <div
//                     className="inline-flex items-center justify-center w-10 h-10 rounded-full"
//                     style={{ backgroundColor: `${brandColor}20` }}
//                   >
//                     <Upload className="w-5 h-5" style={{ color: brandColor }} />
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-gray-900">
//                       Upload Transcript
//                     </h2>
//                     <p className="text-xs text-gray-500">
//                       Upload PDF or ZIP to the database
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     setFile(null);
//                     setFilename("");
//                     setGraduationYear("");
//                     setErrorMessage("");
//                     setUploadProgress(0);
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div
//                   className="p-6 text-center transition-all duration-300 border-2 border-dashed cursor-pointer rounded-xl"
//                   style={{
//                     borderColor: `${brandColor}50`,
//                     backgroundColor: `${brandColor}08`,
//                   }}
//                   onClick={() => document.getElementById("fileInput").click()}
//                 >
//                   {!file ? (
//                     <div>
//                       <Upload
//                         className="w-10 h-10 mx-auto mb-2"
//                         style={{ color: `${brandColor}99` }}
//                       />
//                       <p className="mb-1 text-sm font-medium text-gray-700">
//                         Drag & drop or click to browse
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         PDF or ZIP • Max 15MB
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-3">
//                       <div
//                         className="p-2 rounded-lg"
//                         style={{ backgroundColor: `${brandColor}20` }}
//                       >
//                         <FileText
//                           className="w-8 h-8"
//                           style={{ color: brandColor }}
//                         />
//                       </div>
//                       <div className="flex-1 text-left">
//                         <p className="text-sm font-semibold text-gray-900 truncate">
//                           {file.name}
//                         </p>
//                         <p className="text-xs text-gray-600">
//                           {(file.size / 1024 / 1024).toFixed(2)} MB
//                           <br />
//                           Est. Upload Time:{" "}
//                           {estimateUploadTime(file.size / 1024 / 1024, 0.384)}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <input
//                   id="fileInput"
//                   type="file"
//                   accept=".pdf,.zip,application/pdf,application/zip"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />

//                 <div className="space-y-3">
//                   <div className="grid grid-cols-2 gap-3">
//                     {/* <div>
//                       <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
//                         <File className="w-3 h-3" />
//                         Filename
//                       </label>
//                       <input
//                         type="text"
//                         value={filename}
//                         onChange={(e) => setFilename(e.target.value)}
//                         placeholder="filename.extension"
//                         readOnly
//                         className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 placeholder-gray-400 transition-all border border-gray-300 rounded-lg outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
//                         File Type
//                       </label>
//                       <input
//                         type="text"
//                         value={
//                           file
//                             ? (file.name.split(".").pop() || "").toUpperCase()
//                             : "PDF / ZIP"
//                         }
//                         readOnly
//                         className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
//                       />
//                     </div> */}
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
//                         <GraduationCap className="w-3 h-3" />
//                         Graduation Year <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="number"
//                         value={graduationYear}
//                         onChange={(e) => setGraduationYear(e.target.value)}
//                         placeholder="e.g., 2025"
//                         min="1900"
//                         max="2100"
//                         className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-all border border-gray-300 rounded-lg outline-none focus:border-[#04BF68] focus:ring-2 focus:ring-[#04BF68]/20"
//                       />
//                     </div>
//                     {/* <div>
//                       <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
//                         <Clock className="w-3 h-3" />
//                         Expires (sec)
//                       </label>
//                       <input
//                         type="number"
//                         value={expiresIn}
//                         onChange={(e) => setExpiresIn(e.target.value)}
//                         placeholder="3600"
//                         min="60"
//                         max="604800"
//                         className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-all border border-gray-300 rounded-lg outline-none focus:border-[#04BF68] focus:ring-2 focus:ring-[#04BF68]/20"
//                       />
//                     </div> */}
//                   </div>
//                 </div>

//                 {uploadProgress > 0 && uploadProgress < 100 && (
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600">Uploading...</span>
//                       <span
//                         className="text-sm font-semibold"
//                         style={{ color: brandColor }}
//                       >
//                         {uploadProgress}%
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="h-2 rounded-full transition-all duration-300"
//                         style={{
//                           width: `${uploadProgress}%`,
//                           backgroundColor: brandColor,
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}

//                 {errorMessage && (
//                   <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                     <p className="text-sm text-red-700">{errorMessage}</p>
//                   </div>
//                 )}

//                 {uploadStatus === "success" && (
//                   <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                     <p className="text-sm text-green-700 font-semibold">
//                       ✓ Upload successful!
//                     </p>
//                     <p className="text-xs text-green-600 mt-1">
//                       Path: {uploadedPath}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
//                 <button
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     setFile(null);
//                     setFilename("");
//                     setGraduationYear("");
//                     setErrorMessage("");
//                     setUploadProgress(0);
//                   }}
//                   className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleUpload}
//                   disabled={!file || uploading || !filename.trim() || !graduationYear}
//                   className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 text-white ${
//                     !file || uploading || !filename.trim() || !graduationYear
//                       ? "cursor-not-allowed opacity-50"
//                       : "shadow-lg hover:shadow-xl hover:opacity-90"
//                   }`}
//                   style={{
//                     backgroundColor:
//                       !file || uploading || !filename.trim() || !graduationYear
//                         ? "#d1d5db"
//                         : brandColor,
//                   }}
//                 >
//                   {uploading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Uploading...
//                     </>
//                   ) : (
//                     <>
//                       <Upload className="w-4 h-4" />
//                       Upload
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TranscriptUpload;


























































// // "use client";

// // import { useState } from "react";
// // import {
// //   Upload,
// //   FileText,
// //   Loader2,
// //   FolderOpen,
// //   Clock,
// //   File,
// //   X,
// // } from "lucide-react";
// // import toast, { Toaster } from "react-hot-toast";
// // import Button from "@/components/ui/Button";
// // import { useAuth } from "@/contexts/AuthContext";

// // const TranscriptUpload = () => {
// //   const { user } = useAuth();
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [file, setFile] = useState(null);
// //   const [filename, setFilename] = useState("");
// //   const [folder, setFolder] = useState("");
// //   const [expiresIn, setExpiresIn] = useState("2000");
// //   const [uploading, setUploading] = useState(false);
// //   const [uploadProgress, setUploadProgress] = useState(0);
// //   const [uploadStatus, setUploadStatus] = useState(null);
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const [uploadedPath, setUploadedPath] = useState("");
// //   const [estimatedTime, setEstimatedTime] = useState("");

// //   // ESTIMATE UPLOAD TIME BASED ON FILE SIZE AND AVERAGE UPLOAD SPEED
// //   const estimateUploadTime = (fileSizeMB, uploadSpeedMbps = 0.384) => {
// //     if (!fileSizeMB) return "";
// //     // CALCULATE TIME IN SECONDS
// //     const timeSeconds = (fileSizeMB * 8) / uploadSpeedMbps + 60; // +60s
// //     const minutes = Math.floor(timeSeconds / 60);
// //     const seconds = Math.round(timeSeconds % 60);
// //     return `${minutes} min ${seconds} sec`;
// //   };

// //   // GET BRAND COLOR FROM USER'S SCHOOL OR USE DEFAULT
// //   const getBrandColor = () => {
// //     return user?.school?.brandColor || "#04BF68"; // Default color
// //   };

// //   const brandColor = getBrandColor();

// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files[0];

// //     if (selectedFile) {
// //       // ALLOW ZIPPED FILES (+ extensions slightly different mime-types)
// //       const allowedTypes = [
// //         "application/pdf",
// //         "application/zip",
// //         "application/x-zip-compressed",
// //       ];
// //       const allowedExts = [".pdf", ".zip"];
// //       const name = (selectedFile.name || "").toLowerCase();
// //       const hasAllowedExt = allowedExts.some((ext) => name.endsWith(ext));
// //       if (!allowedTypes.includes(selectedFile.type) && !hasAllowedExt) {
// //         toast.error("Please select a PDF or ZIP file");
// //         return;
// //       }

// //       const maxSize = 15 * 1024 * 1024;
// //       if (selectedFile.size > maxSize) {
// //         toast.error("File size must be less than 15MB");
// //         return;
// //       }

// //       setFile(selectedFile);
// //       setFilename(selectedFile.name);
// //       // CALCULATE ESTIMATED UPLOAD TIME
// //       const sizeMB = selectedFile.size / 1024 / 1024;
// //       setEstimatedTime(estimateUploadTime(sizeMB, 0.384));
// //       setUploadStatus(null);
// //       setErrorMessage("");
// //       toast.success("File selected successfully!");
// //     }
// //   };

// //   const handleUpload = async () => {
// //     if (!file) {
// //       toast.error("Please select a file first");
// //       return;
// //     }

// //     if (!filename.trim()) {
// //       toast.error("Please enter a filename");
// //       return;
// //     }

// //     setUploading(true);
// //     setUploadProgress(0);
// //     setUploadStatus(null);
// //     setErrorMessage("");

// //     const loadingToast = toast.loading("Getting presigned URL...");

// //     try {
// //       setUploadProgress(10);

// //       const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/presign`;
// //       const contentTypeToSend =
// //         file.type ||
// //         (filename.toLowerCase().endsWith(".zip")
// //           ? "application/zip"
// //           : "application/pdf");
// //       const requestBody = {
// //         filename: filename,
// //         content_type: contentTypeToSend,
// //         folder: folder,
// //         expires_in: expiresIn,
// //       };

// //       console.log("Making request to:", apiUrl);
// //       console.log("Request body:", requestBody);

// //       const token =
// //         sessionStorage.getItem("token") || localStorage.getItem("token");
// //       const presignResponse = await fetch(apiUrl, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           ...(token && { Authorization: `Bearer ${token}` }),
// //         },
// //         body: JSON.stringify(requestBody),
// //       });

// //       console.log("Response status:", presignResponse.status);

// //       if (!presignResponse.ok) {
// //         const errorText = await presignResponse.text();
// //         console.log("Error response:", errorText);
// //         throw new Error(
// //           `API Error: ${presignResponse.status} - ${
// //             errorText || "Failed to get presigned URL"
// //           }`
// //         );
// //       }

// //       const presignData = await presignResponse.json();
// //       console.log("Presign response data:", presignData);

// //       if (!presignData.status || !presignData.data?.url) {
// //         throw new Error(presignData.message || "Invalid response from server");
// //       }

// //       setUploadProgress(30);
// //       toast.loading("Uploading file to S3...", { id: loadingToast });

// //       const { url, headers } = presignData.data;
// //       console.log("PRESIGNED URL:", url);

// //       const uploadResponse = await fetch(url, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": headers["Content-Type"],
// //         },
// //         body: file,
// //       });

// //       if (!uploadResponse.ok) {
// //         throw new Error("Failed to upload file to S3");
// //       }

// //       setUploadProgress(100);
// //       setUploadStatus("success");
// //       setUploadedPath(presignData.data.path);

// //       toast.success(
// //         `Transcript uploaded successfully!\nPath: ${presignData.data.path}`,
// //         {
// //           id: loadingToast,
// //           duration: 5000,
// //         }
// //       );

// //       setTimeout(() => {
// //         setFile(null);
// //         setFilename("");
// //         setUploadProgress(0);
// //       }, 3000);
// //     } catch (error) {
// //       console.error("Upload error:", error);
// //       setUploadStatus("error");

// //       let errorMessage = "Upload failed. Please try again.";

// //       if (
// //         error.name === "TypeError" &&
// //         error.message.includes("Failed to fetch")
// //       ) {
// //         errorMessage = "Network error: Cannot connect to the API.";
// //       } else if (error.message.includes("API Error:")) {
// //         errorMessage = error.message;
// //       } else {
// //         errorMessage = error.message || "Upload failed. Please try again.";
// //       }

// //       setErrorMessage(errorMessage);
// //       toast.error(errorMessage, { id: loadingToast });
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   const handleDragOver = (e) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //   };

// //   const handleDrop = (e) => {
// //     e.preventDefault();
// //     e.stopPropagation();

// //     const droppedFile = e.dataTransfer.files[0];
// //     if (droppedFile) {
// //       const fakeEvent = { target: { files: [droppedFile] } };
// //       handleFileChange(fakeEvent);
// //     }
// //   };

// //   return (
// //     <div className="w-full">
// //       <Toaster position="top-right" />

// //       {/* PAGE HEADER */}
// //       <div className="mb-6">
// //         <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
// //           Upload Transcript
// //         </h1>
// //         <p className="text-sm md:text-base text-gray-500">
// //           Upload student transcripts to the system
// //         </p>
// //       </div>

// //       {/* EMPTY STATE WITH UPLOAD BUTTON */}
// //       {!isModalOpen && (
// //         <div className="flex flex-col items-center justify-center py-16 px-4">
// //           <div
// //             className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full cursor-pointer"
// //             style={{ backgroundColor: `${brandColor}20` }}
// //           >
// //             <Upload
// //               className="w-8 h-8"
// //               style={{ color: brandColor }}
// //               onClick={() => setIsModalOpen(true)}
// //             />
// //           </div>
// //           <h2 className="text-2xl font-bold text-gray-900 mb-2">
// //             Ready to Upload?
// //           </h2>
// //           <p className="text-gray-600 text-center mb-6 max-w-sm">
// //             Upload student transcripts as PDF files to the database
// //           </p>
// //           <Button
// //             onClick={() => setIsModalOpen(true)}
// //             width="200px"
// //             height="48px"
// //             style={{ backgroundColor: brandColor }}
// //             className="text-white hover:opacity-90 rounded-lg px-3 py-2"
// //           >
// //             <span className="flex items-center justify-center gap-2">
// //               <Upload className="w-4 h-4" />
// //               Click To Upload Transcript(s)
// //             </span>
// //           </Button>
// //         </div>
// //       )}

// //       {/* UPLOAD MODAL */}
// //       {isModalOpen && (
// //         <div
// //           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
// //           onClick={() => {
// //             setIsModalOpen(false);
// //             setFile(null);
// //             setFilename("");
// //             setErrorMessage("");
// //             setUploadProgress(0);
// //           }}
// //         >
// //           <div
// //             className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             {/* MODAL HEADER */}
// //             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
// //               <div className="flex items-center gap-3">
// //                 <div
// //                   className="inline-flex items-center justify-center w-10 h-10 rounded-full"
// //                   style={{ backgroundColor: `${brandColor}20` }}
// //                 >
// //                   <Upload className="w-5 h-5" style={{ color: brandColor }} />
// //                 </div>
// //                 <div>
// //                   <h2 className="text-lg font-bold text-gray-900">
// //                     Upload Transcript
// //                   </h2>
// //                   <p className="text-xs text-gray-500">
// //                     Upload PDF or ZIP to the database
// //                   </p>
// //                 </div>
// //               </div>
// //               <button
// //                 onClick={() => {
// //                   setIsModalOpen(false);
// //                   setFile(null);
// //                   setFilename("");
// //                   setErrorMessage("");
// //                   setUploadProgress(0);
// //                 }}
// //                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// //               >
// //                 <X className="w-5 h-5 text-gray-500" />
// //               </button>
// //             </div>

// //             {/* MODAL CONTENT */}
// //             <div className="p-6 space-y-4">
// //               {/* FILE UPLOAD AREA */}
// //               <div
// //                 className="p-6 text-center transition-all duration-300 border-2 border-dashed cursor-pointer rounded-xl"
// //                 style={{
// //                   borderColor: `${brandColor}50`,
// //                   backgroundColor: `${brandColor}08`,
// //                 }}
// //                 onDragOver={(e) => {
// //                   e.preventDefault();
// //                   e.stopPropagation();
// //                 }}
// //                 onDrop={(e) => {
// //                   e.preventDefault();
// //                   e.stopPropagation();
// //                   const droppedFile = e.dataTransfer.files[0];
// //                   if (droppedFile) {
// //                     const fakeEvent = { target: { files: [droppedFile] } };
// //                     handleFileChange(fakeEvent);
// //                   }
// //                 }}
// //                 onClick={() => document.getElementById("fileInput").click()}
// //               >
// //                 {!file ? (
// //                   <div>
// //                     <Upload
// //                       className="w-10 h-10 mx-auto mb-2"
// //                       style={{ color: `${brandColor}99` }}
// //                     />
// //                     <p className="mb-1 text-sm font-medium text-gray-700">
// //                       Drag & drop or click to browse
// //                     </p>
// //                     <p className="text-xs text-gray-500">
// //                       PDF or ZIP • Max 15MB
// //                     </p>
// //                   </div>
// //                 ) : (
// //                   <div className="flex items-center gap-3">
// //                     <div
// //                       className="p-2 rounded-lg"
// //                       style={{ backgroundColor: `${brandColor}20` }}
// //                     >
// //                       <FileText
// //                         className="w-8 h-8"
// //                         style={{ color: brandColor }}
// //                       />
// //                     </div>
// //                     <div className="flex-1 text-left">
// //                       <p className="text-sm font-semibold text-gray-900 truncate">
// //                         {file.name}
// //                       </p>
// //                       {/* <p className="text-xs text-gray-600">
// //                         {(file.size / 1024 / 1024).toFixed(2)} MB
// //                       </p> */}

// //                       <p className="text-xs text-gray-600">
// //                         {(file.size / 1024 / 1024).toFixed(2)} MB
// //                         <br />
// //                         Est. Upload Time:{" "}
// //                         {estimateUploadTime(file.size / 1024 / 1024, 0.384)}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               <input
// //                 id="fileInput"
// //                 type="file"
// //                 accept=".pdf,.zip,application/pdf,application/zip"
// //                 onChange={handleFileChange}
// //                 className="hidden"
// //               />

// //               {/* FORM FIELDS */}
// //               <div className="space-y-3">
// //                 <div className="grid grid-cols-2 gap-3">
// //                   <div>
// //                     <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
// //                       <File className="w-3 h-3" />
// //                       Filename
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={filename}
// //                       onChange={(e) => setFilename(e.target.value)}
// //                       placeholder="filename.extension"
// //                       readOnly
// //                       className="w-full px-3 py-2 text-sm  text-gray-600 bg-gray-100 placeholder-gray-400 transition-all border border-gray-300 rounded-lg outline-none"
// //                       style={{
// //                         "--brand-color": brandColor,
// //                         "--focus-border": brandColor,
// //                         "--focus-ring": `${brandColor}20`,
// //                       }}
// //                       onFocus={(e) => {
// //                         e.target.style.borderColor = brandColor;
// //                         e.target.style.boxShadow = `0 0 0 2px ${brandColor}20`;
// //                       }}
// //                       onBlur={(e) => {
// //                         e.target.style.borderColor = "#d1d5db";
// //                         e.target.style.boxShadow = "none";
// //                       }}
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
// //                       File Type
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={
// //                         file
// //                           ? (file.name.split(".").pop() || "").toUpperCase()
// //                           : "PDF / ZIP"
// //                       }
// //                       readOnly
// //                       className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-3">
// //                   <div>
// //                     <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
// //                       <FolderOpen className="w-3 h-3" />
// //                       Folder <span className="text-gray-400">(Optional)</span>
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={folder}
// //                       onChange={(e) => setFolder(e.target.value)}
// //                       readOnly
// //                       placeholder="Folder Name"
// //                       className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 placeholder-gray-400 transition-all border border-gray-300 rounded-lg outline-none"
// //                       onFocus={(e) => {
// //                         e.target.style.borderColor = brandColor;
// //                         e.target.style.boxShadow = `0 0 0 2px ${brandColor}20`;
// //                       }}
// //                       onBlur={(e) => {
// //                         e.target.style.borderColor = "#d1d5db";
// //                         e.target.style.boxShadow = "none";
// //                       }}
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="flex items-center gap-1 mb-1 text-xs font-semibold text-gray-700">
// //                       <Clock className="w-3 h-3" />
// //                       Expires (sec)
// //                     </label>
// //                     <div className="relative w-full">
// //                       <input
// //                         type="number"
// //                         value={expiresIn}
// //                         onChange={(e) => setExpiresIn(e.target.value)}
// //                         readOnly
// //                         placeholder=""
// //                         min="60"
// //                         max="604800"
// //                         className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-100 placeholder-gray-400 transition-all border border-gray-300 rounded-lg outline-none pr-28"
// //                       />
// //                       {file && estimatedTime && (
// //                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
// //                           {estimatedTime}
// //                         </span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* PROGRESS BAR */}
// //               {uploadProgress > 0 && uploadProgress < 100 && (
// //                 <div className="space-y-2">
// //                   <div className="flex items-center justify-between">
// //                     <span className="text-sm text-gray-600">Uploading...</span>
// //                     <span
// //                       className="text-sm font-semibold"
// //                       style={{ color: brandColor }}
// //                     >
// //                       {uploadProgress}%
// //                     </span>
// //                   </div>
// //                   <div className="w-full bg-gray-200 rounded-full h-2">
// //                     <div
// //                       className="h-2 rounded-full transition-all duration-300"
// //                       style={{
// //                         width: `${uploadProgress}%`,
// //                         backgroundColor: brandColor,
// //                       }}
// //                     ></div>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* ERROR MESSAGE */}
// //               {errorMessage && (
// //                 <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
// //                   <p className="text-sm text-red-700">{errorMessage}</p>
// //                 </div>
// //               )}

// //               {/* SUCCESS MESSAGE */}
// //               {uploadStatus === "success" && (
// //                 <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
// //                   <p className="text-sm text-green-700 font-semibold">
// //                     ✓ Upload successful!
// //                   </p>
// //                   <p className="text-xs text-green-600 mt-1">
// //                     Path: {uploadedPath}
// //                   </p>
// //                 </div>
// //               )}
// //             </div>

// //             {/* MODAL FOOTER */}
// //             <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
// //               <button
// //                 onClick={() => {
// //                   setIsModalOpen(false);
// //                   setFile(null);
// //                   setFilename("");
// //                   setErrorMessage("");
// //                   setUploadProgress(0);
// //                 }}
// //                 className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleUpload}
// //                 disabled={!file || uploading || !filename.trim()}
// //                 className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 text-white ${
// //                   !file || uploading || !filename.trim()
// //                     ? "cursor-not-allowed opacity-50"
// //                     : "shadow-lg hover:shadow-xl hover:opacity-90"
// //                 }`}
// //                 style={{
// //                   backgroundColor:
// //                     !file || uploading || !filename.trim()
// //                       ? "#d1d5db"
// //                       : brandColor,
// //                 }}
// //               >
// //                 {uploading ? (
// //                   <>
// //                     <Loader2 className="w-4 h-4 animate-spin" />
// //                     Uploading...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Upload className="w-4 h-4" />
// //                     Upload
// //                   </>
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TranscriptUpload;