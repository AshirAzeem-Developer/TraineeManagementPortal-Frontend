'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import profileService from '@/lib/api/profile.service';
import batchService from '@/lib/api/batch.service';
import { TraineeProfile, Batch } from '@/types';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<TraineeProfile>>({
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    date_of_birth: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    highest_education: '',
    institution: '',
    field_of_study: '',
    graduation_year: undefined,
    skills: [],
    bio: '',
    batch_id: undefined,
  });

  const [skillInput, setSkillInput] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Fetch profile
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => profileService.getMyProfile(),
    enabled: !!user,
  });

  // Fetch batches
  const { data: batches } = useQuery({
    queryKey: ['batches'],
    queryFn: () => batchService.getAllBatches(),
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<TraineeProfile>) =>
      profileService.updateProfile(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      alert('Profile updated successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Upload avatar mutation
  const avatarMutation = useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(user!.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setAvatarFile(null);
      setAvatarPreview(null);
      alert('Avatar uploaded successfully!');
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (profileData?.profile) {
      setFormData({
        phone: profileData.profile.phone || '',
        address: profileData.profile.address || '',
        city: profileData.profile.city || '',
        country: profileData.profile.country || 'Pakistan',
        date_of_birth: profileData.profile.date_of_birth || '',
        github_url: profileData.profile.github_url || '',
        linkedin_url: profileData.profile.linkedin_url || '',
        portfolio_url: profileData.profile.portfolio_url || '',
        highest_education: profileData.profile.highest_education || '',
        institution: profileData.profile.institution || '',
        field_of_study: profileData.profile.field_of_study || '',
        graduation_year: profileData.profile.graduation_year || undefined,
        skills: profileData.profile.skills || [],
        bio: profileData.profile.bio || '',
        batch_id: profileData.profile.batch_id || undefined,
      });
    }
  }, [profileData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = () => {
    if (avatarFile) {
      avatarMutation.mutate(avatarFile);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((s) => s !== skill) || [],
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  const completeness = profileData?.completeness || 0;

  return (
    <div>
      <PageBreadCrumb pageTitle="Profile" />

      {/* Profile Completeness */}
      <div className="mb-6 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Profile Completeness
          </h3>
          <span className="text-2xl font-bold text-primary">{completeness}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-dark-3">
          <div
            className="h-3 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Avatar Section */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            Profile Picture
          </h3>

          <div className="flex flex-col items-center">
            <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-primary">
              <img
                src={
                  avatarPreview ||
                  (profileData?.profile.avatar
                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${profileData.profile.avatar}`
                    : '/images/user/user-01.png')
                }
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mb-3 text-sm"
            />

            {avatarFile && (
              <button
                onClick={handleAvatarUpload}
                disabled={avatarMutation.isPending}
                className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {avatarMutation.isPending ? 'Uploading...' : 'Upload Avatar'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark"
          >
            <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputField
                label="Phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
              />

              <InputField
                label="City"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Karachi"
              />

              <InputField
                label="Country"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Pakistan"
              />

              <InputField
                // label="Date of Birth"
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
              />

              <InputField
                // label="GitHub URL"
                type="url"
                value={formData.github_url || ''}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
                placeholder="https://github.com/username"
              />

              <InputField
                label="LinkedIn URL"
                type="url"
                value={formData.linkedin_url || ''}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin_url: e.target.value })
                }
                placeholder="https://linkedin.com/in/username"
              />

              <InputField
                label="Portfolio URL"
                type="url"
                value={formData.portfolio_url || ''}
                onChange={(e) =>
                  setFormData({ ...formData, portfolio_url: e.target.value })
                }
                placeholder="https://myportfolio.com"
              />

              {user?.role !== 'trainee' && batches && (
                <Select
                  label="Assign Batch"
                  value={formData.batch_id?.toString() || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      batch_id: parseInt(e.target.value) || undefined,
                    })
                  }
                >
                  <option value="">Select Batch</option>
                  {batches?.map((batch: Batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <div className="mt-6">
              <TextArea
                // label="Address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Your full address"
                rows={3}
              />
            </div>

            <h3 className="mb-4 mt-8 text-xl font-semibold text-dark dark:text-white">
              Education
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputField
                // label="Highest Education"
                value={formData.highest_education || ''}
                onChange={(e) =>
                  setFormData({ ...formData, highest_education: e.target.value })
                }
                placeholder="Bachelor's Degree"
              />

              <InputField
                // label="Institution"
                value={formData.institution || ''}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                placeholder="University Name"
              />

              <InputField
                // label="Field of Study"
                value={formData.field_of_study || ''}
                onChange={(e) =>
                  setFormData({ ...formData, field_of_study: e.target.value })
                }
                placeholder="Computer Science"
              />

              <InputField
                // label="Graduation Year"
                type="number"
                value={formData.graduation_year?.toString() || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    graduation_year: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="2023"
              />
            </div>

            <h3 className="mb-4 mt-8 text-xl font-semibold text-dark dark:text-white">
              Skills
            </h3>

            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="flex-1 rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                placeholder="Enter a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="rounded-lg bg-primary px-6 py-3 text-white hover:bg-opacity-90"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData?.skills?.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-primary hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-6">
              <TextArea
                // label="Bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-md bg-primary px-8 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}