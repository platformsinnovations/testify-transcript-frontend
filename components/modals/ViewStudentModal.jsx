"use client";

import { useState, useEffect } from "react";
import { studentService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
};

const ViewStudentModal = ({ isOpen, onClose, schoolId, studentId }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // GET BRAND COLOR
  const getBrandColor = () => user?.school?.brandColor || "#04BF68";
  const brandColor = getBrandColor();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (isOpen && schoolId && studentId) {
        try {
          setLoading(true);
          const response = await studentService.getStudent(schoolId, studentId);
          if (response.status) {
            setStudent(response.data);
          }
        } catch (error) {
          console.error("Error fetching student details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStudentDetails();
  }, [isOpen, schoolId, studentId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-1000">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      ></div>

      {/* MODAL */}
      <div className="bg-white rounded-2xl w-[773px] max-h-[90vh] overflow-y-auto relative z-1001 shadow-xl">
        <div className="p">
          <div
            className="flex justify-between items-center p-6 mb-"
            style={{ backgroundColor: brandColor }}
          >
            <h2 className="text-2xl font-bold text-white">Student's Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-400"
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tms-lightGreen"></div>
            </div>
          ) : student ? (
            <div className="space-y-">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-tms-text">
                  Bio-Data
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-tms-gray-20">Student Name</p>
                    <p className="text-md font-semibold text-tms-admin">
                      {student.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-tms-gray-20">Gender</p>
                    <p className="text-md font-semibold text-tms-admin">
                      {student.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-tms-gray-20">DOB</p>
                    <p className="text-md font-semibold text-tms-admin">
                      {formatDate(student.dob)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-tms-gray-20">Phone Number</p>
                    <p className="text-md font-semibold text-tms-admin">
                      {student.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-tms-gray-20">Email</p>
                    <p className="text-md font-semibold text-tms-admin">
                      {student.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb- text-tms-text">
                  Academic History Summary
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-tms-gray-20">Matric Number</p>
                    <p className="text-md font-semibold text-tms-admin">
                      {student.matricNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-tms-gray-20">Admission Year</p>
                    <p className="text-md font-semibold text-tms-admin">
                      {student.admissionYear}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-tms-gray-20">Graduation Year</p>
                    <p className="text-md font-semibold text-tms-admin">
                      {student.graduationYear}
                    </p>
                  </div>
                  
                  </div>
                  
                  <div className="flex w-full gap-4 space-y-8">
                    <div className="w-full">
                    <p className="text-sm text-tms-gray-20">Program of Study</p>
                    <p className="text-md font-semibold text-tms-admin">
                      {student.programOfStudy}
                    </p>
                  </div>
                  
                  </div>
                  <div className="w-full mt-4">
                    <p className="text-sm text-tms-gray-20">Transcript URL</p>
                    <p className="text-md font-semibold text-tms-admin">
                      {student.transcriptUrl}
                    </p>
                  </div>
              </div>

              <div className="rounded-lg p-6">
                <p className=" text-tms-text font-semibold text-md">Note:</p>
                <p className="text-sm text-tms-gray-5">
                  Please go through the archive to check for the information of
                  this ex student, cross check and confirm the individual checks
                  all the criteria needed for the issuance of this transcript
                  before approval and generation of the transcript.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  className="px-6 py-2 mb-3 text-white rounded-lg hover:bg-tms-lightGreen/90"
                  style={{ backgroundColor: brandColor }}
                  onClick={onClose}
                >
                  Generate Transcript
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No student data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudentModal;
