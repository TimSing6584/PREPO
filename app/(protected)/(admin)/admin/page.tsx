import Link from 'next/link';
import { prisma } from '@/app/utils/db';
import { QuestionType } from '@/lib/generated/prisma/client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [activeTopics, defaultQuestions, personalizedQuestions, users] = await Promise.all([
    prisma.topic.count({
      where: {
        deleted: false,
      },
    }),
    prisma.question.count({
      where: {
        deleted: false,
        type: QuestionType.DEFAULT,
      },
    }),
    prisma.question.count({
      where: {
        deleted: false,
        type: QuestionType.PERSONALIZED,
      },
    }),
    prisma.user.count(),
  ]);

  const stats = [
    {
      title: 'Active Topics',
      value: activeTopics,
      description: 'Across all categories',
    },
    {
      title: 'Default Questions',
      value: defaultQuestions,
      description: 'Created by admins',
    },
    {
      title: 'Personalized Questions',
      value: personalizedQuestions,
      description: 'Created by students',
    },
    {
      title: 'Total Users',
      value: users,
      description: 'Registered accounts',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-medium uppercase text-gray-500">{stat.title}</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-600">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/topics/create" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 text-xl">+</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Add New Topic</h3>
              <p className="text-sm text-gray-600">Create a new topic for students</p>
            </div>
          </Link>

          <Link href="/admin/questions/create" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 text-xl">+</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Add New Question</h3>
              <p className="text-sm text-gray-600">Create a practice question</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}
