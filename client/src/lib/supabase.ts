import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'student' | 'teacher'
          full_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'student' | 'teacher'
          full_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'student' | 'teacher'
          full_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          subject_id: string
          question_text: string
          question_type: 'multiple_choice' | 'true_false' | 'short_answer'
          options: string[] | null
          correct_answer: string
          difficulty: 'easy' | 'medium' | 'hard'
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          question_text: string
          question_type: 'multiple_choice' | 'true_false' | 'short_answer'
          options?: string[] | null
          correct_answer: string
          difficulty: 'easy' | 'medium' | 'hard'
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          question_text?: string
          question_type?: 'multiple_choice' | 'true_false' | 'short_answer'
          options?: string[] | null
          correct_answer?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          created_at?: string
        }
      }
      student_answers: {
        Row: {
          id: string
          student_id: string
          question_id: string
          answer: string
          is_correct: boolean
          answered_at: string
        }
        Insert: {
          id?: string
          student_id: string
          question_id: string
          answer: string
          is_correct: boolean
          answered_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          question_id?: string
          answer?: string
          is_correct?: boolean
          answered_at?: string
        }
      }
      student_progress: {
        Row: {
          id: string
          student_id: string
          subject_id: string
          total_questions: number
          correct_answers: number
          last_activity: string
        }
        Insert: {
          id?: string
          student_id: string
          subject_id: string
          total_questions?: number
          correct_answers?: number
          last_activity?: string
        }
        Update: {
          id?: string
          student_id?: string
          subject_id?: string
          total_questions?: number
          correct_answers?: number
          last_activity?: string
        }
      }
    }
  }
} 