'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import profileService from '@/lib/api/profile.service';
import batchService from '@/lib/api/batch.service';
import { TraineeProfile } from '@/types';
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

  // Queries
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => profileService.getMyProfile(),
    enabled: !!user,
  });

  const { data: batches } = useQuery({
    queryKey: ['batches'],
    queryFn: () => batchService.getAllBatches(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<TraineeProfile>) =>
      profileService.updateProfile(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      alert('Profile updated successfully!');
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(user!.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setAvatarFile(null);
      setAvatarPreview(null);
    },
  });

  useEffect(() => {
    if (profileData?.profile) {
      setFormData({
        ...formData,
        ...profileData.profile,
      });
    }
  }, [profileData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
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
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-dark">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const completeness = profileData?.completeness || 0;

  return (
    <div className="space-y-8">
      <PageBreadCrumb pageTitle="Profile" />

      {/* Profile Completeness Card */}
      <div className="rounded-xl border border-stroke bg-slate-800 p-6 shadow-lg backdrop-blur-sm transition dark:border-dark-3 dark:bg-dark-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-dark dark:text-white">
            Profile Completeness
          </h3>
          <span className="text-2xl font-bold text-primary">
            {completeness}%
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-dark-4 overflow-hidden">
          <div
            style={{ width: `${completeness}%` }}
            className="h-full bg-primary transition-all duration-500 rounded-full"
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Avatar Card */}
        <div className="rounded-xl border border-stroke bg-slate-800 p-6 shadow-lg backdrop-blur-sm transition dark:border-dark-3 dark:bg-dark-2">
          <h3 className="text-xl font-semibold mb-4 text-dark dark:text-white">
            Profile Picture
          </h3>

          <div className="flex flex-col items-center gap-4">
            <div className="h-36 w-36 rounded-full border-4 border-primary overflow-hidden shadow-lg">
              <img
                src={
                  avatarPreview ||
                  (profileData?.profile.avatar
                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${profileData.profile.avatar}`
                    : '/images/user/user-01.png')
                }
                className="h-full w-full object-cover"
                alt="User Avatar"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm cursor-pointer dark:text-gray-300"
            />

            {avatarFile && (
              <button
                onClick={() => avatarMutation.mutate(avatarFile)}
                className="w-full rounded-lg bg-primary px-5 py-2 text-white hover:bg-primary/90 transition"
              >
                Upload Avatar
              </button>
            )}
          </div>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-stroke bg-slate-800 p-6 shadow-lg backdrop-blur-sm space-y-8 dark:border-dark-3 dark:bg-dark-2"
          >
            {/* Personal Info */}
            <section className="space-y-6">
              <h3 className="text-xl font-semibold text-dark dark:text-white">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputField label="Phone" value={formData.phone ?? ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

                <InputField label="City" value={formData.city ?? ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />

                <InputField label="Country" value={formData.country ?? ''} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />

                <InputField label="Date of Birth" type="date" value={formData.date_of_birth ?? ''} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} />

                <InputField label="GitHub" value={formData.github_url ?? ''} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} />

                <InputField label="LinkedIn" value={formData.linkedin_url ?? ''} onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })} />

                <InputField label="Portfolio" value={formData.portfolio_url ?? ''} onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })} />

                {user?.role !== 'trainee' && batches && (
                  <Select
                    label="Assign Batch"
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        batch_id: parseInt(value),
                      })
                    }
                    options={batches?.map((b) => ({ value: b.id.toString(), label: b.name }))}
                  />
                )}
              </div>

              <TextArea value={formData.address ?? ''} onChange={(val) => setFormData({ ...formData, address: val })} placeholder="Full Address" rows={3} />
            </section>

            {/* Education */}
            <section className="space-y-6">
              <h3 className="text-xl font-semibold text-dark dark:text-white">
                Education
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputField label="Highest Education" value={formData.highest_education ?? ''} onChange={(e) => setFormData({ ...formData, highest_education: e.target.value })} />

                <InputField label="Institution" value={formData.institution ?? ''} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} />

                <InputField label="Field of Study" value={formData.field_of_study ?? ''} onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })} />

                <InputField label="Graduation Year" type="number" value={formData.graduation_year ?? ''} onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) })} />
              </div>
            </section>

            {/* Skills */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-dark dark:text-white">
                Skills
              </h3>

              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-lg border border-stroke  py-2 px-4 dark:bg-dark-3 dark:text-white dark:border-dark-4"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Type a skill & press Enter"
                />

                <button onClick={addSkill} className="bg-blue-600  px-5 py-2 rounded-lg text-white">
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills?.map((skill) => (
                  <span key={skill}className="relative px-4 py-1.5 rounded-full border border-white/10 text-white text-sm bg-gradient-to-b from-white/5 to-white/0 shadow-[0_0_10px_rgba(255,255,255,0.05)] flex items-center gap-2 select-none"> {skill}
                  <button  onClick={() => removeSkill(skill)}  className="text-red-400 hover:text-red-300 transition">
                    ×
                    </button>
                    </span>

                ))}
              </div>

              <TextArea value={formData.bio ?? ''} onChange={(v) => setFormData({ ...formData, bio: v })} placeholder="Write something about yourself..." rows={4} />
            </section>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-lg bg-primary px-8 py-3 text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
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
