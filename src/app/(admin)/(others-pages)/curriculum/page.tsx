'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import curriculumService from '@/lib/api/curriculum.service';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import { Week, Day, Topic } from '@/types';

export default function CurriculumPage() {
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);

  // Fetch weeks
  const { data: weeks, isLoading: weeksLoading } = useQuery({
    queryKey: ['weeks'],
    queryFn: () => curriculumService.getWeeks(),
  });

  // Fetch days for selected week
  const { data: days, isLoading: daysLoading } = useQuery({
    queryKey: ['days', selectedWeek?.id],
    queryFn: () => curriculumService.getDays(selectedWeek!.id),
    enabled: !!selectedWeek,
  });

  // Fetch topics for selected day
  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics', selectedDay?.id],
    queryFn: () => curriculumService.getTopics(selectedDay!.id),
    enabled: !!selectedDay,
  });

  if (weeksLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <PageBreadCrumb pageTitle="Curriculum" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weeks List */}
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="border-b border-stroke p-6 dark:border-dark-3">
            <h3 className="text-xl font-semibold text-dark dark:text-white">
              Weeks
            </h3>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {weeks?.map((week: Week) => (
                <button
                  key={week.id}
                  onClick={() => {
                    setSelectedWeek(week);
                    setSelectedDay(null);
                  }}
                  className={`w-full rounded-lg p-4 text-left transition-colors ${
                    selectedWeek?.id === week.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-2 hover:bg-gray-3 dark:bg-dark-2 dark:hover:bg-dark-3'
                  }`}
                >
                  <div className="font-semibold">Week {week.week_number}</div>
                  <div className="text-sm opacity-90">{week.title}</div>
                  <div className="mt-1 text-xs opacity-75">
                    Month {week.month} • {week.total_hours}h
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Days List */}
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="border-b border-stroke p-6 dark:border-dark-3">
            <h3 className="text-xl font-semibold text-dark dark:text-white">
              Days
            </h3>
          </div>

          <div className="p-4">
            {!selectedWeek ? (
              <p className="text-center text-dark-5 dark:text-dark-6">
                Select a week to view days
              </p>
            ) : daysLoading ? (
              <div className="flex justify-center p-8">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {days?.map((day: Day) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day)}
                    className={`w-full rounded-lg p-4 text-left transition-colors ${
                      selectedDay?.id === day.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-2 hover:bg-gray-3 dark:bg-dark-2 dark:hover:bg-dark-3'
                    }`}
                  >
                    <div className="font-semibold">Day {day.day_number}</div>
                    <div className="text-sm opacity-90">{day.title}</div>
                    <div className="mt-1 text-xs opacity-75">{day.hours}h</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Topics List */}
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <div className="border-b border-stroke p-6 dark:border-dark-3">
                <h3 className="text-xl font-semibold text-dark dark:text-white">
                    Topics
                    </h3>
                </div>
        <div className="p-4">
        {!selectedDay ? (
          <p className="text-center text-dark-5 dark:text-dark-6">
            Select a day to view topics
          </p>
        ) : topicsLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {topics?.map((topic: Topic) => (
              <div
                key={topic.id}
                className="rounded-lg border border-stroke p-4 dark:border-dark-3"
              >
                <h4 className="font-semibold text-dark dark:text-white">
                  {topic.title}
                </h4>
                {topic.description && (
                  <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
                    {topic.description}
                  </p>
                )}

                {topic.learning_objectives && topic.learning_objectives.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-dark-5 dark:text-dark-6">
                      Learning Objectives:
                    </p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-dark-5 dark:text-dark-6">
                      {topic.learning_objectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {topic.resources && topic.resources.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-dark-5 dark:text-dark-6">
                      Resources:
                    </p>
                    <div className="mt-1 space-y-1">
                      {topic.resources.map((resource, idx) => (     
                        <a 
                          key={idx}
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-primary hover:underline"
                        >
                          {resource}
                        </a>
                      ))}
                    </div>
                  
                  </div>
                )}

                <div className="mt-3 text-xs text-dark-5 dark:text-dark-6">
                  Duration: {topic.duration_minutes} minutes
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
    </>
  );
}