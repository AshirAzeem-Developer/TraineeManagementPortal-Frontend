'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@heroui/react';
import assignmentService from '@/lib/api/assignment.service';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CertificateTemplate from '@/components/Certificate/CertificateTemplate';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const CertificatePage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [completionDate, setCompletionDate] = useState('');
  
  // Ref for the certificate component
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const assignments = await assignmentService.getMyAssignments();
        // Find capstone assignment
        const capstone = assignments.find((a: any) => a.type === 'capstone');

        if (!capstone) {
          setMessage('No Capstone Project found in your curriculum yet.');
          setEligible(false);
        } else if (!capstone.my_submission) {
          setMessage('You have not submitted your Capstone Project yet.');
          setEligible(false);
        } else if (capstone.my_submission.status !== 'graded') {
          setMessage('Your Capstone Project is currently under review.');
          setEligible(false);
        } else {
          // Check score - assuming 100 max score, passing is 70%
          const percentage = ((capstone.my_submission.score ?? 0) / capstone.max_score) * 100;
          setScore(percentage);
          
          if (percentage >= 70) {
            setEligible(true);
            setMessage('Congratulations! You have successfully completed the training program.');
            // Format date: "December 09, 2025"
            const date = new Date(capstone.my_submission.graded_at || new Date());
            setCompletionDate(date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            }));
          } else {
            setMessage(`Your Capstone Project score (${percentage.toFixed(1)}%) is below the passing threshold (70%).`);
            setEligible(false);
          }
        }
      } catch (error) {
        console.error('Error checking eligibility:', error);
        setMessage('Failed to load status. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'trainee') {
      checkEligibility();
    }
  }, [user]);

  const handleDownload = async () => {
    console.log('Download initiated');
    if (!certificateRef.current) {
        console.error('Certificate ref is null');
        toast.error('Certificate element not found');
        return;
    }

    const toastId = toast.loading('Generating Certificate...');

    try {
      console.log('Certificate ref found, starting html2canvas...');
      const element = certificateRef.current;
      
      // Improve quality
      const canvas = await html2canvas(element, {
        scale: 3, // Even higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#1a1b2e',
        width: 1123,
        height: 794,
        windowWidth: 1920,
        windowHeight: 1080,
        logging: true,
        onclone: (clonedDoc) => {
            console.log('DOM cloned for capture');
            // Ensure the cloned element is visible
            const clonedElement = clonedDoc.body.getElementsByClassName('certificate-container')[0] as HTMLElement;
           if (clonedElement) {
             clonedElement.style.display = 'block';
           }
        }
      });
      
      if (!canvas) throw new Error('Canvas generation failed');
      
      console.log('Canvas generated', canvas.width, canvas.height);

      const imgData = canvas.toDataURL('image/png');
      console.log('Image data generated length:', imgData.length);
      
      // A4 Landscape dimensions in mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${user?.name.replace(/\s+/g, '_')}_Certificate.pdf`);
      console.log('PDF saved');
      
      toast.success('Certificate downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Download error details:', error);
      toast.error('Failed to generate certificate. Check console.', { id: toastId });
    }
  };

  if (user?.role !== 'trainee') {
    return (
        <div className="flex flex-col gap-10">
            <PageBreadcrumb pageTitle="Certificate" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-10 text-center">
                <h3 className="font-medium text-black dark:text-white">
                Certificates are only available for Trainees.
                </h3>
            </div>
        </div>
    );
  }

  return (
      <div className="mx-auto max-w-[1200px]">
        <PageBreadcrumb pageTitle="Certificate" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
          <div className="flex flex-col items-center justify-center space-y-8 py-8">
            
            <div className="text-center max-w-lg mb-4">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                    {eligible ? 'Course Completion Certificate' : 'Certificate Locked'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {loading ? 'Checking eligibility...' : message}
                </p>
            </div>

            {eligible && (
                <>
                    {/* Certificate Preview Wrapper */}
                    <div className="w-full overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
                        <CertificateTemplate 
                            ref={certificateRef}
                            recipientName={user?.name || 'Trainee Name'}
                            date={completionDate}
                            courseName="Full Stack Web Development" // Can be dynamic if needed
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button 
                        size="lg"
                        className="text-white font-medium px-8 bg-green-500"
                        onPress={handleDownload}
                    >
                        Download Certificate (PDF)
                    </Button>
                    </div>
                </>
            )}

            {!eligible && !loading && (
                 <div className="p-10 rounded-full bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500">
                    <svg
                        className="w-24 h-24"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                 </div>
            )}
           
          </div>
        </div>
      </div>
  );
};

export default CertificatePage;
