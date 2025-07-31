import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const [showReportModal, setShowReportModal] = useState(false)
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLocationSelect = () => {
    // Simulate location selection
    setSelectedLocation({ lat: 10.5276, lng: 76.2144 })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      setMessage('Please provide a description')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Simulate report submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form and close modal
      setDescription('')
      setSelectedImage(null)
      setSelectedLocation(null)
      setShowReportModal(false)
      setMessage('Report submitted successfully!')

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to submit report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Kottakkal Road Reports
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section - Simplified */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Map View</h2>
            <div className="h-96 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Interactive Map Coming Soon</p>
                <button
                  onClick={handleLocationSelect}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                >
                  Select Kottakkal Location
                </button>
              </div>
            </div>
          </div>

          {/* Report Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Report a Problem</h2>
            <p className="text-gray-600 mb-6">
              Click the button to select a location, then click "Report a Problem" to submit road problem reports.
            </p>
            
            {selectedLocation && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  Location selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            )}

            <button
              onClick={() => setShowReportModal(true)}
              disabled={!selectedLocation}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Report a Problem
            </button>

            {message && (
              <div className={`mt-4 p-3 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Report a Problem</h3>
            
            <form onSubmit={handleSubmitReport}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe the road problem (e.g., pothole, road block, etc.)"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {selectedLocation && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Location: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading || !description.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 