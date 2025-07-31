import { createClient } from '@supabase/supabase-js'

// TODO: Replace these with your NEW Supabase project URL and anon key
// Go to your Supabase dashboard → Settings → API to get these values
const supabaseUrl = 'https://acfblxdrmevsyulwaaom.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZmJseGRybWV2c3l1bHdhYW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTgyMDcsImV4cCI6MjA2OTA5NDIwN30.VYO7uFzEx4BrV2Zb78ts3Bewk59EH3INQ7UHDEbUgsA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function to check Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    
    // Test 1: Check if we can connect to Supabase
    const { data, error } = await supabase
      .from('reports')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return {
        success: false,
        error: error.message,
        details: 'Database connection test failed'
      }
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('✅ Database query executed successfully')
    
    // Test 2: Check if reports table exists and is accessible
    const { data: tableData, error: tableError } = await supabase
      .from('reports')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Reports table access failed:', tableError)
      return {
        success: false,
        error: tableError.message,
        details: 'Reports table not accessible - check if table exists and RLS policies are correct'
      }
    }
    
    console.log('✅ Reports table is accessible!')
    console.log('✅ Current reports count:', tableData?.length || 0)
    
    return {
      success: true,
      message: 'Supabase connection and database access working correctly',
      reportsCount: tableData?.length || 0
    }
    
  } catch (err) {
    console.error('❌ Unexpected error testing Supabase:', err)
    return {
      success: false,
      error: 'Unexpected error occurred',
      details: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}

// Database table structure for reports:
// CREATE TABLE reports (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id UUID REFERENCES auth.users(id),
//   description TEXT NOT NULL,
//   image_url TEXT,
//   latitude DECIMAL(10, 8),
//   longitude DECIMAL(11, 8),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// Storage bucket for images:
// Create a storage bucket named 'reports-images' with public access 