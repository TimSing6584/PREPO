'use client';

import { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

const topics = ['OOP', 'DB', 'OS', 'Network'];

// Define question type
interface QuestionData {
  id: number;
  question: string;
  topic: string;
  answer: string;
  image: string | null;
  options: string[];
  correctOption: number;
  dateCreated: string;
  author: string;
}

// Mock data - in real app, this would be fetched from API
const mockQuestions: Record<string, QuestionData> = {
  '1': {
    id: 1,
    question: 'What is inheritance?',
    topic: 'OOP',
    answer: 'Inheritance is a mechanism in object-oriented programming where a new class is derived from an existing class. The derived class inherits properties and methods from the parent class.',
    image: null,
    options: ['A feature that allows code reuse', 'A type of function', 'A database concept', 'A networking protocol'],
    correctOption: 0,
    dateCreated: '1/1/2027',
    author: 'Andrich',
  },
  '2': {
    id: 2,
    question: 'What is normalization in databases?',
    topic: 'DB',
    answer: 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.',
    image: null,
    options: ['Organizing data to reduce redundancy', 'Creating backups', 'Indexing tables', 'Encrypting data'],
    correctOption: 0,
    dateCreated: '1/5/2027',
    author: 'Sarah',
  },
};

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;

  // Load existing question data
  const existingQuestion = mockQuestions[questionId] || null;

  const [selectedTopic, setSelectedTopic] = useState(existingQuestion?.topic || '');
  const [question, setQuestion] = useState(existingQuestion?.question || '');
  const [answer, setAnswer] = useState(existingQuestion?.answer || '');
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(existingQuestion?.image || null);
  const [options, setOptions] = useState<string[]>(existingQuestion?.options || ['', '']);
  const [correctOption, setCorrectOption] = useState<number | null>(existingQuestion?.correctOption ?? null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setExistingImageUrl(null);
    }
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctOption === index) {
        setCorrectOption(null);
      } else if (correctOption !== null && correctOption > index) {
        setCorrectOption(correctOption - 1);
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      id: questionId,
      selectedTopic,
      question,
      answer,
      image,
      options,
      correctOption,
    });
    router.push('/admin/questions');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* View + Modify Question Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">View + Modify Question</h2>
        
        {/* Topic Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose topic <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select a topic...</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Question Info */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Question Info</h3>
          
          {/* Question */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Existing Question"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Answer */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Existing Answer"
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Image Upload (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="border border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {image 
                    ? image.name 
                    : existingImageUrl 
                    ? 'Existing Image (click to change)' 
                    : 'Upload your image'}
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* MCQ Type Section */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 mb-2">
            MCQ type
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            You need at least two options. Click the correct answer{' '}
            <span className="text-green-600">(when click show green color)</span>
          </p>

          {/* Options */}
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOption === index}
                  onChange={() => setCorrectOption(index)}
                  className="w-5 h-5 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 w-6">{index + 1}</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder="Existing Option"
                    className={`flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      correctOption === index
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add More Options Button */}
          <button
            onClick={addOption}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            More options
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.push('/admin/questions')}
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
