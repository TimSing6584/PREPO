'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTopicPage() {
  const router = useRouter();
  const [topicName, setTopicName] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      topicName,
    });
    router.push('/admin/topics');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Add a New Topic Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Add a New Topic</h2>
        
        {/* Topic Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="Enter topic name..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
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
