import { createLazyFileRoute } from '@tanstack/react-router';
import { fetchreports, fetchAdminDashboardData } from '../services/api/report';
import { useState, useEffect } from 'react';
import { Pie, Bubble } from 'react-chartjs-2';
import { Chart, Tooltip, Legend, LinearScale, ArcElement, PointElement, CategoryScale } from 'chart.js';
import UserName from '../components/UserName';
import SideBar from '../components/SideBar';

Chart.register(Tooltip, Legend, LinearScale, ArcElement, PointElement, CategoryScale);

const Reports = () => {
  const user = localStorage.getItem('user');
  const userData = JSON.parse(user || '{}');
  
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(true);
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const result: ReportData = await fetchreports();
        setReportData(result);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsReportLoading(false);
      }
    };

    fetchReportData();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result: DashboardData = await fetchAdminDashboardData();
        setDashboardData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isReportLoading || isDashboardLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-green-100">
        <div className="rounded-full h-20 w-20 bg-teal-400 animate-ping"></div>
      </div>
    );
  }

  const workflowStatusCounts = dashboardData?.workflowStatusCounts || [];
  const approvedCount = workflowStatusCounts.find(item => item.status === 'Approved')?.count || 0;
  const rejectedCount = workflowStatusCounts.find(item => item.status === 'Rejected')?.count || 0;

  const workflowTemplateData = reportData?.workflowTemplateUsage || [];
  const templateLabels = workflowTemplateData.map(item => item.template);
  const templateCounts = workflowTemplateData.map(item => item.count);

  const workflowTemplateBubbleData = {
    labels: templateLabels,
    datasets: [
      {
        label: 'Workflow Template Usage',
        data: templateCounts.map((count, index) => ({
          x: index, // Position bubbles linearly on the x-axis
          y: count, // y value represents the count
          r: count*10 // Radius of bubble proportional to count, use square root to scale down
        })),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'], // Use different colors
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }
    ] 
  };

  const workflowStatusPieData = {
    labels: ['Approved', 'Rejected'],
    datasets: [
      {
        label: 'Workflow Status',
        data: [approvedCount, rejectedCount],
        backgroundColor: ['#4CB7E3', '#fc3468'],
        hoverBackgroundColor: ['#A3E4D7', '#F1948A']
      }
    ]
  };

  const workflowCreationData = reportData?.workflowCreationTimeline || [];
  const allMonths = [...new Set(workflowCreationData.map(item => item.month))];

  const creationCountsByMonth = allMonths.map(month => {
    const countData = workflowCreationData.find(item => item.month === month);
    return countData ? countData.count : 0;
  });

  const workflowCreationPieData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Workflow Creation Timeline',
        data: creationCountsByMonth,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      }
    ]
  };

  const documentTemplateData = reportData?.documentTemplateUsage || [];
  const documentLabels = documentTemplateData.map(item => item.template);
  const documentCounts = documentTemplateData.map(item => item.count);

  const documentTemplatePieData = {
    labels: documentLabels,
    datasets: [
      {
        label: 'Document Template Usage',
        data: documentCounts,
        backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#FF5722'],
        hoverBackgroundColor: ['#81C784', '#FFD54F', '#64B5F6', '#FF8A65']
      }
    ] 
  };

  return (
    <div className="mt-20 ml-72 mr-16">
      <UserName />
      <div className="fixed top-0 bottom-0 left-0">
        <SideBar />
      </div>
      <div className="header flex justify-between">
        <div className="flex flex-col">
          <h1 className="font-raleway font-bold text-purple-900 text-4xl leading-10">
            Hello, {userData.username}
          </h1>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-5 mt-8">
        <div className='font-semibold flex flex-col items-center w-72 h-44 rounded-md gap-4 border border-gray-200 shadow-md hover:shadow-lg transition duration-300 ease-in-out py-4 px-6'>
        <Pie data={workflowCreationPieData} />
        </div>

        <div className='font-semibold flex flex-col items-center w-72 h-44 rounded-md gap-4 border border-gray-200 shadow-md hover:shadow-lg transition duration-300 ease-in-out py-4 px-6'>
          <Pie data={workflowStatusPieData} />
        </div>

        <div className='font-semibold flex flex-col items-center w-72 h-44 rounded-md gap-4 border border-gray-200 shadow-md hover:shadow-lg transition duration-300 ease-in-out py-4 px-6'>
          <Pie data={documentTemplatePieData} />
        </div>
      </div>

      <div className="mt-8 flex gap-2 mb-4 h-60 ">
        <div className="border border-opacity-5 h-72 w-full flex flex-col gap-2 px-8 py-2 items-center justify-center">
          <h4 className="text-lg font-semibold text-purple-900">Workflow creation timeline</h4>
          

          <Bubble data={workflowTemplateBubbleData} options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    const dataIndex = tooltipItem.dataIndex;
                    return `${templateLabels[dataIndex]}: ${templateCounts[dataIndex]}`;
                  }
                }
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/report')({
  component: Reports,
});