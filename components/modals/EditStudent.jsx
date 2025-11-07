import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from "@/contexts/AuthContext";

const EditStudent = ({ isOpen, onClose, student, onSubmit }) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    matric_number: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    admission_year: '',
    graduation_year: '',
    program_of_study: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // GET BRAND COLOR
  const getBrandColor = () => user?.school?.brandColor || "#04BF68";
  const brandColor = getBrandColor();

  useEffect(() => {
    if (student) {
      setForm({
        id: student.id || student.matricNumber || '',
        name: student.name || '',
        matric_number: student.matricNumber || '',
        email: student.email || '',
        phone: student.phone || '',
        dob: student.dob ? formatDate(student.dob) : '',
        gender: student.gender || '',
        admission_year: student.admissionYear ? String(student.admissionYear) : '',
        graduation_year: student.graduationYear ? String(student.graduationYear) : '',
        program_of_study: student.programOfStudy || '',
      });
    }
  }, [student]);

  const formatDate = (dateStr) => {
    // Accepts 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ssZ', returns 'DD-MM-YYYY'
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id) {
      toast.error('Student ID is missing. Cannot update record.');
      return;
    }
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-1000">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" onClick={onClose}></div>
      {/* MODAL */}
      <div className="bg-white rounded-2xl w-[773px] max-h-[90vh] overflow-y-auto relative z-1001 shadow-xl">
        <div>
          <div className="flex justify-between items-center p-6"
            style={{backgroundColor: brandColor}}
          >
            <h2 className="text-2xl font-bold text-white">Edit Student</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-400"
              aria-label="Close"
            >
              <FiX size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="bg-white rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold mb-4 text-tms-text">Bio-Data</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-tms-gray-20">Student Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className="text-black text-md w-full rounded-md border border-gray-300 px-3 py-2 focus:border-tms-lightGreen focus:ring-tms-lightGreen" required />
                </div>
                <div>
                  <label className="text-sm text-tms-gray-20">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="text-black text-md w-full rounded-md border border-gray-300 px-3 py-2 focus:border-tms-lightGreen focus:ring-tms-lightGreen">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-tms-gray-20">DOB</label>
                  <input type="text" name="dob" value={form.dob} onChange={handleChange} placeholder="DD-MM-YYYY" className="text-black text-md w-full rounded-md border border-gray-300 px-3 py-2 focus:border-tms-lightGreen focus:ring-tms-lightGreen" />
                </div>
                <div>
                  <label className="text-sm text-tms-gray-20">Phone Number</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} className="text-black text-md w-full rounded-md border border-gray-300 px-3 py-2 focus:border-tms-lightGreen focus:ring-tms-lightGreen" />
                </div>
                <div>
                  <label className="text-sm text-tms-gray-20">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="text-black text-md w-full rounded-md border border-gray-300 px-3 py-2 focus:border-tms-lightGreen focus:ring-tms-lightGreen" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg px-6 mb-4">
              <h3 className="text-lg font-semibold mb-4 text-tms-text">Academic History Summary</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-tms-gray-20">Matric Number</label>
                  <input type="text" name="matric_number" value={form.matric_number} onChange={handleChange} className="text-black text-md w-full rounded-md border border-gray-300 px-3 py-2 focus:border-tms-lightGreen focus:ring-tms-lightGreen" required />
                </div>
                <div>
                  <label className="text-sm text-tms-gray-20">Admission Year</label>
                  <input type="text" name="admission_year" value={form.admission_year} onChange={handleChange} className="text-black text-md w-full rounded-md border border-gray-300 px-3 py-2 focus:border-tms-lightGreen focus:ring-tms-lightGreen" />
                </div>
                <div>
                  <label className="text-sm text-tms-gray-20">Program of Study</label>
                  <input type="text" name="program_of_study" value={form.program_of_study} onChange={handleChange} className="text-black text-md w-full rounded-md border border-gray-300 px-3 py-2 focus:border-tms-lightGreen focus:ring-tms-lightGreen" />
                </div>
                <div>
                  <label className="text-sm text-tms-gray-20">Graduation Year</label>
                  <input type="text" name="graduation_year" value={form.graduation_year} onChange={handleChange} className="text-black text-md w-full rounded-md border border-gray-300 px-3 py-2 focus:border-tms-lightGreen focus:ring-tms-lightGreen" />
                </div>
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
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-lg hover:bg-tms-lightGreen/90 focus:outline-none focus:ring-2 focus:ring-tms-lightGreen disabled:opacity-60"
                style={{ backgroundColor: brandColor }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
