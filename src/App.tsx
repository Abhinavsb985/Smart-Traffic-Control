import React, { useState, useEffect } from 'react'
import { supabase, testSupabaseConnection } from './lib/supabase'

interface Report {
  id: string
  description: string
  image_url?: string
  location: string
  created_at: string
  user_email: string
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  // Report modal states
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportDescription, setReportDescription] = useState('')
  const [reportImage, setReportImage] = useState<File | null>(null)
  const [reportLoading, setReportLoading] = useState(false)
  
  // Reports list
  const [reports, setReports] = useState<Report[]>([])
  const [showReports, setShowReports] = useState(false)
  const [loadingReports, setLoadingReports] = useState(false)

  // Test Supabase connection
  const handleTestConnection = async () => {
    setMessage('Testing Supabase connection...')
    const result = await testSupabaseConnection()
    
    if (result.success) {
      setMessage(`✅ Connection successful! Reports in database: ${result.reportsCount}`)
    } else {
      setError(`❌ Connection failed: ${result.error} - ${result.details}`)
    }
  }

  // Load reports from Supabase
  const loadReports = async () => {
    setLoadingReports(true)
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading reports:', error)
        setMessage(`Failed to load reports: ${error.message}`)
      } else {
        setReports(data || [])
      }
    } catch (error) {
      console.error('Error loading reports:', error)
      setMessage('Failed to load reports')
    } finally {
      setLoadingReports(false)
    }
  }

  // Load reports when logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadReports()
    }
  }, [isLoggedIn])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email && password) {
        setIsLoggedIn(true)
        setMessage('Login successful!')
      } else {
        setError('Please enter email and password')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    setReports([])
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportDescription.trim()) {
      setMessage('Please provide a description')
      return
    }

    setReportLoading(true)
    setMessage('')

    try {
      let imageUrl = null

      // Upload image to Supabase Storage if selected
      if (reportImage) {
        const fileName = `${Date.now()}-${reportImage.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('reports-images')
          .upload(fileName, reportImage)

        if (uploadError) {
          throw new Error('Failed to upload image')
        }

        const { data: urlData } = supabase.storage
          .from('reports-images')
          .getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
      }

      // Save report to Supabase database
      const { data, error } = await supabase.from('reports').insert({
        description: reportDescription.trim(),
        image_url: imageUrl,
        location: 'Kottakkal, Kerala (10.5276, 76.2144)',
        user_email: email,
        latitude: 10.5276,
        longitude: 76.2144
      })

      if (error) {
        console.error('Database error:', error)
        throw new Error(`Failed to save report: ${error.message}`)
      }

      // Reset form and close modal
      setReportDescription('')
      setReportImage(null)
      setShowReportModal(false)
      setMessage('Report submitted successfully and saved to database!')

      // Reload reports from database
      await loadReports()

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Report submission error:', error)
      setMessage('Failed to submit report. Please try again.')
    } finally {
      setReportLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReportImage(file)
    }
  }

  // Dashboard Component
  if (isLoggedIn) {
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
                  Welcome, {email}
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
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Map View</h2>
              <div className="h-96 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Interactive Map of Kottakkal</p>
                  <p className="text-sm text-gray-500">Coordinates: 10.5276, 76.2144</p>
                  {reports.length > 0 && (
                    <div className="mt-4 p-2 bg-blue-100 rounded">
                      <p className="text-sm text-blue-800">
                        {reports.length} report{reports.length > 1 ? 's' : ''} in database
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Report Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Report a Problem</h2>
              <p className="text-gray-600 mb-6">
                Report road problems like potholes, blocks, or other issues in Kottakkal.
              </p>
              
              {/* Test Connection Button */}
              <div className="mb-4">
                <button
                  onClick={handleTestConnection}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md mb-3"
                >
                  🔍 Test Supabase Connection
                </button>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                >
                  Report a Problem
                </button>
                
                <button 
                  onClick={() => setShowReports(!showReports)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {showReports ? 'Hide Reports' : `View Reports (${reports.length})`}
                </button>
              </div>

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

          {/* Reports List */}
          {showReports && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Reports from Database</h3>
                <button 
                  onClick={loadReports}
                  disabled={loadingReports}
                  className="text-indigo-600 hover:text-indigo-500 text-sm"
                >
                  {loadingReports ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              {loadingReports ? (
                <p className="text-gray-500 text-center py-8">Loading reports...</p>
              ) : reports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reports in database yet.</p>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{report.description}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Location:</strong> {report.location}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Submitted:</strong> {new Date(report.created_at).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>By:</strong> {report.user_email}
                          </p>
                        </div>
                        {report.image_url && (
                          <div className="ml-4">
                            <img 
                              src={report.image_url} 
                              alt="Report" 
                              className="w-20 h-20 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Report a Problem</h3>
              
              <form onSubmit={handleReportSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
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

                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Location: Kottakkal, Kerala (10.5276, 76.2144)
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={reportLoading || !reportDescription.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md"
                  >
                    {reportLoading ? 'Saving to Database...' : 'Submit Report'}
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

  // Login/Signup Component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Kottakkal Road Reports
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          {message && (
            <div className="text-green-600 text-sm text-center">{message}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App 