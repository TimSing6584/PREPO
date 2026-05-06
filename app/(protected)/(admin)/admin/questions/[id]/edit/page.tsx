'use client';

import { useEffect, useMemo, useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import TipTapEditor from '@/components/TipTap/TipTapEditor';
import { fetchTopics, type Topic } from '@/app/utils/api/topics';

type QuestionData = {
  id: string;
  statement: string;
  topicId: string;
  correctWritten: string;
  imageUrl: string | null;
  options: string[];
  correctOption: number;
};

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;

  const [errors, setErrors] = useState<{
    selectedTopic?: string;
    question?: string;
    answer?: string;
    options?: string;
    correctOption?: string;
  }>({});

  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editorInitialContent, setEditorInitialContent] = useState<string | object>('<p></p>');
  const [editorKey, setEditorKey] = useState(0);

  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedImagePreviewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image]
  );

  useEffect(() => {
    return () => {
      if (selectedImagePreviewUrl) {
        URL.revokeObjectURL(selectedImagePreviewUrl);
      }
    };
  }, [selectedImagePreviewUrl]);

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
        setIsLoadingTopics(false);
      }
    };

    loadTopics();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuestion = async () => {
      try {
        const response = await fetch(`/api/questions/${questionId}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        const json = await response.json();

        if (!response.ok || !json?.data) {
          throw new Error(json?.error ?? 'Question not found.');
        }

        const data = json.data as QuestionData;
        setSelectedTopic(data.topicId);
        setQuestion(data.statement);
        setAnswer(data.correctWritten);

        try {
          setEditorInitialContent(data.correctWritten ? JSON.parse(data.correctWritten) : '<p></p>');
        } catch {
          setEditorInitialContent('<p></p>');
        }
        setEditorKey((prev) => prev + 1);

        setExistingImageUrl(data.imageUrl ?? null);
        setOptions(data.options);
        setCorrectOption(data.correctOption);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          setErrors({ question: error.message });
        }
      } finally {
        setIsLoadingQuestion(false);
      }
    };

    loadQuestion();
    return () => controller.abort();
  }, [questionId]);

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

  const hasNonEmptyText = (value: unknown): boolean => {
    if (!value || typeof value !== 'object') return false;
    const node = value as { text?: unknown; content?: unknown[] };
    if (typeof node.text === 'string' && node.text.trim().length > 0) return true;
    if (!Array.isArray(node.content)) return false;
    return node.content.some((child) => hasNonEmptyText(child));
  };

  const validate = () => {
    const newErrors: {
      selectedTopic?: string;
      question?: string;
      answer?: string;
      options?: string;
      correctOption?: string;
    } = {};

    if (!selectedTopic.trim()) {
      newErrors.selectedTopic = 'Topic is required.';
    }

    if (!question.trim()) {
      newErrors.question = 'Question is required.';
    }

    const trimmedOptions = options.map((option) => option.trim());
    if (trimmedOptions.length < 2 || trimmedOptions.some((option) => option.length === 0)) {
      newErrors.options = 'At least 2 options are required and none can be empty.';
    }

    if (correctOption === null) {
      newErrors.correctOption = 'Please select the correct option.';
    } else if (correctOption < 0 || correctOption >= options.length) {
      newErrors.correctOption = 'Correct option is out of range.';
    } else if (!trimmedOptions[correctOption]) {
      newErrors.correctOption = 'Correct option must point to a non-empty answer.';
    }

    let parsedAnswer: unknown = null;
    try {
      parsedAnswer = answer ? JSON.parse(answer) : null;
    } catch {
      newErrors.answer = 'Answer format is invalid.';
    }

    if (!newErrors.answer && !hasNonEmptyText(parsedAnswer)) {
      newErrors.answer = 'Answer is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!validate()) {
        return;
      }

      let uploadedImageUrl: string | null = existingImageUrl;
      if (image) {
        const s3Response = await fetch('/api/s3-upload', {
          method: 'POST',
          body: (() => {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('folder_name', 'questions');
            return formData;
          })(),
        });

        if (!s3Response.ok) {
          const uploadError = await s3Response.json().catch(() => ({} as { error?: string }));
          throw new Error(uploadError.error ?? 'Image upload failed.');
        }

        const { url } = await s3Response.json();
        uploadedImageUrl = url;
      }

      const updateResponse = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statement: question,
          topicId: selectedTopic,
          correctWritten: answer,
          options,
          correctOption,
          imageUrl: uploadedImageUrl,
        }),
      });

      if (!updateResponse.ok) {
        const updateError = await updateResponse.json().catch(() => ({} as { error?: string }));
        throw new Error(updateError.error ?? 'Failed to update question.');
      }

      router.push('/admin/questions');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setErrors({ question: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">View + Modify Question</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose topic <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              if (errors.selectedTopic) {
                setErrors((prev) => ({ ...prev, selectedTopic: undefined }));
              }
            }}
            disabled={isLoadingTopics || isLoadingQuestion}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.selectedTopic ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <option value="" disabled>
              {isLoadingTopics ? 'Loading topics...' : 'Select a topic...'}
            </option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
          {errors.selectedTopic ? <p className="mt-2 text-xs text-red-500">{errors.selectedTopic}</p> : null}
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Question Info</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errors.question) {
                  setErrors((prev) => ({ ...prev, question: undefined }));
                }
              }}
              placeholder="Existing Question"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.question ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.question ? <p className="mt-2 text-xs text-red-500">{errors.question}</p> : null}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer <span className="text-red-500">*</span>
            </label>
            {isLoadingQuestion ? (
              <div className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-500">
                Loading answer...
              </div>
            ) : (
              <TipTapEditor
                key={editorKey}
                initialContent={editorInitialContent}
                onChange={(content) => {
                  setAnswer(JSON.stringify(content));
                  if (errors.answer) {
                    setErrors((prev) => ({ ...prev, answer: undefined }));
                  }
                }}
                containerClassName={`w-full rounded-lg border bg-white ${
                  errors.answer ? 'border-red-400' : 'border-gray-300'
                }`}
                editorClassName="min-h-[150px] bg-white p-3 text-zinc-900 sm:min-h-[180px] sm:p-4"
              />
            )}
            {errors.answer ? (
              <p className="mt-2 text-xs text-red-500">{errors.answer}</p>
            ) : (
              <p className="mt-2 text-xs text-gray-500">Answer is stored as a JSON string.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image <span className="text-gray-400">(Optional)</span>
            </label>
            {selectedImagePreviewUrl ? (
              <div className="mb-3">
                <img
                  src={selectedImagePreviewUrl}
                  alt="Selected question image preview"
                  className="max-h-48 rounded-lg border border-gray-200 object-contain"
                />
              </div>
            ) : existingImageUrl ? (
              <div className="mb-3">
                <img
                  src={existingImageUrl}
                  alt="Current question image"
                  className="max-h-48 rounded-lg border border-gray-200 object-contain"
                />
              </div>
            ) : null}
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
                  {image ? image.name : existingImageUrl ? 'Existing Image (click to change)' : 'Upload your image'}
                </p>
              </label>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 mb-2">MCQ type</h3>
          <p className="text-sm text-gray-600 mb-4">
            You need at least two options. Click the correct answer{' '}
            <span className="text-green-600">(when click show green color)</span>
          </p>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOption === index}
                  onChange={() => {
                    setCorrectOption(index);
                    if (errors.correctOption) {
                      setErrors((prev) => ({ ...prev, correctOption: undefined }));
                    }
                  }}
                  className="w-5 h-5 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 w-6">{index + 1}</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      updateOption(index, e.target.value);
                      if (errors.options || errors.correctOption) {
                        setErrors((prev) => ({ ...prev, options: undefined, correctOption: undefined }));
                      }
                    }}
                    placeholder="Existing Option"
                    className={`flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      correctOption === index ? 'border-green-500 bg-green-50' : 'border-gray-300'
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
          {errors.options ? <p className="mt-2 text-xs text-red-500">{errors.options}</p> : null}
          {errors.correctOption ? <p className="mt-1 text-xs text-red-500">{errors.correctOption}</p> : null}

          <button
            onClick={addOption}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            More options
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.push('/admin/questions')}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || isLoadingQuestion}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
