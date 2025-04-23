export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          level: number
          eco_points: number
          streak_days: number
          co2_saved: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          level?: number
          eco_points?: number
          streak_days?: number
          co2_saved?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          level?: number
          eco_points?: number
          streak_days?: number
          co2_saved?: number
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          category: string
          value: number
          unit: string
          mode: string | null
          type: string | null
          co2_impact: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          value: number
          unit: string
          mode?: string | null
          type?: string | null
          co2_impact: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          value?: number
          unit?: string
          mode?: string | null
          type?: string | null
          co2_impact?: number
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string
          reward: number
          category: string
          start_date: string
          end_date: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          reward: number
          category: string
          start_date: string
          end_date: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          reward?: number
          category?: string
          start_date?: string
          end_date?: string
        }
      }
      user_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          progress: number
          completed: boolean
          joined_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          progress?: number
          completed?: boolean
          joined_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          progress?: number
          completed?: boolean
          joined_at?: string
        }
      }
    }
  }
}