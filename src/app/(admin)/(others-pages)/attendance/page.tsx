'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import attendanceService from '@/lib/api/attendance.service';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import { Attendance } from '@/types';
import { format } from 'date-fns';

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch today's status
  const { data: todayStatus } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: () => attendanceService.getTodayStatus(),
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch attendance history
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['my-attendance', currentPage],
    queryFn: () => attendanceService.getMyAttendance(currentPage),
  });

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: () => attendanceService.checkIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] });
      alert('Checked in successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to check in');
    },
  });

  // Check-out mutation
  const checkOutMutation = useMutation({
    mutationFn: () => attendanceService.checkOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] });
      alert('Checked out successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to check out');
    },
  });

  const formatTime = (time: string | null) => {
    if (!time) return '-';
    return format(new Date(`2000-01-01T${time}`), 'hh:mm a');
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      present: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      half_day: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      absent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colors[status as keyof typeof colors] || ''}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Attendance" />

      {/* Check-in/Check-out Section */}
      <div className="mb-6 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <h2 className="mb-4 text-2xl font-semibold text-dark dark:text-white">
          Today's Attendance
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="mb-2 text-sm text-dark-5 dark:text-dark-6">Check-in Time</p>
            <p className="text-2xl font-bold text-dark dark:text-white">
              {todayStatus?.attendance?.check_in ? formatTime(todayStatus.attendance.check_in) : '-'}
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm text-dark-5 dark:text-dark-6">Check-out Time</p>
            <p className="text-2xl font-bold text-dark dark:text-white">
              {todayStatus?.attendance?.check_out ? formatTime(todayStatus.attendance.check_out) : '-'}
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm text-dark-5 dark:text-dark-6">Total Hours</p>
            <p className="text-2xl font-bold text-dark dark:text-white">
              {todayStatus?.attendance?.total_hours ? formatMinutes(todayStatus.attendance.total_hours) : '-'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => checkInMutation.mutate()}
            disabled={!todayStatus?.can_check_in || checkInMutation.isPending}
            className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkInMutation.isPending ? 'Checking in...' : 'Check In'}
          </button>

          <button
            onClick={() => checkOutMutation.mutate()}
            disabled={!todayStatus?.can_check_out || checkOutMutation.isPending}
            className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkOutMutation.isPending ? 'Checking out...' : 'Check Out'}
          </button>
        </div>
      </div>

      {/* Statistics */}
      {attendanceData?.stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-dark-3 dark:bg-gray-dark">
            <p className="text-sm text-dark-5 dark:text-dark-6">Total Days</p>
            <p className="text-2xl font-bold text-dark dark:text-white">{attendanceData.stats.total_days}</p>
          </div>

          <div className="rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-dark-3 dark:bg-gray-dark">
            <p className="text-sm text-dark-5 dark:text-dark-6">Present</p>
            <p className="text-2xl font-bold text-green-500">{attendanceData.stats.present_days}</p>
          </div>

          <div className="rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-dark-3 dark:bg-gray-dark">
            <p className="text-sm text-dark-5 dark:text-dark-6">Late</p>
            <p className="text-2xl font-bold text-yellow-500">{attendanceData.stats.late_days}</p>
          </div>

          <div className="rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-dark-3 dark:bg-gray-dark">
            <p className="text-sm text-dark-5 dark:text-dark-6">Half Day</p>
            <p className="text-2xl font-bold text-blue-500">{attendanceData.stats.half_days}</p>
          </div>

          <div className="rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-dark-3 dark:bg-gray-dark">
            <p className="text-sm text-dark-5 dark:text-dark-6">Total Hours</p>
            <p className="text-2xl font-bold text-primary">{formatMinutes(attendanceData.stats.total_hours)}</p>
          </div>
        </div>
      )}

      {/* Attendance History Table */}
      <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-dark dark:text-white">
            Attendance History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-dark-2">
                <th className="px-4 py-4 font-medium text-dark dark:text-white">Date</th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">Check In</th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">Check Out</th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">Hours</th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : attendanceData?.attendances.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-dark-5 dark:text-dark-6">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendanceData?.attendances.data.map((attendance: Attendance) => (
                  <tr key={attendance.id} className="border-b border-stroke dark:border-dark-3">
                    <td className="px-4 py-4">{format(new Date(attendance.date), 'MMM dd, yyyy')}</td>
                    <td className="px-4 py-4">{formatTime(attendance.check_in)}</td>
                    <td className="px-4 py-4">{formatTime(attendance.check_out)}</td>
                    <td className="px-4 py-4">{formatMinutes(attendance.total_hours)}</td>
                    <td className="px-4 py-4">{getStatusBadge(attendance.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {attendanceData && attendanceData.attendances.last_page > 1 && (
          <div className="flex items-center justify-between p-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-dark-5 dark:text-dark-6">
              Page {currentPage} of {attendanceData.attendances.last_page}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(attendanceData.attendances.last_page, prev + 1))}
              disabled={currentPage === attendanceData.attendances.last_page}
              className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}