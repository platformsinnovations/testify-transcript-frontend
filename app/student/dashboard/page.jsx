"use client";

import StatCard from "@/components/ui/StatCard";
import Table from "@/components/ui/Table";
import { MdPending } from "react-icons/md";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { FaMoneyBill, FaRegClock } from "react-icons/fa";
import AnalyticsProgressCard from "@/components/ui/AnalyticsProgressCard";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { MdOutlineEmail } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import Image from "next/image";

const StudentDashboard = () => {
  const stats = [
    {
      icon: <FaRegClock className="h-6 w-6 text-[#D39723] font-bold" />,
      value: "15",
      label: "In-Progress Distribution",
      iconBgColor: "bg-[#FFF0D4]",
    },
    {
      icon: <HiOutlineSquare3Stack3D className="h-6 w-6 text-[#219ACA]" />,
      value: "15",
      label: "Approved",
      iconBgColor: "bg-[#D4F1FC]",
    },
    {
      icon: <MdOutlineEmail className="h-6 w-6 text-tms-testimonial-green" />,
      value: "03",
      label: "Delivered",
      iconBgColor: "bg-[#EEFBF5]",
    },
    {
      icon: <FaArrowTrendUp className="h-6 w-6 text-[#C93838]" />,
      value: "N20K",
      label: "Total Amount Spent",
      iconBgColor: "bg-[#FBEFEF]",
    },
  ];

  const tableHeaders = ["Request ID", "Type", "Date", "Status", "Action"];
  const tableRows = [
    {
      id: "ECE-180",
      type: "Digital Copy",
      date: "Dec 14, 2023",
      status: "Approved",
      action: "View",
    },
    {
      id: "#7012DAC",
      type: "Physical Copy",
      date: "Dec 14, 2023",
      status: "Approved",
      action: "View",
    },
    {
      id: "#7012DAC",
      type: "Digital Copy",
      date: "Dec 14, 2023",
      status: "Declined",
      action: "View",
    },
    {
      id: "#7012DAC",
      type: "Digital Copy",
      date: "Dec 14, 2023",
      status: "Pending",
      action: "View",
    },
  ];

  const handleActionClick = (row) => {
    console.log("Action clicked for row:", row);
  };

  return (
    <div className="space-y-6">
      {/* HERO / BANNER */}
      <div className="relative">
        <div className="bg-tms-landing-sky h-36 w-full rounded-2xl overflow-hidden px-6 py-8 md:py-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="w-full md:text-2xl sm:text-3xl font-extrabold text-white">
                Transcript Portal
              </h1>
            </div>

            {/* Decorative image: hidden on small screens to avoid overflow. Wrapper is relative + overflow-hidden so the image can't cause page scroll. */}
            <div className="hidden md:block shrink-0 w-40 md:w-64 lg:w-80 relative overflow-hidden">
              <Image
                src="/universityTranscript/studentDashboardAsset.svg"
                alt="Student graduate"
                width={480}
                height={320}
                // positioned to the right but clipped by the wrapper
                className={`absolute bottom-0 right-0 w-[180%] h-auto object-contain z-0`}
                priority
              />
            </div>
          </div>
        </div>

        {/* STATS GRID - placed below the hero with negative margin so it overlaps nicely */}
        <div className="max-w-7xl mx-auto -mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 relative z-20">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* TWO COLUMN LAYOUT FOR TABLE AND ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN - Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Distribution Overview
            </h2>
            <button className="rounded-lg bg-tms-lightGreen px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              Request New Transcript
            </button>
          </div>
          <div className="bg-white rounded-lg">
            <Table
              headers={tableHeaders}
              rows={tableRows}
              onActionClick={handleActionClick}
            />
          </div>
        </div>

        {/* RIGHT COLUMN - Activities and Chart */}
        <div className="lg:col-span-4 space-y-6">
          {/* ANALYTICS PROGRESS CHART */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Request Distribution
            </h3>
            <div className="flex justify-center">
              <AnalyticsProgressCard
                percentage={45}
                color="#4F46E5"
                showDonut={true}
                size="large"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">Declined</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600">Processing</span>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITIES SECTION */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Recent Activities
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">
                  New transcript request submitted
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">
                  Transcript request approved
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600">
                  Transcript ready for collection
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
