'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Upload, Plus, X, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TipTapEditor from '@/components/TipTap/TipTapEditor';
import { fetchTopics, type Topic } from '@/app/utils/api/topics';
import Navbar from '@/components/main/Navbar';
import toast from 'react-hot-toast';

type FormErrors = {
  selectedTopic?: string;
  question?: string;
  answer?: string;
  options?: string;
  correctOption?: string;
  image?: string;
};

export default function CreatePersonalizedQuestionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const imagePreviewUrl = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLocked = isLoadingTopics || isSubmitting;

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    const controller = new AbortController();

    const loadTopics = async () => {
      try {
        const fetchedTopics = await fetchTopics(controller.signal);
        setTopics(fetchedTopics);
      } catch {
        setTopics([]);
      } finally {
        setIsLoadingTopics(false);
      }
    };

    loadTopics();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const topicId = searchParams.get('topicId');
    if (!topicId || !topics.length || selectedTopic) return;

    const exists = topics.some((topic) => topic.id === topicId);
    if (exists) {
      setSelectedTopic(topicId);
    }
  }, [searchParams, topics, selectedTopic]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    if (uploaded.type === 'image/svg+xml') {
      setErrors((prev) => ({ ...prev, image: 'SVG files are not allowed.' }));
      setImage(null);
      return;
    }

    setErrors((prev) => ({ ...prev, image: undefined }));
    setImage(uploaded);
  };

  const addOption = () => setOptions((prev) => [...prev, '']);

  const removeOption = (index: number) => {
    if (options.length <= 2) return;

    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (correctOption === index) {
      setCorrectOption(null);
    } else if (correctOption !== null && correctOption > index) {
      setCorrectOption(correctOption - 1);
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

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    const trimmedOptions = options.map((o) => o.trim());

    if (!selectedTopic.trim()) {
      nextErrors.selectedTopic = 'Please choose a topic.';
    }
    if (!question.trim()) {
      nextErrors.question = 'Question is required.';
    }
    if (trimmedOptions.length < 2 || trimmedOptions.some((o) => !o)) {
      nextErrors.options = 'At least 2 options are required and none can be empty.';
    }

    if (correctOption === null) {
      nextErrors.correctOption = 'Please select the correct option.';
    } else if (correctOption < 0 || correctOption >= options.length || !trimmedOptions[correctOption]) {
      nextErrors.correctOption = 'Correct option is invalid.';
    }

    let parsedAnswer: unknown = null;
    try {
      parsedAnswer = answer ? JSON.parse(answer) : null;
    } catch {
      nextErrors.answer = 'Answer format is invalid.';
    }
    if (!nextErrors.answer && !hasNonEmptyText(parsedAnswer)) {
      nextErrors.answer = 'Answer is required.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please fill in all required fields.');
    }
  
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!validate()) return;

      let uploadedImageUrl: string | null = null;
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('folder_name', 'questions');

        const s3Response = await fetch('/api/s3-upload', {
          method: 'POST',
          body: formData,
        });

        if (!s3Response.ok) {
          const uploadError = await s3Response.json().catch(() => ({} as { error?: string }));
          throw new Error(uploadError.error ?? 'Image upload failed.');
        }

        const { url } = await s3Response.json();
        uploadedImageUrl = url;
      }

      const createResponse = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: [
            {
              statement: question,
              topicId: selectedTopic,
              correctWritten: answer,
              options,
              correctOption: correctOption!,
              imageUrl: uploadedImageUrl,
            },
          ],
        }),
      });

      if (!createResponse.ok) {
        const createError = await createResponse.json().catch(() => ({} as { error?: string }));
        throw new Error(createError.error ?? 'Failed to create question.');
      }

      toast.success('Question created successfully!');
      router.push('/personalized-questions');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      toast.error(message);
      setErrors((prev) => ({ ...prev, question: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-frame px-4 sm:px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-3 sm:gap-4 md:gap-6 font-geist-sans">
      <Navbar />
      <div className="flex-1 -mx-4 sm:-mx-6 md:-mx-12 -mb-6 md:-mb-12">
        <div className="h-full overflow-y-auto p-4 md:p-6 bg-neutral-50/30">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between px-2">
              <Link
                href="/personalized-questions"
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Back to Personalized Questions
              </Link>
            </div>
            <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-neutral-100 shadow-sm p-4 sm:p-6 md:p-10">
              <h1 className="text-lg font-semibold text-gray-900 mb-2">Create Personalized Question</h1>
              <p className="text-sm text-gray-500 mb-6">
                This question is visible only to you when practicing.
              </p>

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
            disabled={isLocked}
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

              <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-base font-medium text-gray-900 mb-4">Question Info</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              disabled={isLocked}
              type="text"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errors.question) {
                  setErrors((prev) => ({ ...prev, question: undefined }));
                }
              }}
              placeholder="Enter your question ..."
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
            <div className={isLocked ? 'opacity-50 pointer-events-none' : ''}>
              <TipTapEditor
                initialContent="<p></p>"
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
            </div>
            {errors.answer && (
              <p className="mt-2 text-xs text-red-500">{errors.answer}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image <span className="text-gray-400">(Optional)</span>
            </label>
            {imagePreviewUrl ? (
              <div className="mb-3 flex justify-center">
                <Image
                  src={imagePreviewUrl}
                  alt="Selected question image preview"
                  width={320}
                  height={192}
                  className="max-h-48 w-auto rounded-lg border border-gray-200 object-contain"
                />
              </div>
            ) : null}
            <div className="border border-gray-300 rounded-lg p-4 text-center overflow-hidden">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`block w-full min-w-0 ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 break-all px-1">
                  {image ? image.name : 'Upload your image'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Allowed: PNG, JPG, JPEG, WEBP</p>
              </label>
            </div>
            {errors.image ? <p className="mt-2 text-xs text-red-500">{errors.image}</p> : null}
          </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-base font-medium text-gray-900 mb-2">
                  MCQ type <span className="text-red-500">*</span>
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  You need at least two options. Click the correct answer <span className="text-red-500">*</span>
                </p>

                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        disabled={isLocked}
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
                          placeholder="Enter your option"
                          className={`flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            correctOption === index ? 'border-green-500 bg-green-50' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {options.length > 2 && (
                        <button
                          disabled={isLocked}
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
                  disabled={isLocked}
                  onClick={addOption}
                  className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  More options
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isLocked}
                onClick={handleSubmit}
                className={`px-6 py-2.5 rounded-lg text-white transition-colors ${
                  isLocked ? 'bg-primary-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
