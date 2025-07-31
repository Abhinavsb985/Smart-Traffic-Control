import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const ROLES = [
  { value: 'ambulance', label: 'Ambulance Driver / Fireforce' },
  { value: 'school_bus', label: 'School Bus Driver / Taxi' },
  { value: 'casual', label: 'Casual Driver' },
]

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Basic validation
    if (!email || !password || !role) {
      setError('Please fill in all fields and select your role.')
      setLoading(false)
      return
    }

    try {
      let authResult
      if (isLogin) {
        authResult = await signIn(email, password)
      } else {
        authResult = await signUp(email, password)
      }
      const { error } = authResult
      if (error) {
        setError(error.message)
      } else {
        // Save role in localStorage/sessionStorage
        localStorage.setItem('userRole', role)
        setMessage(isLogin ? 'Login successful!' : 'Check your email for the confirmation link!')
        // Optionally, redirect to dashboard here
        // window.location.href = `/dashboard?role=${role}`
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: 'url(/WhatsApp%20Image%202025-07-26%20at%2012.17.50%20PM.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8">
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
              <div className="mt-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Select your role
                </label>
                <select
                  id="role"
                  name="role"
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  required
                >
                  <option value="">-- Choose your role --</option>
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
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
    </div>
  )
}

export default Auth 