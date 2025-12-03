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
      products_sneaker: {
        Row: {
          id: string
          name: string
          brand: string
          price: number
          image_url: string
          category: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          price: number
          image_url: string
          category: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          price?: number
          image_url?: string
          category?: string
          description?: string | null
          created_at?: string
        }
      }
      cart_sneaker: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          size: string | null
          session_id: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          size?: string | null
          session_id?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          size?: string | null
          session_id?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          nickname: string
          status: 'valid' | 'deleted'
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          nickname: string
          status?: 'valid' | 'deleted'
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          nickname?: string
          status?: 'valid' | 'deleted'
          created_at?: string
          deleted_at?: string | null
        }
      }
    }
  }
}

