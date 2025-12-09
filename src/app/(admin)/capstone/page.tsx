'use client';

import React, { useEffect, useState } from 'react';
import assignmentService from '@/lib/api/assignment.service';
import { useAuthStore } from '@/store/authStore';
import { Button, Input, Textarea, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

const CapstonePage = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [capstone, setCapstone] = useState<any>(null);
    const [submission, setSubmission] = useState<any>(null);

    // Form Stats
    const [formData, setFormData] = useState({
        github_url: '',
        live_url: '',
        notes: '',
        file: null as File | null
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchCapstone = async () => {
            try {
                const assignments = await assignmentService.getMyAssignments();
                const capstoneAssignment = assignments.find((a: any) => a.type === 'capstone');
                
                if (capstoneAssignment) {
                    setCapstone(capstoneAssignment);
                    if (capstoneAssignment.my_submission) {
                        setSubmission(capstoneAssignment.my_submission);
                        setFormData({
                            github_url: capstoneAssignment.my_submission.github_url || '',
                            live_url: capstoneAssignment.my_submission.live_url || '',
                            notes: capstoneAssignment.my_submission.notes || '',
                            file: null
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch capstone", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role) {
            fetchCapstone();
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!capstone) return;

        setSubmitting(true);
        const data = new FormData();
        if (formData.github_url) data.append('github_url', formData.github_url);
        if (formData.live_url) data.append('live_url', formData.live_url);
        if (formData.notes) data.append('notes', formData.notes);
        if (formData.file) data.append('file', formData.file);

        try {
            if (submission && submission.status === 'resubmit') {
                 await assignmentService.resubmitAssignment(submission.id, data);
                 toast.success('Capstone resubmitted successfully!');
            } else if (!submission) {
                 await assignmentService.submitAssignment(capstone.id, data);
                 toast.success('Capstone submitted successfully!');
            } else {
                 toast.error('You have already submitted this project.');
                 return;
            }
            
            // Refresh
            const updatedAssignments = await assignmentService.getMyAssignments();
            const updatedCapstone = updatedAssignments.find((a: any) => a.type === 'capstone');
            if(updatedCapstone) {
                setCapstone(updatedCapstone);
                setSubmission(updatedCapstone.my_submission);
            }

        } catch (error) {
            console.error(error);
            toast.error('Failed to submit capstone.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    if (!capstone && user?.role === 'trainee') {
        return (
            <div className="mx-auto max-w-270">
                <PageBreadcrumb pageTitle="Capstone Project" />
                <div className="p-10 bg-white dark:bg-boxdark rounded-sm border border-stroke shadow-default text-center">
                    <h3 className="text-xl font-semibold mb-2">No Capstone Project Assigned</h3>
                    <p className="text-gray-500">Your trainer has not assigned a Capstone Project to your batch yet.</p>
                </div>
            </div>
        );
    }
    
    // For Trainer/Admin, maybe just show a link to the assignments page or a list of submissions?
    // For now, let's focus on Trainee view as requested.
    if (user?.role !== 'trainee') {
         return (
            <div className="mx-auto max-w-270">
                <PageBreadcrumb pageTitle="Capstone Project" />
                <div className="p-10 bg-white dark:bg-boxdark rounded-sm border border-stroke shadow-default">
                    <h3 className="text-xl font-semibold mb-2">Capstone Management</h3>
                    <p className="mb-4">As a trainer, you can manage the Capstone project from the Assignments page.</p>
                     <Link href="/assignments" className="text-primary hover:underline">
                        Go to Assignments
                    </Link>
                </div>
            </div>
        );
    }

    const isSubmitted = submission && submission.status !== 'resubmit';
    const isGraded = submission && submission.status === 'graded';

    return (
        <div className="mx-auto max-w-270">
            <PageBreadcrumb pageTitle="Capstone Project" />

            <div className="grid grid-cols-1 gap-9">
                <div className="flex flex-col gap-9">
                    {/* Project Details */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                {capstone.title}
                            </h3>
                        </div>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white font-semibold">
                                    Description
                                </label>
                                <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                    {capstone.description}
                                </div>
                            </div>
                           {/* Add Resources/Requirements display here if needed */}
                        </div>
                    </div>

                    {/* Submission Form / Status */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                {isSubmitted ? 'Submission Status' : 'Submit Project'}
                            </h3>
                        </div>
                        
                        {isSubmitted ? (
                            <div className="p-6.5">
                                <div className={`mb-6 p-4 rounded-md ${
                                    submission.status === 'graded' ? 'bg-green-100 text-green-700' : 
                                    submission.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    <strong>Status: {submission.status.toUpperCase()}</strong>
                                    {submission.score !== null && (
                                        <div className="mt-2 text-lg">
                                            Score: <strong>{submission.score} / {capstone.max_score}</strong>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub URL</label>
                                        <a href={submission.github_url} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block">
                                            {submission.github_url || 'N/A'}
                                        </a>
                                     </div>
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Live Deployment URL</label>
                                        <a href={submission.live_url} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block">
                                            {submission.live_url || 'N/A'}
                                        </a>
                                     </div>
                                </div>
                                
                                {submission.feedback && (
                                    <div className="mt-4 p-4 bg-gray-50 dark:bg-meta-4 rounded-md">
                                        <h4 className="font-semibold mb-2">Feedback:</h4>
                                        <p>{submission.feedback}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        GitHub Repository URL <span className="text-meta-1">*</span>
                                    </label>
                                    <Input
                                        type="url"
                                        placeholder="https://github.com/username/project"
                                        value={formData.github_url}
                                        onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                                        required
                                        className="w-full"
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Live Deployment URL
                                    </label>
                                    <Input
                                        type="url"
                                        placeholder="https://my-project.vercel.app"
                                        value={formData.live_url}
                                        onChange={(e) => setFormData({...formData, live_url: e.target.value})}
                                        className="w-full"
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Project Notes / Documentation
                                    </label>
                                    <Textarea
                                        placeholder="Add any additional notes for the reviewer..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        className="w-full"
                                    />
                                </div>

                                <div className="mb-5.5">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                        Project Report / Assets (Zip/PDF)
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Capstone Project'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CapstonePage;
