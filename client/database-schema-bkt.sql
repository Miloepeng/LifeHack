-- Enhanced Database Schema for AI Learning Platform with Bayesian Knowledge Tracing
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.training_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.skill_state ENABLE ROW LEVEL SECURITY;

-- Table 1: Login details (enhanced profiles table)
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- We'll let Supabase handle auth, but keeping for reference
    role TEXT CHECK (role IN ('student', 'teacher')) NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Skills table (enhanced subjects)
CREATE TABLE IF NOT EXISTS public.skills (
    skill_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Questions table (enhanced with skill mapping)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    skill_id UUID REFERENCES public.skills(skill_id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')) NOT NULL,
    options TEXT[], -- JSON array for multiple choice options
    correct_answer TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
    estimated_time_seconds INTEGER DEFAULT 60, -- Expected time to answer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table 2: Training Log - tracks every student interaction
CREATE TABLE IF NOT EXISTS public.training_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(skill_id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    correct BOOLEAN NOT NULL, -- 1 for correct, 0 for incorrect
    opportunity INTEGER NOT NULL, -- Opportunity number for this skill (1st time, 2nd time, etc.)
    response_time_seconds INTEGER, -- Time taken to answer
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table 3: Skill State - tracks current mastery for each user-skill combination
CREATE TABLE IF NOT EXISTS public.skill_state (
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(skill_id) ON DELETE CASCADE NOT NULL,
    opportunity INTEGER DEFAULT 0 NOT NULL, -- Total opportunities attempted
    estimated_mastery REAL DEFAULT 0.0 NOT NULL CHECK (estimated_mastery >= 0.0 AND estimated_mastery <= 1.0),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- BKT Parameters (learned from data)
    prior_knowledge REAL DEFAULT 0.1,
    learn_rate REAL DEFAULT 0.1,
    guess_rate REAL DEFAULT 0.2,
    slip_rate REAL DEFAULT 0.1,
    
    PRIMARY KEY (user_id, skill_id)
);

-- BKT Model State table - stores global model parameters
CREATE TABLE IF NOT EXISTS public.bkt_model_state (
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

-- Function to update skill state after each question
CREATE OR REPLACE FUNCTION update_skill_state_after_question()
RETURNS TRIGGER AS $$
DECLARE
    current_mastery REAL;
    new_mastery REAL;
    learn_rate REAL;
    guess_rate REAL;
    slip_rate REAL;
BEGIN
    -- Get current skill state parameters
    SELECT estimated_mastery, ss.learn_rate, ss.guess_rate, ss.slip_rate
    INTO current_mastery, learn_rate, guess_rate, slip_rate
    FROM public.skill_state ss
    WHERE ss.user_id = NEW.user_id AND ss.skill_id = NEW.skill_id;
    
    -- If no existing state, initialize with defaults
    IF NOT FOUND THEN
        INSERT INTO public.skill_state (user_id, skill_id, opportunity, estimated_mastery)
        VALUES (NEW.user_id, NEW.skill_id, 1, 0.1);
        current_mastery := 0.1;
        learn_rate := 0.1;
        guess_rate := 0.2;
        slip_rate := 0.1;
    END IF;
    
    -- Simple BKT update (Bayesian update)
    IF NEW.correct THEN
        -- Correct answer: P(L_t+1 | correct) 
        new_mastery := (current_mastery * (1 - slip_rate)) / 
                       (current_mastery * (1 - slip_rate) + (1 - current_mastery) * guess_rate);
    ELSE
        -- Incorrect answer: P(L_t+1 | incorrect)
        new_mastery := (current_mastery * slip_rate) / 
                       (current_mastery * slip_rate + (1 - current_mastery) * (1 - guess_rate));
    END IF;
    
    -- Apply learning (transition)
    new_mastery := new_mastery + (1 - new_mastery) * learn_rate;
    
    -- Update skill state
    UPDATE public.skill_state 
    SET 
        opportunity = NEW.opportunity,
        estimated_mastery = new_mastery,
        last_updated = NEW.timestamp
    WHERE user_id = NEW.user_id AND skill_id = NEW.skill_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update skill state
DROP TRIGGER IF EXISTS training_log_skill_update ON public.training_log;
CREATE TRIGGER training_log_skill_update
    AFTER INSERT ON public.training_log
    FOR EACH ROW EXECUTE FUNCTION update_skill_state_after_question();

-- Row Level Security Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all student profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- Skills policies
CREATE POLICY "Everyone can view skills" ON public.skills
    FOR SELECT USING (true);

CREATE POLICY "Teachers can manage skills" ON public.skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- Training log policies
CREATE POLICY "Students can view their own training log" ON public.training_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own training log" ON public.training_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can view all training logs" ON public.training_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- Skill state policies
CREATE POLICY "Students can view their own skill state" ON public.skill_state
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all skill states" ON public.skill_state
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

-- Insert sample skills
INSERT INTO public.skills (name, description, difficulty_level) VALUES
    ('Basic Arithmetic', 'Addition, subtraction, multiplication, division', 'beginner'),
    ('Algebra Basics', 'Variables, equations, and basic algebraic manipulation', 'intermediate'),
    ('Geometry Fundamentals', 'Shapes, angles, and basic geometric principles', 'intermediate'),
    ('Scientific Method', 'Understanding hypothesis, experimentation, and conclusions', 'beginner'),
    ('Cell Biology', 'Structure and function of cells', 'intermediate'),
    ('Grammar Basics', 'Parts of speech, sentence structure', 'beginner'),
    ('Reading Comprehension', 'Understanding and analyzing text', 'intermediate')
ON CONFLICT DO NOTHING;

-- Insert sample questions mapped to skills
DO $$
DECLARE
    arithmetic_id UUID;
    algebra_id UUID;
    grammar_id UUID;
BEGIN
    SELECT skill_id INTO arithmetic_id FROM public.skills WHERE name = 'Basic Arithmetic' LIMIT 1;
    SELECT skill_id INTO algebra_id FROM public.skills WHERE name = 'Algebra Basics' LIMIT 1;
    SELECT skill_id INTO grammar_id FROM public.skills WHERE name = 'Grammar Basics' LIMIT 1;

    -- Basic Arithmetic questions
    INSERT INTO public.questions (skill_id, question_text, question_type, options, correct_answer, difficulty, estimated_time_seconds) VALUES
        (arithmetic_id, 'What is 7 + 5?', 'multiple_choice', ARRAY['10', '12', '11', '13'], '12', 'easy', 30),
        (arithmetic_id, 'What is 15 - 8?', 'multiple_choice', ARRAY['6', '7', '8', '9'], '7', 'easy', 30),
        (arithmetic_id, 'What is 6 × 4?', 'multiple_choice', ARRAY['20', '22', '24', '26'], '24', 'medium', 45),
        (arithmetic_id, 'Is 20 ÷ 4 = 5?', 'true_false', NULL, 'True', 'easy', 20);

    -- Algebra questions
    INSERT INTO public.questions (skill_id, question_text, question_type, options, correct_answer, difficulty, estimated_time_seconds) VALUES
        (algebra_id, 'If x + 3 = 8, what is x?', 'short_answer', NULL, '5', 'medium', 60),
        (algebra_id, 'What is 2x when x = 4?', 'multiple_choice', ARRAY['6', '8', '10', '12'], '8', 'medium', 45);

    -- Grammar questions
    INSERT INTO public.questions (skill_id, question_text, question_type, options, correct_answer, difficulty, estimated_time_seconds) VALUES
        (grammar_id, 'Which word is a noun?', 'multiple_choice', ARRAY['quickly', 'run', 'beautiful', 'dog'], 'dog', 'easy', 30),
        (grammar_id, 'Is "The cat runs quickly" grammatically correct?', 'true_false', NULL, 'True', 'easy', 25);
END $$;

-- Initialize BKT model state for each skill
INSERT INTO public.bkt_model_state (skill_id)
SELECT skill_id FROM public.skills
ON CONFLICT DO NOTHING; 