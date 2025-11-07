'use client';

import StatCard from '@/components/ui/StatCard';
import Table from '@/components/ui/Table';
import AnalyticsLineCard from '@/components/ui/AnalyticsLineCard';
import AnalyticsProgressCard from '@/components/ui/AnalyticsProgressCard';
import AnalyticsRecentCard from '@/components/ui/AnalyticsRecentCard';
import { RiFileList3Line } from 'react-icons/ri';
import { BsCheckCircle, BsPeople } from 'react-icons/bs';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';

const Dashboard = () => {
  const stats = [
    {
      icon: <HiOutlineDocumentDuplicate className="h-6 w-6 text-blue-600" />,
      value: '850',
      label: 'Total Requests',
      iconBgColor: 'bg-blue-100',
    },
    {
      icon: <BsCheckCircle className="h-6 w-6 text-yellow-600" />,
      value: '2300',
      label: 'Processing',
      iconBgColor: 'bg-yellow-100',
    },
    {
      icon: <RiFileList3Line className="h-6 w-6 text-green-600" />,
      value: '560',
      label: 'Completed',
      iconBgColor: 'bg-green-100',
    },
    {
      icon: <BsPeople className="h-6 w-6 text-purple-600" />,
      value: '1,600',
      label: 'Total Users',
      iconBgColor: 'bg-purple-100',
    },
  ];

  const tableHeaders = ['Request ID', 'Student', 'Type', 'Date', 'Status', 'Action'];
  const tableRows = [
    {
      id: 'ECE-180',
      student: 'Benjamin Davies',
      type: 'Course Delivery',
      date: 'Mar 4, 2023',
      status: 'Approved',
      action: 'View',
    },
    {
      id: '#7012DAC',
      student: 'John Doe Chika',
      type: 'Digital Delivery',
      date: 'Mar 4, 2023',
      status: 'Approved',
      action: 'View',
    },
    {
      id: '#7012DAC',
      student: 'Ijeoma Bonnie',
      type: 'Digital Delivery',
      date: 'Mar 4, 2023',
      status: 'Declined',
      action: 'View',
    },
    {
      id: '#7012DAC',
      student: 'Abbas Lois',
      type: 'Digital Delivery',
      date: 'Mar 4, 2023',
      status: 'Pending',
      action: 'View',
    },
  ];

  const handleActionClick = (row) => {
    console.log('Action clicked for row:', row);
  };

  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
  ];

  const recentActivities = [
    { text: 'New request from Benjamin Davies', color: 'bg-blue-500' },
    { text: 'Request approved for John Doe', color: 'bg-green-500' },
    { text: 'Transcript delivered to UNILAG', color: 'bg-yellow-500' },
    { text: 'Payment received from Abbas Lois', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Summary of Transcript Operations for UNILAG
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Requests Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Request Overview</h2>
          <button className="rounded-lg bg-tms-lightGreen px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            View All
          </button>
        </div>
        <Table
          headers={tableHeaders}
          rows={tableRows}
          onActionClick={handleActionClick}
        />
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AnalyticsLineCard 
          title="Monthly Request Analytics" 
          data={chartData} 
        />
        <AnalyticsRecentCard 
          title="Recent Activities" 
          activities={recentActivities} 
        />
        <div className="bg-white rounded-lg p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Processing Rate</h3>
          <AnalyticsProgressCard 
            percentage={75} 
            showDonut={true}
            size="large"
            showLegend={true}
            color="#4F46E5"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;