'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'

export default function CreateTopicPage() {
  const router = useRouter();
  const [topicName, setTopicName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ topicName?: string; image?: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };
  // Check if topic name and image are empty
  const validate = () => {
    const newErrors: { topicName?: string; image?: string } = {};
    if (!topicName.trim()) newErrors.topicName = 'Topic name is required.';
    if (!imageFile) newErrors.image = 'Topic image is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Step 1: Validate inputs to ensure topic name is not empty and an image file is selected
    if (!validate()) return;
    // Step 2: Check if the topic name already exists by making an API call to your backend
    const topicExists = await fetch(`/api/topics/exists?name=${encodeURIComponent(topicName)}`);
    const {exists} = await topicExists.json();
    if(exists){
        setErrors({ topicName: 'Topic name already exists. Please choose a different name.' });
        return;
    }
    // Step 3: Upload imageFile to S3, get back URL
    const s3Response = await fetch('/api/s3-upload', {
        method: 'POST',
        body: (() => {
            const formData = new FormData();
            formData.append("file", imageFile!);
            formData.append("folder_name", "topics"); //specify a folder in S3
            return formData;
        })()
    });
    const { url } = await s3Response.json();
    // Step 4: Create new topic + image in database
    await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: topicName,
        imageUrl: url
      })
    });
    // Step 5: Redirect to all topics page
    router.push('/admin/topics');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            onChange={(e) => {
              setTopicName(e.target.value);
              setErrors((prev) => ({ ...prev, topicName: undefined }));
            }}
            placeholder="Enter topic name..."
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.topicName ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.topicName && (
            <p className="mt-1 text-sm text-red-500">{errors.topicName}</p>
          )}
        </div>

        {/* Topic Image */}
        <div className="mb-6">
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
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="h-64 w-64 object-cover rounded-lg"
                  width={500}
                  height={500}
                />
                <p className="text-sm text-gray-500">{imageFile?.name}</p>
                <p className="text-xs text-primary-600 underline">Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
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
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
          )}
        </div>
      </div>

      {/* Actions */}
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
