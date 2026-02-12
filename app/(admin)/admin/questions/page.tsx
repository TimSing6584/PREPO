'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

const topics = ['OOP', 'DB', 'OS', 'Network'];

const sampleQuestions = [
  {
    id: 1,
    question: 'What is inheritance?',
    topic: 'OOP',
    dateCreated: '1/1/2027',
    author: 'Andrich',
  },
  {
    id: 2,
    question: 'What is normalization in databases?',
    topic: 'DB',
    dateCreated: '1/5/2027',
    author: 'Sarah',
  },
  {
    id: 3,
    question: 'Explain the difference between process and thread',
    topic: 'OS',
    dateCreated: '1/8/2027',
    author: 'Michael',
  },
  {
    id: 4,
    question: 'What is polymorphism?',
    topic: 'OOP',
    dateCreated: '1/10/2027',
    author: 'Andrich',
  },
  {
    id: 5,
    question: 'What are TCP and UDP protocols?',
    topic: 'Network',
    dateCreated: '1/12/2027',
    author: 'Jessica',
  },
  {
    id: 6,
    question: 'What is deadlock in operating systems?',
    topic: 'OS',
    dateCreated: '1/15/2027',
    author: 'Michael',
  },
  {
    id: 7,
    question: 'Explain ACID properties in databases',
    topic: 'DB',
    dateCreated: '1/18/2027',
    author: 'Sarah',
  },
  {
    id: 8,
    question: 'What is the OSI model?',
    topic: 'Network',
    dateCreated: '1/20/2027',
    author: 'Jessica',
  },
];

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [appliedTopics, setAppliedTopics] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

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
    setShowFilterDropdown(false);
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

          {/* Selected Topic Chips */}
          {selectedTopics.length > 0 && (
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
            </div>
          )}

          {/* Apply Now Button - appears when there are selected topics */}
          {selectedTopics.length > 0 && (
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
                  -- Sort by --
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showSortDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
                  Action
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Topic
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
              {sampleQuestions.map((q) => (
                <tr key={q.id} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-gray-900">{q.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{q.question}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors">
                        Modify
                      </button>
                      <button className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-sm hover:bg-red-100 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{q.topic}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{q.dateCreated}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{q.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
