'use client';
import { Select, SelectItem } from "@heroui/react";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { reportService, MonthlyReportData } from '@/lib/api/report.service';
import traineeService, { Trainee } from '@/lib/api/trainee.service';
import ReportSummaryCard from '@/components/reports/ReportSummaryCard';
import AIInsightsPanel from '@/components/reports/AIInsightsPanel';
import toast from 'react-hot-toast';

const MONTHS = [
  { id: '1', name: 'January' },
  { id: '2', name: 'February' },
  { id: '3', name: 'March' },
  { id: '4', name: 'April' },
  { id: '5', name: 'May' },
  { id: '6', name: 'June' },
  { id: '7', name: 'July' },
  { id: '8', name: 'August' },
  { id: '9', name: 'September' },
  { id: '10', name: 'October' },
  { id: '11', name: 'November' },
  { id: '12', name: 'December' },
];

export default function MonthlyReportPage() {
  const { user } = useAuthStore();
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [selectedTraineeId, setSelectedTraineeId] = useState<string>('');
  const [reportData, setReportData] = useState<MonthlyReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Default to current month
    setSelectedMonth((new Date().getMonth() + 1).toString());

    if (user && (user.role === 'admin' || user.role === 'trainer')) {
      fetchTrainees();
    } else if (user && user.role === 'trainee') {
      setSelectedTraineeId(user.id.toString());
    }
  }, [user]);

  useEffect(() => {
    if (selectedMonth && selectedTraineeId) {
      fetchReport(parseInt(selectedMonth), parseInt(selectedTraineeId));
    }
  }, [selectedMonth, selectedTraineeId, selectedYear]);

  const fetchTrainees = async () => {
    try {
      const data = await traineeService.getAllTrainees();
      setTrainees(data);
    } catch (error) {
      console.error('Failed to fetch trainees', error);
      toast.error('Failed to load trainees');
    }
  };

  const fetchReport = async (monthId: number, traineeId: number) => {
    setLoading(true);
    try {
      const data = await reportService.getMonthlyReport(traineeId, monthId, selectedYear);
      console.log('Fetched monthly report data:', data);
      setReportData(data);
    } catch (error) {
      console.error('Failed to fetch report', error);
      toast.error('Failed to load report data');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedTraineeId || !selectedMonth) return;
    setDownloading(true);
    try {
      const blob = await reportService.downloadMonthlyPdf(parseInt(selectedTraineeId), parseInt(selectedMonth), selectedYear);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Monthly_Report_${MONTHS.find(m => m.id == selectedMonth)?.name}_${selectedYear}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download PDF', error);
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-black text-3xl font-bold tracking-tight text-gray-900 dark:text-white mt-2">
            Monthly Performance Report
          </h2>
          <p className="text-black dark:text-white">
            See monthly performance report of trainees.
          </p>
        </div>
        
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Select Month
            </label>
            <Select
              className="w-48"
              placeholder="Choose a month"
              selectedKeys={selectedMonth ? [selectedMonth] : []}
              onChange={(e) => setSelectedMonth(e.target.value)}
              startContent={
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              classNames={{
                popoverContent: "bg-white dark:bg-gray-800",
                trigger: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-[#24a556] focus:border-[#24a556]",
                selectorIcon: "right-3"
              }}
            >
              {MONTHS.map((month) => (
                <SelectItem key={month.id}>
                  {month.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          {(user?.role === 'admin' || user?.role === 'trainer') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Select Trainee
              </label>
              <Select
                className="w-48"
                placeholder="Choose a trainee"
                selectedKeys={selectedTraineeId ? [selectedTraineeId] : []}
                onChange={(e) => setSelectedTraineeId(e.target.value)}
                startContent={
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                classNames={{
                  popoverContent: "bg-white dark:bg-gray-800",
                  trigger: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-[#24a556] focus:border-[#24a556]",
                  selectorIcon: "right-3"
                }}
              >
                {trainees.map((trainee) => (
                  <SelectItem key={trainee.id}>
                    {trainee.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={!reportData || downloading}
            className="bg-[#24a556] hover:bg-[#1d8a47] text-white inline-flex items-center justify-center gap-2.5 rounded-lg px-6 py-2.5 text-center font-medium shadow-lg shadow-[#24a556]/30 disabled:opacity-50 disabled:cursor-not-allowed h-10"
          >
            {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <ReportSummaryCard
              title="Overall Score"
              value={`${reportData.overall_score}%`}
              color="purple"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 11-4.5 0v12" />
                </svg>
              }
            />
            <ReportSummaryCard
              title="Attendance"
              value={`${(reportData.attendance?.present || 0) + (reportData.attendance?.late || 0)} Days`}
              subtitle={`${reportData.attendance?.absent || 0} Absent, ${reportData.attendance?.late || 0} Late`}
              color="blue"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              }
            />
            <ReportSummaryCard
              title="Assignments"
              value={`${reportData.assignments?.details?.length || 0}/${reportData.assignments?.total_assignments || 0}`}
              subtitle={`Avg Score: ${reportData.assignments?.average_score || 0}%`}
              color="green"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.25 2.25 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              }
            />
          </div>

          {/* AI Insights */}
          {reportData.ai_insights && (
            <AIInsightsPanel insights={reportData.ai_insights} />
          )}

          {/* Detailed Tables */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Attendance Table */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Attendance Details
              </h4>
              <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                  <div className="p-2.5 xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Metric</h5></div>
                  <div className="p-2.5 text-center xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Value</h5></div>
                </div>
                <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                  <div className="flex items-center gap-3 p-2.5 xl:p-5"><p className="text-black dark:text-white">Present</p></div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5"><p className="text-meta-3">{(reportData.attendance?.present || 0) + (reportData.attendance?.late || 0)}</p></div>
                </div>
                <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                  <div className="flex items-center gap-3 p-2.5 xl:p-5"><p className="text-black dark:text-white">Absent</p></div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5"><p className="text-meta-1">{reportData.attendance?.absent || 0}</p></div>
                </div>
                <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
                  <div className="flex items-center gap-3 p-2.5 xl:p-5"><p className="text-black dark:text-white">Late</p></div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5"><p className="text-meta-6">{reportData.attendance?.late || 0}</p></div>
                </div>
              </div>
            </div>

            {/* Assignments Table */}
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Assignment Details
              </h4>
              <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
                  <div className="p-2.5 xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Assignment</h5></div>
                  <div className="p-2.5 text-center xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5></div>
                  <div className="p-2.5 text-center xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Score</h5></div>
                </div>
                {reportData.assignments?.details?.map((assignment: any, key: number) => (
                  <div className={`grid grid-cols-3 ${key === reportData.assignments.details.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`} key={key}>
                    <div className="flex items-center gap-3 p-2.5 xl:p-5">
                      <p className="text-black dark:text-white">{assignment.assignment_title}</p>
                    </div>
                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="text-black dark:text-white capitalize">{assignment.status}</p>
                    </div>
                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="text-meta-5">{assignment.score}/{assignment.max_score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Please select a month {user?.role !== 'trainee' ? 'and a trainee' : ''} to view the report.
          </p>
        </div>
      )}
    </div>
  );
}
