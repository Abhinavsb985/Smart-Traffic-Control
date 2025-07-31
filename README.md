<<<<<<< HEAD
# Smart-Traffic-Control
A responsive web application for reporting road problems in Kottakkal, Kerala. Users can log in, view a map centered around Kottakkal, and submit reports with descriptions, images, and location data.
=======
# Kottakkal Road Reports

A responsive web application for reporting road problems in Kottakkal, Kerala. Users can log in, view a map centered around Kottakkal, and submit reports with descriptions, images, and location data.

## Features

- **Authentication**: Email/password login and signup using Supabase Auth
- **Interactive Map**: Leaflet.js map centered on Kottakkal with click-to-select location
- **Report Submission**: Modal form for submitting road problem reports
- **Image Upload**: Optional image upload with Supabase Storage
- **Location Capture**: Automatic location capture from map clicks
- **Responsive Design**: Clean, modern UI that works on all devices
- **Real-time Updates**: Reports are immediately visible on the map

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js with react-leaflet
- **Backend**: Supabase (Auth, Database, Storage)
- **Build Tool**: Vite

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd kottakkal-reports
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabaseo.cm](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Update `src/lib/supabase.ts` with your credentials:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

### 3. Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Create the reports table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  description TEXT NOT NULL,
  image_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert
CREATE POLICY "Users can insert their own reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view all reports
CREATE POLICY "Users can view all reports" ON reports
  FOR SELECT USING (true);
```

### 4. Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `reports-images`
3. Set the bucket to public access
4. Create a policy for authenticated users to upload:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'reports-images' AND auth.role() = 'authenticated');

-- Allow public access to view images
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'reports-images');
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Sign Up/Login**: Create an account or sign in with your email
2. **Select Location**: Click anywhere on the map to select a location
3. **Report Problem**: Click "Report a Problem" button
4. **Fill Form**: Add description, optionally upload an image
5. **Submit**: Your report will be saved and displayed on the map

## Project Structure

```
src/
├── components/
│   ├── Auth.tsx          # Login/Signup component
│   └── Dashboard.tsx     # Main dashboard with map and reports
├── contexts/
│   └── AuthContext.tsx   # Authentication state management
├── lib/
│   └── supabase.ts       # Supabase client configuration
├── App.tsx               # Main app component
├── main.tsx              # Entry point
└── index.css             # Global styles with Tailwind
```

## Environment Variables

For production, consider using environment variables:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then update `src/lib/supabase.ts`:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## Features in Detail

### Authentication
- Email/password authentication
- Automatic session management
- Protected routes based on auth state

### Map Integration
- Centered on Kottakkal coordinates (10.5276, 76.2144)
- Click to select location for reports
- Display existing reports as markers
- Popup with report details and images

### Report System
- Modal form for report submission
- Image upload with preview
- Location validation
- Success/error feedback
- Real-time map updates

### Responsive Design
- Mobile-first approach
- Clean, modern UI
- Accessible form controls
- Loading states and feedback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own road reporting applications. 

---

## Traffic Intensity Dashboard (Python + Dash)

This project includes a separate, modern traffic visualization dashboard built with Python, Dash, and Plotly.

### How to Run the Dashboard

1. Navigate to the `traffic_dashboard` directory:
   ```
   cd traffic_dashboard
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the app:
   ```
   python app.py
   ```
4. Open your browser at [http://127.0.0.1:8050](http://127.0.0.1:8050)

### Features
- Interactive heatmap, time-series, and bar chart
- Filter by time range and location
- Responsive, modern UI

--- 
>>>>>>> 654e891 (Update project files)
