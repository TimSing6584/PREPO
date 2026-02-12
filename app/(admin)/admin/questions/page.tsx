export default function QuestionsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Questions</h2>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            + Add Question
          </button>
        </div>
        
        <div className="text-center py-12">
          <p className="text-gray-500">No questions available yet</p>
          <p className="text-sm text-gray-400 mt-2">Create your first question to get started</p>
        </div>
      </div>
    </div>
  );
}
