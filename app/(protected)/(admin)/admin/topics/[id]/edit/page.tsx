'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditTopicPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.id as string;

  const [topicName, setTopicName] = useState('');
  const [originalTopicName, setOriginalTopicName] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ topicName?: string; image?: string; form?: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadTopic = async () => {
      try {
        const response = await fetch(`/api/topics/${topicId}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result?.error ?? 'Failed to fetch topic');
        }

        const result = await response.json();
        const topic = result?.data;
        setTopicName(topic?.name ?? '');
        setOriginalTopicName(topic?.name ?? '');
        setOriginalImageUrl(topic?.imageUrl ?? '');
        setImagePreview(topic?.imageUrl ?? null);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        const message = error instanceof Error ? error.message : 'Failed to fetch topic';
        setErrors({ form: message });
      } finally {
        setIsLoading(false);
      }
    };

    loadTopic();
    return () => controller.abort();
  }, [topicId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined, form: undefined }));
  };

  const validate = () => {
    const newErrors: { topicName?: string; image?: string; form?: string } = {};
    if (!topicName.trim()) newErrors.topicName = 'Topic name is required.';
    if (!imagePreview && !imageFile) newErrors.image = 'Topic image is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (topicName.trim() !== originalTopicName.trim()) {
        const topicExists = await fetch(`/api/topics/exists?name=${encodeURIComponent(topicName.trim())}`);
        const { exists } = await topicExists.json();
        if (exists) {
          setErrors({ topicName: 'Topic name already exists. Please choose a different name.' });
          return;
        }
      }

      let imageUrl = originalImageUrl;

      if (imageFile) {
        const s3Response = await fetch('/api/s3-upload', {
          method: 'POST',
          body: (() => {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('folder_name', 'topics');
            return formData;
          })(),
        });

        if (!s3Response.ok) {
          const result = await s3Response.json().catch(() => ({}));
          throw new Error(result?.error ?? 'Failed to upload image');
        }

        const uploadResult = await s3Response.json();
        imageUrl = uploadResult?.url ?? imageUrl;
      }

      const updateResponse = await fetch(`/api/topics/${topicId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: topicName,
          imageUrl,
        }),
      });

      if (!updateResponse.ok) {
        const result = await updateResponse.json().catch(() => ({}));
        throw new Error(result?.error ?? 'Failed to update topic');
      }

      router.push('/admin/topics');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update topic';
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Modify Topic</h2>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading topic...</p>
        ) : null}
        {errors.form ? <p className="mb-4 text-sm text-red-500">{errors.form}</p> : null}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => {
              setTopicName(e.target.value);
              setErrors((prev) => ({ ...prev, topicName: undefined, form: undefined }));
            }}
            placeholder="Enter topic name..."
            disabled={isLoading || isSubmitting}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.topicName ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.topicName && (
            <p className="mt-1 text-sm text-red-500">{errors.topicName}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic Image <span className="text-red-500">*</span>
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
              errors.image ? 'border-red-400' : 'border-gray-300'
            }`}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {imagePreview ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Topic preview"
                  className="h-64 w-64 object-cover rounded-lg"
                />
                <p className="text-xs text-primary-600 underline">Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-medium">Click to upload an image</p>
                <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleImageChange}
            disabled={isLoading || isSubmitting}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.push('/admin/topics')}
          disabled={isSubmitting}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || isSubmitting}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
