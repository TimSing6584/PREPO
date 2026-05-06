'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, X } from 'lucide-react';
import Image from 'next/image';
import { fetchQuestions, type QuestionRow } from '@/app/utils/api/questions';

type QuestionType = 'DEFAULT' | 'PERSONALIZED';

export default function QuestionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [appliedTopics, setAppliedTopics] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([]);
  const [appliedTypes, setAppliedTypes] = useState<QuestionType[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuestions = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await fetchQuestions(controller.signal);
        setQuestions(fetchedQuestions);
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
    return () => controller.abort();
  }, []);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const removeTopic = (topic: string) => {
    const updated = selectedTopics.filter((t) => t !== topic);
    setSelectedTopics(updated);
    setAppliedTopics(updated);
  };

  const applyFilters = () => {
    setAppliedTopics(selectedTopics);
    setAppliedTypes(selectedTypes);
    setShowFilterDropdown(false);
  };

  const toggleType = (type: QuestionType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const removeType = (type: QuestionType) => {
    const updated = selectedTypes.filter((t) => t !== type);
    setSelectedTypes(updated);
    setAppliedTypes(updated);
  };

  const topics = Array.from(new Set(questions.map((q) => q.topic.name))).sort((a, b) =>
    a.localeCompare(b)
  );

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.statement
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    const matchesTopic =
      appliedTopics.length === 0 || appliedTopics.includes(question.topic.name);
    const matchesType = appliedTypes.length === 0 || appliedTypes.includes(question.type);

    return matchesSearch && matchesTopic && matchesType;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortOrder === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatType = (type: QuestionType) =>
    type === 'DEFAULT' ? 'Default' : 'Personalised';

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this question?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      setQuestions((prev) => prev.filter((question) => question.id !== id));
    } catch (error) {
      console.error('Unable to delete question', error);
    }
  };

  const hasUnsavedChanges = JSON.stringify(selectedTopics.sort()) !== JSON.stringify(appliedTopics.sort());

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
              placeholder="Search question bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Selected Filter Chips */}
          {(selectedTopics.length > 0 || selectedTypes.length > 0) && (
            <div className="flex items-center gap-2 flex-wrap">
              {selectedTopics.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full border border-gray-300"
                >
                  <span className="text-sm">{topic}</span>
                  <button
                    onClick={() => removeTopic(topic)}
                    className="hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {selectedTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full border border-gray-300"
                >
                  <span className="text-sm">{formatType(type)}</span>
                  <button
                    onClick={() => removeType(type)}
                    className="hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Apply Now Button - appears when there are selected filters */}
          {(selectedTopics.length > 0 || selectedTypes.length > 0) && (
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Apply Now
            </button>
          )}

          {/* Filter, Sort and Create - All on same line */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Filter Dropdown Button */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  Filters
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showFilterDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <p className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">Topic</p>
                      {topics.map((topic) => (
                        <label
                          key={topic}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => toggleTopic(topic)}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{topic}</span>
                        </label>
                      ))}
                      <div className="my-2 border-t border-gray-100" />
                      <p className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">Type</p>
                      {(['DEFAULT', 'PERSONALIZED'] as QuestionType[]).map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{formatType(type)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
            </div>

            {/* Create Button */}
            <button 
              onClick={() => router.push('/admin/questions/create')}
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
                  Question
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Image
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Action
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Topic
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Type
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
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 px-4 text-sm text-gray-500 text-center">
                    Loading topics...
                  </td>
                </tr>
              ) : sortedQuestions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 px-4 text-sm text-gray-500 text-center">
                    No topics found
                  </td>
                </tr>
              ) : (
                sortedQuestions.map((q, index) => (
                  <tr key={q.id} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{q.statement}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {q.imageUrl ? (
                        <Image
                          src={q.imageUrl}
                          alt="Question image"
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-md border border-gray-200 object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-gray-400">Nil</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => router.push(`/admin/questions/${q.id}/edit`)}
                          className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-sm hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{q.topic.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{formatType(q.type)}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {q.createdBy.name || q.createdBy.email}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
