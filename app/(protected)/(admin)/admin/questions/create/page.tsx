'use client';

import { useEffect, useMemo, useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TipTapEditor from '@/components/TipTap/TipTapEditor';
import { fetchTopics, type Topic } from '@/app/utils/api/topics';
import Image from 'next/image';

// Define the expected structure of each question in the JSON file
type JsonQuestion = {
  statement: string;
  topicId: string;
  correctWritten: string;
  options: string[];
  correctOption: number;
  imageUrl?: string | null;
};

export default function CreateQuestionPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<{
    selectedTopic?: string;
    question?: string;
    answer?: string;
    options?: string;
    correctOption?: string;
    jsonFile?: string;
  }>({});
  const [jsonFile, setJsonFile] = useState<File | null>(null);
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

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJsonFile(e.target.files[0]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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

  // Check if single upload format has empty inputs
  const isSingleUploadEmpty = (): boolean => {
    const empty = !question.trim() && !selectedTopic.trim() && !answer.trim();
    if (empty) {
      setErrors((prev) => ({ ...prev, question: 'Please fill in a question or upload a JSON file.' }));
    }
    return empty;
  };
  // Check if json upload format has empty inputs
  const isJsonEmpty = (): boolean => {
    const empty = !jsonFile;
    if (empty) {
      setErrors((prev) => ({ ...prev, jsonFile: 'Please upload a JSON file or fill in a question.' }));
    }
    return empty;
  };

  // Validate the structure of question form for single upload
  const validate_single_upload = (): boolean => {
    const newErrors: {
      options?: string;
      correctOption?: string;
      answer?: string;
    } = {};

    const trimmedOptions = options.map((o) => o.trim());
    if (trimmedOptions.length < 2 || trimmedOptions.some((o) => o.length === 0)) {
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

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Check if a single question in JSON file is valid
  const isValidJsonQuestion = (q: unknown): q is JsonQuestion => {
    if (!q || typeof q !== 'object') return false;
    const question = q as Record<string, unknown>;

    return (
      typeof question.statement === 'string' && question.statement.trim().length > 0 &&
      typeof question.topicId === 'string' && question.topicId.trim().length > 0 &&
      typeof question.correctWritten === 'string' && question.correctWritten.trim().length > 0 &&
      Array.isArray(question.options) && question.options.length >= 2 &&
      question.options.every((o) => typeof o === 'string' && o.trim().length > 0) &&
      typeof question.correctOption === 'number' &&
      question.correctOption >= 0 &&
      question.correctOption <= question.options.length - 1
    );
  };

  const validate_json_upload = async (): Promise<{ valid: boolean; questions: JsonQuestion[] }> => {
    if (!jsonFile) return { valid: false, questions: [] };

    if (!jsonFile.name.endsWith('.json')) {
      setErrors((prev) => ({ ...prev, jsonFile: 'File must be a .json file.' }));
      return { valid: false, questions: [] };
    }

    let parsed: unknown;
    try {
      const text = await jsonFile.text();
      parsed = JSON.parse(text);
    } catch {
      setErrors((prev) => ({ ...prev, jsonFile: 'Invalid JSON format.' }));
      return { valid: false, questions: [] };
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      setErrors((prev) => ({ ...prev, jsonFile: 'JSON must be a non-empty array of questions.' }));
      return { valid: false, questions: [] };
    }

    const invalidIndex = parsed.findIndex((q) => !isValidJsonQuestion(q));
    if (invalidIndex !== -1) {
      setErrors((prev) => ({ ...prev, jsonFile: `Question at index ${invalidIndex} has invalid or missing fields.` }));
      return { valid: false, questions: [] };
    }

    return { valid: true, questions: parsed as JsonQuestion[] };
  };



  const handleSubmit = async () => {
    if (isSubmitting) return; // prevent double submissions ,aka race conditions
    setIsSubmitting(true);
    try{

      const singleEmpty = isSingleUploadEmpty();
      const jsonEmpty = isJsonEmpty();

      // At least one must be provided
      if (singleEmpty && jsonEmpty) return;

      // If one format exists, it must be valid

      if (!singleEmpty && !validate_single_upload()) return;

      const jsonResult = !jsonEmpty ? await validate_json_upload() : { valid: true, questions: [] as JsonQuestion[] };
      if (!jsonResult.valid) return;


      // Build questions to create
      let questionsToCreate: JsonQuestion[] = [...jsonResult.questions];

      if(!singleEmpty){
        // If there is an image, upload it to S3 and get the URL
        let uploadedImageUrl: string | null = null;
        if(image){
          const s3Response = await fetch('/api/s3-upload', {
              method: 'POST',
              body: (() => {
                  const formData = new FormData();
                  formData.append("file", image!);
                  formData.append("folder_name", "questions"); //specify a folder in S3
                  return formData;
              })()
          });

          if (!s3Response.ok) {
            const uploadError = await s3Response.json().catch(() => ({} as { error?: string }));
            throw new Error(uploadError.error ?? 'Image upload failed.');
          }

          const { url } = await s3Response.json();
          uploadedImageUrl = url;
        }

        questionsToCreate = [...questionsToCreate, {
          statement: question,
          topicId: selectedTopic,
          correctWritten: answer,
          options,
          correctOption: correctOption!,
          imageUrl: uploadedImageUrl,
        }];
      }


      // Call API to create question in the backend
      const createResponse = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: questionsToCreate })
      });
      if (!createResponse.ok) {
        const createError = await createResponse.json().catch(() => ({} as { error?: string }));
        throw new Error(createError.error ?? 'Failed to create question.');
      }
      // Redirect to questions list page
      router.push('/admin/questions');
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
        setErrors({ question: message }); // show UI error
    } finally{
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload JSON File Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Questions (Optional)</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
          <input
            type="file"
            accept=".json"
            onChange={handleJsonUpload}
            className="hidden"
            id="json-upload"
          />
          <label htmlFor="json-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {jsonFile ? jsonFile.name : 'Click to upload JSON file'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Upload multiple questions at once</p>
          </label>
        </div>
      </div>

      {/* Add a New Question Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add a New Question</h2>

        {/* Topic Selection */}
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
            disabled={isLoadingTopics}
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
          {errors.selectedTopic ? (
            <p className="mt-2 text-xs text-red-500">{errors.selectedTopic}</p>
          ) : null}
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
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errors.question) {
                  setErrors((prev) => ({ ...prev, question: undefined }));
                }
              }}
              placeholder="Enter new question ..."
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.question ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.question ? <p className="mt-2 text-xs text-red-500">{errors.question}</p> : null}
          </div>

          {/* Answer */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer <span className="text-red-500">*</span>
            </label>
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
            {errors.answer ? (
              <p className="mt-2 text-xs text-red-500">{errors.answer}</p>
            ) : (
              <p className="mt-2 text-xs text-gray-500">Answer is stored as a JSON string.</p>
            )}
          </div>

          {/* Image Upload (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image <span className="text-gray-400">(Optional)</span>
            </label>
            {imagePreviewUrl ? (
              <div className="mb-3 flex justify-center">
                <Image
                  src={imagePreviewUrl}
                  alt="Selected question image preview"
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
                  {image ? image.name : 'Upload your image'}
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* MCQ Type Section */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 mb-2">
            MCQ type <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            You need at least two options. Click the correct answer{' '} <span className="text-red-500">*</span>
          </p>

          {/* Options */}
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
                      placeholder="Enter your option"
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
          {errors.options ? <p className="mt-2 text-xs text-red-500">{errors.options}</p> : null}
          {errors.correctOption ? <p className="mt-1 text-xs text-red-500">{errors.correctOption}</p> : null}

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
