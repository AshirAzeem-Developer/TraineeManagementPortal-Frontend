'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import assignmentService from '@/lib/api/assignment.service';
import curriculumService from '@/lib/api/curriculum.service';
import batchService from '@/lib/api/batch.service';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';

export default function CreateAssignmentPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    week_id: '',
    day_id: '',
    batch_id: '',
    title: '',
    description: '',
    type: 'mini_task',
    difficulty: 'beginner',
    max_score: 100,
    due_date: '',
  });

  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState('');
  const [resources, setResources] = useState<string[]>([]);
  const [resourceInput, setResourceInput] = useState('');

  // Fetch weeks, batches
  const { data: weeks } = useQuery({
    queryKey: ['weeks'],
    queryFn: () => curriculumService.getWeeks(),
  });

  const { data: batches } = useQuery({
    queryKey: ['batches'],
    queryFn: () => batchService.getAllBatches(),
  });

  // Fetch days when week is selected
  const { data: days } = useQuery({
    queryKey: ['days', formData.week_id],
    queryFn: () => curriculumService.getDays(parseInt(formData.week_id)),
    enabled: !!formData.week_id,
  });

  // Create assignment mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => assignmentService.createAssignment(data),
    onSuccess: (assignment) => {
      alert('Assignment created successfully!');
      router.push(`/assignments/${assignment.id}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create assignment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      week_id: formData.week_id ? parseInt(formData.week_id) : null,
      day_id: formData.day_id ? parseInt(formData.day_id) : null,
      batch_id: formData.batch_id ? parseInt(formData.batch_id) : null,
      requirements: requirements.length > 0 ? requirements : null,
      resources: resources.length > 0 ? resources : null,
      is_published: true,
    };

    createMutation.mutate(data);
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addResource = () => {
    if (resourceInput.trim()) {
      setResources([...resources, resourceInput.trim()]);
      setResourceInput('');
    }
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Create Assignment" />

      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Select
              label="Week (Optional)"
              onChange={(value) => setFormData({ ...formData, week_id: value, day_id: '' })}
            options={weeks?.map((week) => ({
              value: week.id.toString(),
              label: `Week ${week.week_number} - ${week.title}`,
            })) || []}
            />
            
            

            <Select
              label="Day (Optional)"
              onChange={(value) => setFormData({ ...formData, day_id: value })}
                options={days?.map((day) => ({
                  value: day.id.toString(),
                  label: `Day ${day.day_number} - ${day.title}`,
                })) || []}
            />
              

            <Select
              label="Batch (Optional)"
              onChange={(value) => setFormData({ ...formData, batch_id: value })}
                options={[{ value: '', label: 'All Batches' }, ...(batches?.map((batch) => ({
                  value: batch.id.toString(),
                  label: batch.name,
                })) || [])]}
            />
              

            <Select
              label="Type"
         
              onChange={(value) => setFormData({ ...formData, type: value })}
            
              options={[
                { value: 'mini_task', label: 'Mini Task' },
                { value: 'project', label: 'Project' },
                { value: 'quiz', label: 'Quiz' },
                { value: 'reading', label: 'Reading' },
              ]}
            />
             

            <Select
              label="Difficulty"
        
              onChange={(value) => setFormData({ ...formData, difficulty: value })}
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced", label: "Advanced" }
              ]}
            />
             

            <InputField
              label="Max Score"
              type="number"
              value={formData.max_score.toString()}
              onChange={(e) => setFormData({ ...formData, max_score: parseInt(e.target.value) })}
              min="1"
            />

            <InputField
              label="Due Date (Optional)"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>

          <InputField
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        
            placeholder="Assignment title"
          />

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}

            placeholder="Detailed description of the assignment..."
            rows={6}
          />

          {/* Requirements */}
          <div>
            <label className="mb-2.5 block font-medium text-dark dark:text-white">
              Requirements
            </label>
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={requirementInput}
onChange={(e) => setRequirementInput(e.target.value)}
onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
className="flex-1 rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
placeholder="Enter a requirement and press Enter"
/>
<button
             type="button"
             onClick={addRequirement}
             className="rounded-lg bg-primary px-6 py-3 text-white hover:bg-opacity-90"
           >
Add
</button>
</div>
<ul className="space-y-2">
{requirements.map((req, idx) => (
<li key={idx} className="flex items-center justify-between rounded-lg bg-gray-2 px-4 py-2 dark:bg-dark-2">
<span>{req}</span>
<button
type="button"
onClick={() => removeRequirement(idx)}
className="text-red-500 hover:text-red-700"
>
Remove
</button>
</li>
))}
</ul>
</div>{/* Resources */}
      <div>
        <label className="mb-2.5 block font-medium text-dark dark:text-white">
          Resources
        </label>
        <div className="mb-4 flex gap-2">
          <input
            type="url"
            value={resourceInput}
            onChange={(e) => setResourceInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
            className="flex-1 rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            placeholder="Enter a resource URL and press Enter"
          />
          <button
            type="button"
            onClick={addResource}
            className="rounded-lg bg-primary px-6 py-3 text-white hover:bg-opacity-90"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {resources.map((resource, idx) => (
            <li key={idx} className="flex items-center justify-between rounded-lg bg-gray-2 px-4 py-2 dark:bg-dark-2">
              <a href={resource} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {resource}
              </a>
              <button
                type="button"
                onClick={() => removeResource(idx)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-stroke px-6 py-3 font-medium hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Assignment'}
        </button>
      </div>
    </form>
  </div>
</div>);
}