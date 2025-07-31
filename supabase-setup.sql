-- Supabase Database Setup for Kottakkal Road Reports
-- Run these commands in your Supabase SQL Editor

-- 1. Create the reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  image_url TEXT,
  location TEXT NOT NULL,
  user_email TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy that allows all operations (for demo purposes)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations on reports" ON reports
  FOR ALL USING (true);

-- 4. Create storage bucket for images (run this in Storage section)
-- Go to Storage in your Supabase dashboard and create a bucket named 'reports-images'
-- Set it to public access

-- 5. Create storage policy for images
CREATE POLICY "Allow public access to reports-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'reports-images');

CREATE POLICY "Allow authenticated uploads to reports-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'reports-images');

-- 6. Test the table (optional)
INSERT INTO reports (description, location, user_email, latitude, longitude)
VALUES ('Test report', 'Kottakkal, Kerala', 'test@example.com', 10.5276, 76.2144);

-- 7. View the test data
SELECT * FROM reports; 