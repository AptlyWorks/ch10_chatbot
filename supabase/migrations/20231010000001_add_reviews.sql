-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    rating INTEGER,
    title TEXT,
    content TEXT,
    author TEXT,
    date TEXT,
    helpful_votes INTEGER,
    verified_perchase TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public select on reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert on reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on reviews" ON reviews FOR DELETE USING (true);
