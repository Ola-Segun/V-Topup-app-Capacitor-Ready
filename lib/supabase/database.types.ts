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
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string | null
          wallet_balance: number
          biometric_enabled: boolean
          push_token: string | null
          kyc_status: 'pending' | 'verified' | 'rejected'
          kyc_documents: Json | null
          created_at: string
          updated_at: string
          last_login: string | null
          is_active: boolean
          referral_code: string | null
          referred_by: string | null
          avatar_url: string | null
          preferences: Json | null
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          full_name?: string | null
          wallet_balance?: number
          biometric_enabled?: boolean
          push_token?: string | null
          kyc_status?: 'pending' | 'verified' | 'rejected'
          kyc_documents?: Json | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
          referral_code?: string | null
          referred_by?: string | null
          avatar_url?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          full_name?: string | null
          wallet_balance?: number
          biometric_enabled?: boolean
          push_token?: string | null
          kyc_status?: 'pending' | 'verified' | 'rejected'
          kyc_documents?: Json | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
          referral_code?: string | null
          referred_by?: string | null
          avatar_url?: string | null
          preferences?: Json | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'airtime' | 'data' | 'cable' | 'electricity' | 'wallet_funding' | 'transfer'
          amount: number
          recipient: string | null
          network: string | null
          reference: string
          description: string | null
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          metadata: Json | null
          created_at: string
          updated_at: string
          completed_at: string | null
          fee: number
          commission: number
          external_reference: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'airtime' | 'data' | 'cable' | 'electricity' | 'wallet_funding' | 'transfer'
          amount: number
          recipient?: string | null
          network?: string | null
          reference: string
          description?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          fee?: number
          commission?: number
          external_reference?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'airtime' | 'data' | 'cable' | 'electricity' | 'wallet_funding' | 'transfer'
          amount?: number
          recipient?: string | null
          network?: string | null
          reference?: string
          description?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          fee?: number
          commission?: number
          external_reference?: string | null
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          amount: number
          spent: number
          period: 'weekly' | 'monthly' | 'yearly'
          start_date: string
          end_date: string
          alert_threshold: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          amount: number
          spent?: number
          period: 'weekly' | 'monthly' | 'yearly'
          start_date: string
          end_date: string
          alert_threshold?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          amount?: number
          spent?: number
          period?: 'weekly' | 'monthly' | 'yearly'
          start_date?: string
          end_date?: string
          alert_threshold?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'transaction' | 'system' | 'promotion' | 'security' | 'budget'
          title: string
          message: string
          read: boolean
          metadata: Json | null
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'transaction' | 'system' | 'promotion' | 'security' | 'budget'
          title: string
          message: string
          read?: boolean
          metadata?: Json | null
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'transaction' | 'system' | 'promotion' | 'security' | 'budget'
          title?: string
          message?: string
          read?: boolean
          metadata?: Json | null
          created_at?: string
          read_at?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          email: string | null
          favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          email?: string | null
          favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          email?: string | null
          favorite?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      data_plans: {
        Row: {
          id: string
          network: string
          plan_name: string
          plan_code: string
          data_amount: string
          validity: string
          amount: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          network: string
          plan_name: string
          plan_code: string
          data_amount: string
          validity: string
          amount: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          network?: string
          plan_name?: string
          plan_code?: string
          data_amount?: string
          validity?: string
          amount?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      offline_queue: {
        Row: {
          id: string
          user_id: string
          action_type: string
          payload: Json
          retry_count: number
          created_at: string
          last_retry: string | null
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          payload: Json
          retry_count?: number
          created_at?: string
          last_retry?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: string
          payload?: Json
          retry_count?: number
          created_at?: string
          last_retry?: string | null
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          event_name: string
          event_data: Json | null
          session_id: string | null
          device_info: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_name: string
          event_data?: Json | null
          session_id?: string | null
          device_info?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_name?: string
          event_data?: Json | null
          session_id?: string | null
          device_info?: Json | null
          created_at?: string
        }
      }
      system_config: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      credit_wallet: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: boolean
      }
      debit_wallet: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: boolean
      }
      get_user_stats: {
        Args: {
          user_id: string
        }
        Returns: {
          total_transactions: number
          total_spent: number
          wallet_balance: number
          last_transaction: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
