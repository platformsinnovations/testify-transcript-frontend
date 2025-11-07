"use client";

import { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import AddStudentModal from "@/components/modals/AddStudentModal";
import ViewStudentModal from "@/components/modals/ViewStudentModal";
import EditStudent from "@/components/modals/EditStudent";
import { studentService, schoolService } from "@/services/api";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import ConfirmationModal from "@/components/modals/ConfirmationModal";

const StudentRecords = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
  });

  const perPageOptions = [15, 20, 50, 100, 200];

  // GET schoolId EITHER FROM USER'S school_id OR SELECTED SCHOOL
  const schoolId = user?.school_id || selectedSchoolId;

  // GET BRAND COLOR FROM USER'S SCHOOL OR USE DEFAULT
  const getBrandColor = () => {
    return user?.school?.brandColor || "#04BF68";
  };

  const brandColor = getBrandColor();
  // Create a small inline SVG arrow colored with the brand color and URL-encode it for use as a background-image
  const arrowSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='${brandColor}'><path d='M5.23 7.21a.75.75 0 011.06-.02L10 10.584l3.71-3.4a.75.75 0 111.02 1.1l-4.2 3.85a.75.75 0 01-1.02 0l-4.2-3.85a.75.75 0 01-.02-1.06z'/></svg>`
  );
  const arrowDataUrl = `url("data:image/svg+xml;utf8,${arrowSvg}")`;

  const fetchSchools = async () => {
    try {
      const response = await schoolService.getAllSchools();
      if (response.status) {
        setSchools(response.data);
        // FOR ADMIN(most likely super_admin) WITHOUT school_id, AUTO-SELECT FIRST SCHOOL
        if (!user?.school_id && response.data.length > 0) {
          setSelectedSchoolId(response.data[0].id);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch schools");
      console.error("Error fetching schools:", error);
    }
  };

  // SCHOOL SELECTOR COMPONENT
  const SchoolSelector = () => {
    if (user?.school_id || !schools.length) return null;

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Select School
        </label>
        <select
          className="w-full md:w-[300px] p-2 border border-gray-300 rounded-md text-gray-900"
          value={selectedSchoolId || ""}
          onChange={(e) => setSelectedSchoolId(Number(e.target.value))}
          onFocus={(e) => {
            e.target.style.borderColor = brandColor;
            e.target.style.boxShadow = `0 0 0 2px ${brandColor}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="" className="text-gray-900">
            Select a school
          </option>
          {schools.map((school) => (
            <option key={school.id} value={school.id} className="text-gray-900">
              {school.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const headers = [
    "Matric Number",
    "Name",
    "Program of Study",
    "Admission Year",
    "Graduation Year",
    "Action",
  ];

  const fetchStudents = async (page = 1, filter = "") => {
    try {
      setIsLoading(true);
      if (!schoolId) {
        throw new Error("School ID not found. Please try logging in again.");
      }
      console.log("Fetching students for school ID:", schoolId);
      const response = await studentService.getAllStudents(
        schoolId,
        page,
        pagination.perPage,
        filter
      );
      console.log("API Response:", response);

      if (response.status) {
        console.log("Students data:", response.data);
        setStudents(response.data);
        setPagination({
          currentPage: response.meta.currentPage,
          lastPage: response.meta.lastPage,
          total: response.meta.total,
          perPage: response.meta.perPage,
          from: response.meta.from,
          to: response.meta.to,
        });
      } else {
        console.log("Response status is false:", response);
        toast.error(response.message || "Failed to fetch students");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch students");
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  // When debounced term changes, use it as the active filter and fetch page 1
  useEffect(() => {
    setActiveFilter(debouncedSearchTerm);
    if (schoolId) {
      fetchStudents(1, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, schoolId, pagination.perPage]);

  const handleAddStudent = async (data) => {
    try {
      const response = await studentService.createStudent(schoolId, data);
      if (response.status) {
        toast.success(response.message);
        fetchStudents(pagination.currentPage, activeFilter);
        setIsModalOpen(false);
      }
    } catch (error) {
      if (error.errors) {
        // Handle validation errors
        Object.values(error.errors).forEach((errorMessages) => {
          errorMessages.forEach((message) => toast.error(message));
        });
      } else {
        toast.error(error.message || "Failed to add student");
      }
    }
  };

  // Handler for editing student
  const handleEditStudent = async (form) => {
    try {
      const response = await studentService.updateStudent(
        schoolId,
        form.id,
        form,
        user?.token
      );
      if (response.status) {
        toast.success(response.message || "Student updated successfully");
        setIsEditModalOpen(false);
        setSelectedStudent(null);
        fetchStudents(pagination.currentPage, activeFilter);
      } else {
        toast.error(response.message || "Failed to update student");
      }
    } catch (error) {
      if (error.errors) {
        Object.values(error.errors).forEach((errorMessages) => {
          errorMessages.forEach((message) => toast.error(message));
        });
      } else {
        toast.error(error.message || "Failed to update student");
      }
    }
  };

  // Handler for deleting student
  const handleDelete = async () => {
    try {
      const response = await studentService.deleteStudent(
        schoolId,
        selectedStudent.id
      );
      if (response.status) {
        toast.success(response.message || "Student deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedStudent(null);
        fetchStudents(pagination.currentPage, activeFilter);
      } else {
        toast.error(response.message || "Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(error.message || "Failed to delete student");
    }
  };

  // Fetch schools when component mounts
  useEffect(() => {
    if (!user?.school_id) {
      fetchSchools();
    }
  }, []);

  useEffect(() => {
    console.log("User object:", user);
    console.log("School ID from user:", user?.school_id);
    console.log("Selected School ID:", selectedSchoolId);
    console.log("UseEffect triggered with schoolId:", schoolId);
    if (schoolId) {
      console.log(
        "School ID available — student list will be fetched by the debounced search effect."
      );
    } else {
      console.log("No schoolId available yet");
    }
  }, [schoolId, user, selectedSchoolId]); // Re-run when schoolId, user, or selectedSchoolId changes

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-1">
      <img
        src="/universityTranscript/emptyState.svg"
        alt="No Records Yet"
        className="w-[340px] h-[255px] mb-4"
      />
      <h3 className="text-tms-no-zone text-xl font-semibold mb-2">
        No Student Record at this time
      </h3>
      <p className="text-tms-no-zone2 text-center text-xs mb-8">
        Student Records will appear once students data have been uploaded or
        added
      </p>
    </div>
  );

  // Debug effect to log state changes
  useEffect(() => {
    console.log("Current state:", {
      isLoading,
      studentsCount: students?.length,
      students,
      schoolId,
      user,
    });
  }, [isLoading, students, schoolId, user]);

  return (
    <div className="px- md:px- w-full">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          Students Academic Data
        </h1>
        <p className="text-sm md:text-base text-gray-500">
          Manage and verify uploaded or integrated student data
        </p>
      </div>

      <SchoolSelector />

      {(!students || students.length === 0) && !isLoading ? (
        <>
          <EmptyState />
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-2 px-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              width="170px"
              height="48px"
              className="text-white py-2 rounded-lg"
              style={{ backgroundColor: brandColor }}
            >
              Add Student Record
            </Button>
            <a
              href="/students_records_upload.xlsx"
              download
              className="w-44 h-12 bg-white rounded-lg flex items-center justify-center py-2"
              style={{ border: `1px solid ${brandColor}`, color: brandColor }}
            >
              Download Sample
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border bg-white rounded-lg focus:outline-none  text-black placeholder-gray-400"
                  style={{ borderColor: brandColor }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                className="w-full h-10 md:w-auto border rounded-lg appearance-none px-4 md:pl-2 md:pr-10 py-2 focus:outline-none text-gray-700 bg-white"
                style={{
                  borderColor: brandColor,
                  backgroundImage: arrowDataUrl,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '20px',
                }}
                value={pagination.perPage}
                onChange={(e) => {
                  setPagination((prev) => ({
                    ...prev,
                    perPage: Number(e.target.value),
                    currentPage: 1, // Reset to first page when changing perPage
                  }));
                }}
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <Button
                onClick={() => setIsModalOpen(true)}
                width="100%"
                height="48px"
                className="text-white text-sm whitespace-nowrap rounded-lg py-2"
                style={{ backgroundColor: brandColor }}
              >
                Upload Student Data
              </Button>
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/students_records_upload.xlsx";
                  link.download = "students_records_upload.xlsx";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success("Sample File Downloaded Successfully!");
                }}
                width="100%"
                height="48px"
                className="bg-white text-sm whitespace-nowrap rounded-lg py-2"
                style={{ border: `1px solid ${brandColor}`, color: brandColor }}
              >
                Download Sample
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div
                className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                style={{
                  borderTopColor: brandColor,
                  borderBottomColor: brandColor,
                }}
              ></div>
            </div>
          ) : (
            <Table
              headers={headers}
              rows={students.map((student) => ({
                id: student.matricNumber,
                name: student.name,
                department: student.programOfStudy,
                admissionYear: student.admissionYear,
                graduationYear: student.graduationYear,
                action: "View Details",
              }))}
              pagination={{
                from: (pagination.currentPage - 1) * pagination.perPage + 1,
                to: Math.min(
                  pagination.currentPage * pagination.perPage,
                  pagination.total
                ),
                total: pagination.total,
              }}
              onActionClick={(row) => {
                const student = students.find((s) => s.matricNumber === row.id);
                if (student) {
                  setSelectedStudent(student);
                  setIsViewModalOpen(true);
                }
              }}
              onEdit={(row) => {
                const student = students.find((s) => s.matricNumber === row.id);
                if (student) {
                  setSelectedStudent(student);
                  setIsEditModalOpen(true);
                }
              }}
              onDelete={(row) => {
                const student = students.find((s) => s.matricNumber === row.id);
                if (student) {
                  setSelectedStudent(student);
                  setIsDeleteModalOpen(true);
                }
              }}
              showActions={true}
              showSerialNumber={true}
            />
          )}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>
              Showing: {(pagination.currentPage - 1) * pagination.perPage + 1}{" "}
              to{" "}
              {Math.min(
                pagination.currentPage * pagination.perPage,
                pagination.total
              )}{" "}
              of {pagination.total} results
            </span>
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                onClick={() => fetchStudents(1, activeFilter)}
                disabled={pagination.currentPage === 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                onClick={() =>
                  fetchStudents(pagination.currentPage - 1, activeFilter)
                }
                disabled={pagination.currentPage === 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <div className="flex gap-1">
                {[...Array(pagination.lastPage)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`px-3 py-1 rounded-lg ${
                      pagination.currentPage === index + 1
                        ? "text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => fetchStudents(index + 1, activeFilter)}
                    style={
                      pagination.currentPage === index + 1
                        ? { backgroundColor: brandColor }
                        : undefined
                    }
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                onClick={() =>
                  fetchStudents(pagination.currentPage + 1, activeFilter)
                }
                disabled={pagination.currentPage === pagination.lastPage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                onClick={() => fetchStudents(pagination.lastPage, activeFilter)}
                disabled={pagination.currentPage === pagination.lastPage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStudent}
      />

      <ViewStudentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedStudent(null);
        }}
        schoolId={schoolId}
        studentId={selectedStudent?.id}
      />

      <EditStudent
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        schoolId={schoolId}
        token={user?.token}
        onSubmit={handleEditStudent}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStudent(null);
        }}
        onConfirm={handleDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
      />

      <Toaster position="top-right" />
    </div>
  );
};

export default StudentRecords;
