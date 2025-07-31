import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('Failed to initialize authentication')
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        setError('Failed to connect to authentication service')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { error }
    } catch (err) {
      console.error('Sign up error:', err)
      return { error: { message: 'Failed to sign up. Please try again.' } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (err) {
      console.error('Sign in error:', err)
      return { error: { message: 'Failed to sign in. Please try again.' } }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 