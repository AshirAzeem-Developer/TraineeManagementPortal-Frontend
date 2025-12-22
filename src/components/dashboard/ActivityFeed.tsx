import React from 'react';
import {
  CheckCircleIcon,
  FileIcon,
  UserIcon
} from '@/icons';

const IconMap: any = {
  'FileIcon': FileIcon,
  'UserIcon': UserIcon,
  'CheckCircleIcon': CheckCircleIcon
};

interface ActivityFeedProps {
  activities: { id: number; content: string; time: string; icon: string; color: string }[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="col-span-12 rounded-lg border border-gray-200 bg-white px-5 pt-7.5 pb-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 xl:col-span-4">
      <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Recent Activity
      </h3>
      <div className="flex flex-col gap-4">
        {activities.map((activity) => {
          const Icon = IconMap[activity.icon] || FileIcon;
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className={`flex flex-row  h-10 w-10 shrink-0 items-center justify-center rounded-full p-0 ${activity.color}`}
              >
                <div>

                <Icon className=" h-full w-full fill-current self-center" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  {activity.content}
                </p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
