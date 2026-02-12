export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Topics</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          <p className="text-sm text-gray-600 mt-1">Across all categories</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Questions</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          <p className="text-sm text-gray-600 mt-1">Available for practice</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Active Users</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          <p className="text-sm text-gray-600 mt-1">Currently studying</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 text-xl">+</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Add New Topic</h3>
              <p className="text-sm text-gray-600">Create a new topic for students</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 text-xl">+</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Add New Question</h3>
              <p className="text-sm text-gray-600">Create a practice question</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}
