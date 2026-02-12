'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Define topic type
interface TopicData {
  id: number;
  topic: string;
  description: string;
  questionsCount: number;
  dateCreated: string;
  author: string;
}

// Mock data - in real app, this would be fetched from API
const mockTopics: Record<string, TopicData> = {
  '1': {
    id: 1,
    topic: 'OOP',
    description: 'Object-Oriented Programming concepts and principles',
    questionsCount: 10,
    dateCreated: '1/1/2027',
    author: 'Andrich',
  },
  '2': {
    id: 2,
    topic: 'DB',
    description: 'Database design, SQL, and database management systems',
    questionsCount: 7,
    dateCreated: '1/5/2027',
    author: 'Sarah',
  },
  '3': {
    id: 3,
    topic: 'OS',
    description: 'Operating Systems fundamentals and concepts',
    questionsCount: 5,
    dateCreated: '1/8/2027',
    author: 'Michael',
  },
  '4': {
    id: 4,
    topic: 'Network',
    description: 'Computer networking and network protocols',
    questionsCount: 8,
    dateCreated: '1/12/2027',
    author: 'Jessica',
  },
};

export default function EditTopicPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.id as string;

  // Load existing topic data
  const existingTopic = mockTopics[topicId] || null;

  const [topicName, setTopicName] = useState(existingTopic?.topic || '');
  const [description, setDescription] = useState(existingTopic?.description || '');

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      id: topicId,
      topicName,
      description,
    });
    router.push('/admin/topics');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* View + Modify Topic Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">View + Modify Topic</h2>
        
        {/* Topic Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="Existing Topic Name"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Existing Description"
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Topic Stats */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-2xl font-bold text-gray-900">{existingTopic?.questionsCount || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-lg font-medium text-gray-900">{existingTopic?.dateCreated}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Author</p>
              <p className="text-lg font-medium text-gray-900">{existingTopic?.author}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.push('/admin/topics')}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
