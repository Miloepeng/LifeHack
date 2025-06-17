-- Simple Database Schema without circular RLS dependencies
-- Run this SQL in your Supabase SQL Editor

-- Drop existing policies and tables if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can view all student profiles" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can view skills" ON public.skills;
DROP POLICY IF EXISTS "Teachers can manage skills" ON public.skills;
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON public.skills;
DROP POLICY IF EXISTS "Everyone can view questions" ON public.questions;
DROP POLICY IF EXISTS "Students can view their own training log" ON public.training_log;
DROP POLICY IF EXISTS "Students can insert their own training log" ON public.training_log;
DROP POLICY IF EXISTS "Users can manage their own training log" ON public.training_log;
DROP POLICY IF EXISTS "Teachers can view all training logs" ON public.training_log;
DROP POLICY IF EXISTS "Students can view their own skill state" ON public.skill_state;
DROP POLICY IF EXISTS "Students can update their own skill state" ON public.skill_state;
DROP POLICY IF EXISTS "Students can insert their own skill state" ON public.skill_state;
DROP POLICY IF EXISTS "Users can manage their own skill state" ON public.skill_state;
DROP POLICY IF EXISTS "Teachers can view all skill states" ON public.skill_state;
DROP POLICY IF EXISTS "Everyone can view bkt models" ON public.bkt_model_state;
DROP POLICY IF EXISTS "Authenticated users can manage bkt models" ON public.bkt_model_state;

DROP TRIGGER IF EXISTS training_log_skill_update ON public.training_log;
DROP FUNCTION IF EXISTS update_skill_state_after_question();

DROP TABLE IF EXISTS public.bkt_model_state CASCADE;
DROP TABLE IF EXISTS public.skill_state CASCADE;
DROP TABLE IF EXISTS public.training_log CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Profiles table
CREATE TABLE public.profiles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('student', 'teacher')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Skills table
CREATE TABLE public.skills (
    skill_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Questions table
CREATE TABLE public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_id UUID REFERENCES public.skills(skill_id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')) NOT NULL,
    options TEXT[], -- JSON array for multiple choice options
    correct_answer TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
    estimated_time_seconds INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Training Log
CREATE TABLE public.training_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(skill_id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    correct BOOLEAN NOT NULL,
    opportunity INTEGER NOT NULL,
    response_time_seconds INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Skill State
CREATE TABLE public.skill_state (
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(skill_id) ON DELETE CASCADE NOT NULL,
    opportunity INTEGER DEFAULT 0 NOT NULL,
    estimated_mastery REAL DEFAULT 0.0 NOT NULL CHECK (estimated_mastery >= 0.0 AND estimated_mastery <= 1.0),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    prior_knowledge REAL DEFAULT 0.1,
    learn_rate REAL DEFAULT 0.1,
    guess_rate REAL DEFAULT 0.2,
    slip_rate REAL DEFAULT 0.1,
    PRIMARY KEY (user_id, skill_id)
);

-- BKT Model State table
CREATE TABLE public.bkt_model_state (
    skill_id UUID REFERENCES public.skills(skill_id) ON DELETE CASCADE PRIMARY KEY,
    model_version INTEGER DEFAULT 1,
    prior_knowledge REAL DEFAULT 0.1,
    learn_rate REAL DEFAULT 0.1,
    guess_rate REAL DEFAULT 0.2,
    slip_rate REAL DEFAULT 0.1,
    last_trained TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    training_samples INTEGER DEFAULT 0,
    model_accuracy REAL DEFAULT 0.0
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bkt_model_state ENABLE ROW LEVEL SECURITY;

-- SIMPLE RLS Policies (no circular dependencies)

-- Profiles: Users can manage their own profiles only
CREATE POLICY "Users can manage their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = user_id);

-- Skills: Everyone can view and manage (simplified)
CREATE POLICY "Allow all operations on skills" ON public.skills
    FOR ALL USING (true);

-- Questions: Everyone can view and manage (simplified)
CREATE POLICY "Allow all operations on questions" ON public.questions
    FOR ALL USING (true);

-- Training log: Users can manage their own data only
CREATE POLICY "Users can manage their own training log" ON public.training_log
    FOR ALL USING (auth.uid() = user_id);

-- Skill state: Users can manage their own skill state only
CREATE POLICY "Users can manage their own skill state" ON public.skill_state
    FOR ALL USING (auth.uid() = user_id);

-- BKT model state: Allow all operations (simplified)
CREATE POLICY "Allow all operations on bkt models" ON public.bkt_model_state
    FOR ALL USING (true);

-- Insert sample skills
INSERT INTO public.skills (name, description, difficulty_level) VALUES
    ('JavaScript Fundamentals', 'Learn the basics of JavaScript programming', 'beginner'),
    ('React Components', 'Understanding React component lifecycle', 'intermediate'),
    ('TypeScript Basics', 'Type-safe JavaScript development', 'intermediate'),
    ('CSS Flexbox', 'Modern CSS layout techniques', 'beginner'),
    ('Node.js Basics', 'Server-side JavaScript development', 'intermediate'),
    ('Database Design', 'Relational database concepts', 'advanced'),
    ('API Development', 'Building REST APIs', 'advanced');

-- Insert sample questions
DO $$
DECLARE
    js_id UUID;
    react_id UUID;
    css_id UUID;
BEGIN
    SELECT skill_id INTO js_id FROM public.skills WHERE name = 'JavaScript Fundamentals' LIMIT 1;
    SELECT skill_id INTO react_id FROM public.skills WHERE name = 'React Components' LIMIT 1;
    SELECT skill_id INTO css_id FROM public.skills WHERE name = 'CSS Flexbox' LIMIT 1;

    -- JavaScript questions
    INSERT INTO public.questions (skill_id, question_text, question_type, options, correct_answer, difficulty, estimated_time_seconds) VALUES
        (js_id, 'What is the result of 5 + "5" in JavaScript?', 'multiple_choice', ARRAY['10', '55', 'Error', 'NaN'], '55', 'easy', 30),
        (js_id, 'Which keyword is used to declare a variable in JavaScript?', 'multiple_choice', ARRAY['var', 'let', 'const', 'All of the above'], 'All of the above', 'easy', 30),
        (js_id, 'Is JavaScript case-sensitive?', 'true_false', NULL, 'True', 'easy', 20);

    -- React questions
    INSERT INTO public.questions (skill_id, question_text, question_type, options, correct_answer, difficulty, estimated_time_seconds) VALUES
        (react_id, 'What is JSX?', 'short_answer', NULL, 'JavaScript XML', 'medium', 60),
        (react_id, 'Which hook is used for state management in functional components?', 'multiple_choice', ARRAY['useEffect', 'useState', 'useContext', 'useReducer'], 'useState', 'medium', 45);

    -- CSS questions
    INSERT INTO public.questions (skill_id, question_text, question_type, options, correct_answer, difficulty, estimated_time_seconds) VALUES
        (css_id, 'What does "flex: 1" mean in CSS Flexbox?', 'short_answer', NULL, 'Grow to fill available space', 'medium', 60),
        (css_id, 'Is "display: flex" applied to the container or items?', 'multiple_choice', ARRAY['Container', 'Items', 'Both', 'Neither'], 'Container', 'easy', 30);
END $$;

-- Initialize BKT model state for each skill
INSERT INTO public.bkt_model_state (skill_id)
SELECT skill_id FROM public.skills; 