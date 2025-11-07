import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Cookie helper (client-side only)
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const nameEQ = `${name}=`;
  const parts = document.cookie?.split(";") || [];
  for (let c of parts) {
    c = c.trim();
    if (c.startsWith(nameEQ)) return decodeURIComponent(c.slice(nameEQ.length));
  }
  return null;
};

// Attach Bearer from SESSION cookie only
api.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// ---------- Services ----------
const schoolService = {
  getAllSchools: async (page = 1, perPage = 15) => {
    try {
      const response = await api.get(`/schools?page=${page}&perPage=${perPage}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSchool: async (schoolId) => {
    try {
      const response = await api.get(`/schools/${schoolId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createSchool: async (schoolData) => {
    try {
      const apiData = {
        name: schoolData.name,
        address: schoolData.address,
        subdomain: schoolData.subdomain,
        logo_url: schoolData.logo_url,
        brand_color: schoolData.brand_color,
        admin_name: schoolData.admin_name,
        admin_email: schoolData.admin_email,
        phone: schoolData.phone,
        website: schoolData.website,
        yearFounded: schoolData.yearFounded,
      };
      const response = await api.post("/schools", apiData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateSchool: async (schoolId, schoolData) => {
    try {
      const response = await api.put(`/schools/${schoolId}`, schoolData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteSchool: async (schoolId) => {
    try {
      const response = await api.delete(`/schools/${schoolId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

const studentService = {
  getAllStudents: async (schoolId, page = 1, perPage = 15, filter = "") => {
    try {
      let url = `/schools/${schoolId}/students?page=${page}&perPage=${perPage}`;
      if (filter) url += `&filter=${encodeURIComponent(filter)}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const fallback = {
        status: false,
        message: error.message || "An error occurred while fetching students",
        data: [],
        errors: [error.message || "Unknown error"],
        meta: { currentPage: page, lastPage: 1, total: 0, perPage },
      };
      throw error.response?.data || fallback;
    }
  },

  getStudent: async (schoolId, studentId) => {
    try {
      const response = await api.get(
        `/schools/${schoolId}/students/${studentId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createStudent: async (schoolId, studentData) => {
    try {
      const apiData = {
        name: studentData.name,
        matric_number: studentData.matricNumber,
        email: studentData.email,
        phone: studentData.phoneNumber,
        dob: studentData.dateOfBirth,
        gender: studentData.gender,
        program_of_study: studentData.programOfStudy,
        admission_year: studentData.admissionYear,
        graduation_year: studentData.graduationYear,
      };
      const response = await api.post(
        `/schools/${schoolId}/students`,
        apiData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateStudent: async (schoolId, studentId, studentData) => {
    try {
      const response = await api.put(
        `/schools/${schoolId}/students/${studentId}`,
        studentData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteStudent: async (schoolId, studentId) => {
    try {
      const response = await api.delete(
        `/schools/${schoolId}/students/${studentId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export { studentService, schoolService };



  
  
  
  
  

// import axios from 'axios';

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// const api = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ADD REQUEST INTERCEPTOR TO ADD TOKEN
// api.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem('token') || localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

// const schoolService = {
//   getAllSchools: async (page = 1, perPage = 15) => {
//     try {
//       const response = await api.get(`/schools?page=${page}&perPage=${perPage}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getSchool: async (schoolId) => {
//     try {
//       const response = await api.get(`/schools/${schoolId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   createSchool: async (schoolData) => {
//     try {
//       // TRANSFORM THE DATA TO MATCH API EXPECTATIONS
//       const apiData = {
//         name: schoolData.name,
//         address: schoolData.address,
//         subdomain: schoolData.subdomain,
//         logo_url: schoolData.logo_url,
//         brand_color: schoolData.brand_color,
//         admin_name: schoolData.admin_name,
//         admin_email: schoolData.admin_email,
//         phone: schoolData.phone,
//         website: schoolData.website,
//         yearFounded: schoolData.yearFounded
//       };
      
//       const response = await api.post('/schools', apiData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   updateSchool: async (schoolId, schoolData) => {
//     try {
//       const response = await api.put(`/schools/${schoolId}`, schoolData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   deleteSchool: async (schoolId) => {
//     try {
//       const response = await api.delete(`/schools/${schoolId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   }
// };

// const studentService = {
//   getAllStudents: async (schoolId, page = 1, perPage = 15, filter = '') => {
//     try {
//       console.log('Making API request with:', { schoolId, page, perPage, filter });
//       let url = `/schools/${schoolId}/students?page=${page}&perPage=${perPage}`;
//       if (filter) {
//         // ENCODE FILTER PARAM
//         url += `&filter=${encodeURIComponent(filter)}`;
//       }
//       console.log('Full API URL:', `${baseURL}${url}`);
//       const response = await api.get(url);
//       console.log('Raw API response:', response.data);
//       console.log('Response URL from meta:', response.data.meta?.path);
//       return response.data;
//     } catch (error) {
//       console.error('API Error:', error);
//       const errorResponse = {
//         status: false,
//         message: error.message || 'An error occurred while fetching students',
//         data: [],
//         errors: [error.message || 'Unknown error'],
//         meta: {
//           currentPage: page,
//           lastPage: 1,
//           total: 0,
//           perPage
//         }
//       };
//       throw error.response?.data || errorResponse;
//     }
//   },

//   getStudent: async (schoolId, studentId) => {
//     try {
//       console.log(`Fetching student details for student ${studentId} from school ${schoolId}`);
//       const response = await api.get(`/schools/${schoolId}/students/${studentId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching student:', error);
//       throw error.response?.data || error.message;
//     }
//   },

//   createStudent: async (schoolId, studentData) => {
//     try {
//       // TRANSFORM THE DATA TO MATCH API EXPECTATIONS
//       const apiData = {
//         name: studentData.name,
//         matric_number: studentData.matricNumber,
//         email: studentData.email,
//         phone: studentData.phoneNumber,
//         dob: studentData.dateOfBirth,
//         gender: studentData.gender,
//         program_of_study: studentData.programOfStudy,
//         admission_year: studentData.admissionYear,
//         graduation_year: studentData.graduationYear
//       };
      
//       const response = await api.post(`/schools/${schoolId}/students`, apiData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   updateStudent: async (schoolId, studentId, studentData) => {
//     try {
//       const response = await api.put(`/schools/${schoolId}/students/${studentId}`, studentData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   deleteStudent: async (schoolId, studentId) => {
//     try {
//       const response = await api.delete(`/schools/${schoolId}/students/${studentId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   }
// };

// export { studentService, schoolService };