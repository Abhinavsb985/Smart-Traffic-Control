# Quick Setup Guide

## 1. Supabase Configuration

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Settings > API
3. Copy your Project URL and anon public key
4. Update `src/lib/supabase.ts`:

```typescript
const supabaseUrl = 'https://udgdoexwzuxcvkiearbt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkZ2RvZXh3enV4Y3ZraWVhcmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0OTgwOTksImV4cCI6MjA2OTA3NDA5OX0.CsxD-D6ruxV3WE9CX_h4ETW29AxHZO4YEQKxg-VCNDw'
```

## 2. Database Setup

In your Supabase SQL Editor, run:

```sql
-- Create reports table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  description TEXT NOT NULL,
  image_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own reports
CREATE POLICY "Users can insert their own reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to view all reports
CREATE POLICY "Users can view all reports" ON reports
  FOR SELECT USING (true);
```

## 3. Storage Setup

1. Go to Storage in Supabase dashboard
2. Create bucket named `reports-images`
3. Set to public access
4. Add policies in SQL Editor:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'reports-images' AND auth.role() = 'authenticated');

-- Allow public to view images
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'reports-images');
```

## 4. Run the App

```bash
npm run dev
```

Visit http://localhost:5173

## 5. Test the App

1. Sign up with your email
2. Click on the map to select a location
3. Click "Report a Problem"
4. Fill in description and optionally upload an image
5. Submit - your report will appear on the map! 