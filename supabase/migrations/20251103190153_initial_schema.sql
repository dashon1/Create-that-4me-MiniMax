-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'offline',
    email TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size TEXT,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI generations history
CREATE TABLE IF NOT EXISTS ai_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    prompt TEXT NOT NULL,
    result_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies: Allow all operations for anon and service_role
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon and service_role" ON projects
    FOR ALL USING (auth.role() IN ('anon', 'service_role'));

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon and service_role" ON tasks
    FOR ALL USING (auth.role() IN ('anon', 'service_role'));

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon and service_role" ON team_members
    FOR ALL USING (auth.role() IN ('anon', 'service_role'));

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon and service_role" ON assets
    FOR ALL USING (auth.role() IN ('anon', 'service_role'));

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon and service_role" ON ai_generations
    FOR ALL USING (auth.role() IN ('anon', 'service_role'));

-- Insert sample data
INSERT INTO team_members (name, role, status, avatar) VALUES
    ('Sarah Chen', 'Creative Director', 'online', 'SC'),
    ('Mike Johnson', 'Video Editor', 'online', 'MJ'),
    ('Emily Davis', 'Designer', 'away', 'ED'),
    ('Alex Kim', 'Developer', 'offline', 'AK');

INSERT INTO assets (name, type, size, created_at) VALUES
    ('Hero Banner.jpg', 'image', '2.1 MB', '2025-11-02'),
    ('Product Video.mp4', 'video', '45.2 MB', '2025-11-01'),
    ('Background Music.mp3', 'audio', '8.7 MB', '2025-10-30');
