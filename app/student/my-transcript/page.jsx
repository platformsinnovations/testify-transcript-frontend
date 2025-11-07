"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

const MyTranscript = () => {
  const { user, getToken } = useAuth();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (!user?.matricNumber) return;

    const fetchTranscript = async () => {
      try {
        setLoading(true);

        // Prefer using auth context token helper if available
        const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");

        // Clean matric (strip slashes and trim)
        const rawMatric = String(user.matricNumber || "");
        const cleanedMatric = rawMatric.replace(/\//g, "").trim();

        const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
        const url = `${base}/transcripts/${encodeURIComponent(cleanedMatric)}`;

        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(url, { method: "GET", headers });

        if (!res.ok) {
          throw new Error("Failed to load transcript");
        }

        const blob = await res.blob();
        // revoke previous object URL if any
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const fileUrl = URL.createObjectURL(blob);
        objectUrlRef.current = fileUrl;

        setPdfUrl(fileUrl);
      } catch (error) {
        console.log(error);
        setErrorMsg("Could not load your transcript. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();

    return () => {
      // cleanup object url
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [user]);

  // Helpers for toolbar actions
  const getCleanedMatric = () => String(user?.matricNumber || "").replace(/\//g, "").trim();

  const handleDownload = () => {
    const url = objectUrlRef.current || pdfUrl;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    const name = getCleanedMatric() || "transcript";
    a.download = `${name}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleOpenNewTab = () => {
    const url = objectUrlRef.current || pdfUrl;
    if (!url) return;
    window.open(url, "_blank");
  };

  const handlePrint = () => {
    const url = objectUrlRef.current || pdfUrl;
    if (!url) return;
    // Open a new window with an iframe that prints once loaded
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `<!doctype html><html><head><title>Print Transcript</title><style>html,body{height:100%;margin:0}</style></head><body><iframe src="${url}" frameborder="0" style="width:100%;height:100vh;border:none"></iframe><script>const i = document.querySelector('iframe'); if(i){ i.onload = function(){ setTimeout(function(){ window.focus(); window.print(); },250); }; }</` + "/script></body></html>";
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-bold mb-4">My Transcript</h1>

      {loading && (
        <p className="text-gray-600">Loading transcript… please wait.</p>
      )}

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      {pdfUrl && (
        <>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenNewTab}
                className="px-3 py-2 bg-white border rounded-lg text-sm shadow-sm hover:bg-gray-50"
              >
                Open in new tab
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-2 bg-white border rounded-lg text-sm shadow-sm hover:bg-gray-50"
              >
                Download
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-2 bg-tms-lightGreen text-white rounded-lg text-sm shadow-sm hover:opacity-90"
              >
                Print
              </button>
            </div>
            <div className="text-sm text-gray-600">Matric: {user?.matricNumber}</div>
          </div>

          <div className="w-full h-[90vh] border rounded-lg shadow overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Transcript PDF"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyTranscript;




















// PREVIOUSLY WORKING
// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useAuth } from "@/contexts/AuthContext";

// const MyTranscript = () => {
//   const { user, getToken } = useAuth();
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState("");
//   const objectUrlRef = useRef(null);

//   useEffect(() => {
//     if (!user?.matricNumber) return;

//     const fetchTranscript = async () => {
//       try {
//         setLoading(true);

//         // Prefer using auth context token helper if available
//         const token = typeof getToken === "function" ? getToken() : localStorage.getItem("token");

//         // Clean matric (strip slashes and trim)
//         const rawMatric = String(user.matricNumber || "");
//         const cleanedMatric = rawMatric.replace(/\//g, "").trim();

//         const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
//         const url = `${base}/transcripts/${encodeURIComponent(cleanedMatric)}`;

//         const headers = {};
//         if (token) headers["Authorization"] = `Bearer ${token}`;

//         const res = await fetch(url, { method: "GET", headers });

//         if (!res.ok) {
//           throw new Error("Failed to load transcript");
//         }

//         const blob = await res.blob();
//         // revoke previous object URL if any
//         if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
//         const fileUrl = URL.createObjectURL(blob);
//         objectUrlRef.current = fileUrl;

//         setPdfUrl(fileUrl);
//       } catch (error) {
//         console.log(error);
//         setErrorMsg("Could not load your transcript. Try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTranscript();

//     return () => {
//       // cleanup object url
//       if (objectUrlRef.current) {
//         URL.revokeObjectURL(objectUrlRef.current);
//         objectUrlRef.current = null;
//       }
//     };
//   }, [user]);

//   // Helpers for toolbar actions
//   const getCleanedMatric = () => String(user?.matricNumber || "").replace(/\//g, "").trim();

//   const handleDownload = () => {
//     const url = objectUrlRef.current || pdfUrl;
//     if (!url) return;
//     const a = document.createElement("a");
//     a.href = url;
//     const name = getCleanedMatric() || "transcript";
//     a.download = `${name}.pdf`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   const handleOpenNewTab = () => {
//     const url = objectUrlRef.current || pdfUrl;
//     if (!url) return;
//     window.open(url, "_blank");
//   };

//   const handlePrint = () => {
//     const url = objectUrlRef.current || pdfUrl;
//     if (!url) return;
//     // Open a new window with an iframe that prints once loaded
//     const w = window.open("", "_blank");
//     if (!w) return;
//     const html = `<!doctype html><html><head><title>Print Transcript</title><style>html,body{height:100%;margin:0}</style></head><body><iframe src="${url}" frameborder="0" style="width:100%;height:100vh;border:none"></iframe><script>const i = document.querySelector('iframe'); if(i){ i.onload = function(){ setTimeout(function(){ window.focus(); window.print(); },250); }; }</` + "/script></body></html>";
//     w.document.open();
//     w.document.write(html);
//     w.document.close();
//   };

//   return (
//     <div className="p-4 md:p-8">
//       <h1 className="text-xl font-bold mb-4">My Transcript</h1>

//       {loading && (
//         <p className="text-gray-600">Loading transcript… please wait.</p>
//       )}

//       {errorMsg && <p className="text-red-600">{errorMsg}</p>}

//       {pdfUrl && (
//         <>
//           <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleOpenNewTab}
//                 className="px-3 py-2 bg-white border rounded-lg text-sm shadow-sm hover:bg-gray-50"
//               >
//                 Open in new tab
//               </button>
//               <button
//                 onClick={handleDownload}
//                 className="px-3 py-2 bg-white border rounded-lg text-sm shadow-sm hover:bg-gray-50"
//               >
//                 Download
//               </button>
//               <button
//                 onClick={handlePrint}
//                 className="px-3 py-2 bg-tms-lightGreen text-white rounded-lg text-sm shadow-sm hover:opacity-90"
//               >
//                 Print
//               </button>
//             </div>
//             <div className="text-sm text-gray-600">Matric: {user?.matricNumber}</div>
//           </div>

//           <div className="w-full h-[90vh] border rounded-lg shadow overflow-hidden">
//             <iframe
//               src={pdfUrl}
//               className="w-full h-full"
//               title="Transcript PDF"
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default MyTranscript;



























// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";

// const MyTranscript = () => {
//   const { user } = useAuth();
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState("");

//   useEffect(() => {
//     if (!user?.matricNumber) return;

//     const fetchTranscript = async () => {
//       try {
//         setLoading(true);

//         const token = localStorage.getItem("token");

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/transcripts/${user.matricNumber}`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!res.ok) {
//           throw new Error("Failed to load transcript");
//         }

//         const blob = await res.blob();
//         const fileUrl = URL.createObjectURL(blob);

//         setPdfUrl(fileUrl);
//       } catch (error) {
//         console.log(error);
//         setErrorMsg("Could not load your transcript. Try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTranscript();
//   }, [user]);

//   return (
//     <div className="p-4 md:p-8">
//       <h1 className="text-xl font-bold mb-4">My Transcript</h1>

//       {loading && (
//         <p className="text-gray-600">Loading transcript… please wait.</p>
//       )}

//       {errorMsg && <p className="text-red-600">{errorMsg}</p>}

//       {pdfUrl && (
//         <iframe
//           src={pdfUrl}
//           className="w-full h-[90vh] border rounded-lg shadow"
//         ></iframe>
//       )}
//     </div>
//   );
// };

// export default MyTranscript;


























// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { ChevronDown, Search, ArrowLeft } from "lucide-react";

// const MyTranscript = () => {
//   const [filterValue, setFilterValue] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   // Placeholder data - will be replaced with API data later
//   const studentInfo = {
//     schoolLogo: "/universityTranscript/lagosUniLogo.svg",
//     schoolName: "LAGOS STATE UNIVERSITY - OJO",
//     facultyName: "FACULTY OF EDUCATION",
//     departmentName: "DEPARTMENT OF EDUCATIONAL MANAGEMENT",
//     discipline: "EDUCATIONAL MANAGEMENT",
//     transcriptType: "ACADEMIC TRANSCRIPT (CONFIDENTIAL)",
//     studentName: "BENJAMIN RICHARD",
//     regNumber: "170673",
//     degreeInView: "Bachelor of Scinece (Education) B.Sc ( Ed.))",
//     classOfDegree: "Second Class Honours (Upper Division)",
//     entrySession: "2019/2020",
//     graduationSession: "2024/2025",
//     modeOfEntry: " Unified Tertiary Matriculation Examination",
//     sex: "Male",
//   };

//   const courses = [
//     {
//       code: "CHM 101",
//       title: "BASIC ORGANIC CHEMISTRY",
//       unit: 3,
//       grade: "A",
//       gradePoint: 5,
//       totalPoint: 15,
//     },
//     {
//       code: "CHM 102",
//       title: "BASIC ORGANIC CHEMISTRY",
//       unit: 3,
//       grade: "B",
//       gradePoint: 4,
//       totalPoint: 12,
//     },
//     {
//       code: "CHM 103",
//       title: "BASIC ORGANIC CHEMISTRY",
//       unit: 2,
//       grade: "C",
//       gradePoint: 3,
//       totalPoint: 6,
//     },
//     {
//       code: "CHM 104",
//       title: "BASIC ORGANIC CHEMISTRY",
//       unit: 2,
//       grade: "D",
//       gradePoint: 2,
//       totalPoint: 4,
//     },
//     {
//       code: "CHM 105",
//       title: "BASIC ORGANIC CHEMISTRY",
//       unit: 2,
//       grade: "D",
//       gradePoint: 2,
//       totalPoint: 4,
//     },
//     {
//       code: "CHM 106",
//       title: "BASIC ORGANIC CHEMISTRY",
//       unit: 2,
//       grade: "D",
//       gradePoint: 2,
//       totalPoint: 4,
//     },
//     {
//       code: "CHM 107",
//       title: "BASIC ORGANIC CHEMISTRY",
//       unit: 2,
//       grade: "D",
//       gradePoint: 2,
//       totalPoint: 4,
//     },
//   ];

//   return (
//     <div className="container mx-auto sm:py-6 md:-mt-12 bg-white text-black">
//       <p className="text-tms-gray-20 text-sm mb-4">
//         Preview your official academic record before requesting distribution.
//       </p>
//       {/* Filter and Action Bar */}
//       <div className="mb-6 md:mb-16">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           {/* Left Side: Filter and Search */}
//           <div className="flex flex-col sm:flex-row gap-3 flex-1">
//             {/* Filter Dropdown */}
//             <div className="relative w-full sm:w-48">
//               <select
//                 value={filterValue}
//                 onChange={(e) => setFilterValue(e.target.value)}
//                 className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg appearance-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-tms-admin focus:border-transparent cursor-pointer"
//               >
//                 <option value="all">All Semesters</option>
//                 <option value="semester1">1st Semester</option>
//                 <option value="semester2">2nd Semester</option>
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//             </div>

//             {/* Search Input */}
//             <div className="relative flex-1 sm:max-w-xs">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tms-admin focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Right Side: Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button className="px-5 py-2.5 bg-tms-lightGreen text-white rounded-lg font-medium text-sm hover:bg-opacity-90 transition-all whitespace-nowrap">
//               Request Transcript Distribution
//             </button>
//             <button className="px-5 py-2.5 border border-tms-lightGreen text-tms-lightGreen rounded-lg font-medium text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
//               <ArrowLeft className="w-4 h-4" />
//               Back To Dashboard
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Header Section */}
//       <div className="text-center mb-8 relative pt-28 sm:pt-32">
//         <div className="flex justify-center mb-4 absolute -top-4 sm:-top-8 lg:-top-12 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0">
//           <Image
//             src={studentInfo.schoolLogo}
//             alt="School Logo"
//             width={120}
//             height={120}
//             className="sm:w-[140px] sm:h-[140px] lg:w-[180px] lg:h-[180px]"
//           />
//         </div>

//         <div className="lg:absolute lg:-top-10 lg:right-0 lg:left-0 text-tms-admin">
//           <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-1">
//             {studentInfo.schoolName}
//           </h1>
//           <h2 className="text-base sm:text-lg font-semibold mb-1">
//             {studentInfo.facultyName}
//           </h2>
//           <p className="text-sm sm:text-md font-medium mb-1">
//             {studentInfo.departmentName}
//           </p>
//           <p className="text-sm sm:text-md font-medium mb-1">
//             DISCIPLINE: {studentInfo.discipline}
//           </p>
//           <p className="text-base sm:text-lg lg:text-xl font-extrabold underline">
//             {studentInfo.transcriptType}
//           </p>
//         </div>
//       </div>

//       {/* Student Info Section */}
//       <div className="mb-8 text-tms-admin lg:mt-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
//           <div className="space-y-1 text-sm sm:text-base">
//             <p>
//               <span className="font-semibold">NAME:</span>{" "}
//               {studentInfo.studentName}
//             </p>
//             <p>
//               <span className="font-semibold">MATRIC. NO:</span>{" "}
//               {studentInfo.regNumber}
//             </p>
//             <p>
//               <span className="font-semibold">Degree In View:</span>{" "}
//               {studentInfo.degreeInView}
//             </p>
//             <p>
//               <span className="font-semibold">Class Of Degree:</span>{" "}
//               {studentInfo.classOfDegree}
//             </p>
//           </div>
//           <div className="space-y-1 text-sm sm:text-base lg:ml-12">
//             <p>
//               <span className="font-semibold">Session of Entry:</span>{" "}
//               {studentInfo.entrySession}
//             </p>
//             <p>
//               <span className="font-semibold">Session of Graduation:</span>{" "}
//               {studentInfo.graduationSession}
//             </p>
//             <p>
//               <span className="font-semibold">Mode Of Entry:</span>{" "}
//               {studentInfo.modeOfEntry}
//             </p>
//             <p>
//               <span className="font-semibold">Sex:</span> {studentInfo.sex}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Academic Record Table */}
//       <div className="overflow-x-auto shadow-2xl border border-[#E0E0E0] rounded-2xl relative">
//         {/* Watermark */}
//         <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-20">
//           <div
//             style={{ color: "#00262D", opacity: 0.05 }}
//             className="font-bold whitespace-nowrap transform -rotate-14 select-none leading-none"
//           >
//             <span
//               className="block text-center"
//               style={{ fontSize: "clamp(28px, 3.5vw, 90px)", lineHeight: 1 }}
//             >
//               CONFIDENTIAL STUDENT COPY
//             </span>
//           </div>
//         </div>
//         <table className="w-full border-collapse border border-[#E0E0E0] rounded-lg overflow-hidden shadow-[0px_3px_18px_0px_#04BF680D] relative z-10 bg-white bg-opacity-50">
//           <thead className="bg-tms-theader border border-tms-gray-5">
//             <tr>
//               <th className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm first:rounded-tl-lg whitespace-nowrap">
//                 Course Code
//               </th>
//               <th className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm">
//                 Course Title
//               </th>
//               <th className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center font-semibold text-xs sm:text-sm whitespace-nowrap">
//                 Course Unit
//               </th>
//               <th className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center font-semibold text-xs sm:text-sm whitespace-nowrap">
//                 Grade Point
//               </th>
//               <th className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center font-semibold text-xs sm:text-sm">
//                 Grade
//               </th>
//               <th className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center font-semibold text-xs sm:text-sm whitespace-nowrap last:rounded-tr-lg">
//                 Total Point
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {courses.map((course, index) => (
//               <tr
//                 key={index}
//                 className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//               >
//                 <td className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
//                   {course.code}
//                 </td>
//                 <td className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-xs sm:text-sm">
//                   {course.title}
//                 </td>
//                 <td className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
//                   {course.unit}
//                 </td>
//                 <td className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
//                   {course.gradePoint}
//                 </td>
//                 <td className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
//                   {course.grade}
//                 </td>
//                 <td className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
//                   {course.totalPoint}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot className="bg-tms-theader border border-tms-gray-5">
//             <tr>
//               <td
//                 colSpan="2"
//                 className="border border-[#E0E0E0] px-2 sm:px-4 py-2 font-semibold text-left text-xs sm:text-sm first:rounded-bl-lg"
//               >
//                 Semester Summary
//               </td>
//               <td className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center font-semibold text-xs sm:text-sm">
//                 10
//               </td>
//               <td className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
//                 GPA
//               </td>
//               <td className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
//                 4.89
//               </td>
//               <td className="border border-[#E0E0E0] px-2 sm:px-4 py-2 text-center font-semibold text-xs sm:text-sm last:rounded-br-lg">
//                 37
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>

//       {/* Overall Summary Section */}
//       {/* <div className="mt-6 sm:mt-8 text-right text-sm sm:text-base">
//         <p className="mb-1">
//           <span className="font-semibold">Total Units:</span> 10
//         </p>
//         <p className="mb-1">
//           <span className="font-semibold">Total Points:</span> 37
//         </p>
//         <p>
//           <span className="font-semibold">Cumulative GPA:</span> 3.7
//         </p>
//       </div> */}
//     </div>
//   );
// };

// export default MyTranscript;

