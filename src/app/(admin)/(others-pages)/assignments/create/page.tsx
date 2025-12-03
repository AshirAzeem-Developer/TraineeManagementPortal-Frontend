'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import assignmentService from '@/lib/api/assignment.service';
import { toast } from 'react-hot-toast';
import curriculumService from '@/lib/api/curriculum.service';
import batchService from '@/lib/api/batch.service';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [weeks, setWeeks] = useState<any[]>([]);
  const [days, setDays] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);


  type AssignmentType = "mini_task" | "project" | "quiz" | "reading";
  type Difficulty = "beginner" | "intermediate" | "advanced";
  
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    resources: [''],
    type: "mini_task" as AssignmentType,
      difficulty: "beginner" as Difficulty, 
    max_score: 100,
    due_date: '',
    week_id: '',
    day_id: '',
    batch_id: '',
    is_published: true,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.week_id) {
      loadDays(Number(formData.week_id));
    }
  }, [formData.week_id]);

  const loadInitialData = async () => {
    try {
     const weeksData = await curriculumService.getWeeks();
    const batchesData = await batchService.getAllBatches();
     setWeeks(weeksData);
    setBatches(batchesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const loadDays = async (weekId: number) => {
    try {
      const daysData = await curriculumService.getDays(weekId);
    setDays(daysData);
    } catch (error) {
      console.error('Failed to load days:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleArrayChange = (index: number, value: string, field: 'requirements' | 'resources') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field: 'requirements' | 'resources') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayField = (index: number, field: 'requirements' | 'resources') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    try {
      setLoading(true);
      
      // Filter out empty requirements and resources
      const cleanedData = {
        ...formData,
         type: formData.type as AssignmentType,
          difficulty: formData.difficulty as Difficulty, 
        requirements: formData.requirements.filter(r => r.trim()),
        resources: formData.resources.filter(r => r.trim()),
        week_id: formData.week_id ? Number(formData.week_id) : null,
        day_id: formData.day_id ? Number(formData.day_id) : null,
        batch_id: formData.batch_id ? Number(formData.batch_id) : null,
      };

      await assignmentService.createAssignment(cleanedData);
      toast.success('Assignment created successfully!');
      router.push('/assignments');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Assignment</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Fill in the details to create a new assignment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="mini_task">Mini Task</option>
                <option value="project">Project</option>
                <option value="quiz">Quiz</option>
                <option value="reading">Reading</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Score
              </label>
              <input
                type="number"
                name="max_score"
                value={formData.max_score}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Assignment Mapping */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Assignment Mapping</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Week (Optional)
              </label>
              <select
                name="week_id"
                value={formData.week_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Week</option>
                {weeks.map(week => (
                  <option key={week.id} value={week.id}>
                    Week {week.week_number}: {week.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Day (Optional)
              </label>
              <select
                name="day_id"
                value={formData.day_id}
                onChange={handleInputChange}
                disabled={!formData.week_id}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white disabled:opacity-50"
              >
                <option value="">Select Day</option>
                {days.map(day => (
                  <option key={day.id} value={day.id}>
                    Day {day.day_number}: {day.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Batch (Optional)
              </label>
              <select
                name="batch_id"
                value={formData.batch_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Batches</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date (Optional)
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Requirements</h2>
            <button
              type="button"
              onClick={() => addArrayField('requirements')}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Add Requirement
            </button>
          </div>
          
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                placeholder="Enter requirement"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'requirements')}
                  className="px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Resources */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resources</h2>
            <button
              type="button"
              onClick={() => addArrayField('resources')}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Add Resource
            </button>
          </div>
          
          {formData.resources.map((res, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={res}
                onChange={(e) => handleArrayChange(index, e.target.value, 'resources')}
                placeholder="Enter resource URL or description"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              {formData.resources.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'resources')}
                  className="px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Publish Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Publish immediately
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Assignment'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}