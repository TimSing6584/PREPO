'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';

const sampleTopics = [
  {
    id: 1,
    topic: 'OOP',
    questionsCount: 10,
    dateCreated: '1/1/2027',
    author: 'Andrich',
  },
  {
    id: 2,
    topic: 'DB',
    questionsCount: 7,
    dateCreated: '1/5/2027',
    author: 'Sarah',
  },
  {
    id: 3,
    topic: 'OS',
    questionsCount: 5,
    dateCreated: '1/8/2027',
    author: 'Michael',
  },
  {
    id: 4,
    topic: 'Network',
    questionsCount: 8,
    dateCreated: '1/12/2027',
    author: 'Jessica',
  },
];

export default function TopicsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search topic"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Sort and Create - All on same line */}
          <div className="flex items-center justify-between gap-4">
            {/* Sort By Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
              >
                {sortOrder === 'newest' 
                  ? 'Newest → Oldest' 
                  : sortOrder === 'oldest' 
                  ? 'Oldest → Newest' 
                  : '-- Sort by --'}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showSortDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    disabled
                    className="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                  >
                    -- Sort by --
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder('newest');
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                      sortOrder === 'newest' ? 'bg-gray-100' : ''
                    }`}
                  >
                    Newest → Oldest
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder('oldest');
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                      sortOrder === 'oldest' ? 'bg-gray-100' : ''
                    }`}
                  >
                    Oldest → Newest
                  </button>
                </div>
              )}
            </div>

            {/* Create Button */}
            <button 
              onClick={() => router.push('/admin/topics/create')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              + Create
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  N.o
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Topic
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Action
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Questions #
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Date Created
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Author
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleTopics.map((topic) => (
                <tr key={topic.id} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-gray-900">{topic.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{topic.topic}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => router.push(`/admin/topics/${topic.id}/edit`)}
                        className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors"
                      >
                        Modify
                      </button>
                      <button className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-sm hover:bg-red-100 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{topic.questionsCount}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{topic.dateCreated}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{topic.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
