-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth is required)
CREATE POLICY "Allow public select on chats" ON chats FOR SELECT USING (true);
CREATE POLICY "Allow public insert on chats" ON chats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on chats" ON chats FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on chats" ON chats FOR DELETE USING (true);

CREATE POLICY "Allow public select on messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert on messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on messages" ON messages FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on messages" ON messages FOR DELETE USING (true);
