'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import { fetchTopics, type Topic } from '@/app/utils/api/topics';

export default function TopicsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadTopics = async () => {
      try {
        const fetchedTopics = await fetchTopics(controller.signal);
        setTopics(fetchedTopics);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Unable to fetch topics', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTopics();
    return () => controller.abort();
  }, []);

  const handleDeleteTopic = async (topicId: string) => {
    const confirmed = window.confirm('Delete this topic?');
    if (!confirmed) {
      return;
    }

    setDeletingTopicId(topicId);
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result?.error ?? 'Failed to delete topic');
      }

      setTopics((prev) => prev.filter((topic) => topic.id !== topicId));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete topic';
      window.alert(message);
    } finally {
      setDeletingTopicId(null);
    }
  };

  const filteredTopics = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    let next = topics;

    if (normalizedQuery) {
      next = next.filter((topic) => topic.name.toLowerCase().includes(normalizedQuery));
    }

    if (sortOrder === 'newest') {
      next = [...next].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (sortOrder === 'oldest') {
      next = [...next].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return next;
  }, [searchQuery, sortOrder, topics]);

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
              {filteredTopics.map((topic, index) => (
                <tr key={topic.id} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{topic.name}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => router.push(`/admin/topics/${topic.id}/edit`)}
                        className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors"
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        disabled={deletingTopicId === topic.id}
                        className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-sm hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingTopicId === topic.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{topic._count?.questions ?? 0}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {new Date(topic.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">Admin</td>
                </tr>
              ))}
              {!isLoading && filteredTopics.length === 0 ? (
                <tr>
                  <td className="py-6 px-4 text-sm text-gray-500 text-center" colSpan={6}>
                    No topics found.
                  </td>
                </tr>
              ) : null}
              {isLoading ? (
                <tr>
                  <td className="py-6 px-4 text-sm text-gray-500 text-center" colSpan={6}>
                    Loading topics...
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
