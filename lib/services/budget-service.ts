import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

export class BudgetService {
  private static instance: BudgetService
  
  private constructor() {}
  
  static getInstance(): BudgetService {
    if (!BudgetService.instance) {
      BudgetService.instance = new BudgetService()
    }
    return BudgetService.instance
  }

  async createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Promise<Budget> {
    if (!isSupabaseConfigured || !supabase) {
      // Return mock data for demo
      return {
        id: `budget_${Date.now()}`,
        ...budget,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('budgets')
      .insert([budget])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getBudgets(userId: string): Promise<Budget[]> {
    if (!isSupabaseConfigured || !supabase) {
      // Return mock data for demo
      return [
        {
          id: 'budget_1',
          user_id: userId,
          name: 'Monthly Essentials',
          category: 'airtime',
          amount: 10000,
          spent: 3500,
          period: 'monthly',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          alert_threshold: 80,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget> {
    if (!isSupabaseConfigured || !supabase) {
      // Return mock updated data
      return {
        id,
        user_id: 'demo_user',
        name: 'Updated Budget',
        category: 'airtime',
        amount: 15000,
        spent: 5000,
        period: 'monthly',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        alert_threshold: 75,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates
      }
    }

    const { data, error } = await supabase
      .from('budgets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteBudget(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      // Mock deletion for demo
      return
    }

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async updateBudgetSpending(userId: string, category: string, amount: number): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      // Mock update for demo
      return
    }

    const { error } = await supabase.rpc('update_budget_spending', {
      p_user_id: userId,
      p_category: category,
      p_amount: amount
    })

    if (error) throw error
  }
}

export interface Budget {
  id: string
  user_id: string
  name: string
  category: 'airtime' | 'data' | 'cable' | 'electricity' | 'wallet_funding' | 'all'
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

export interface BudgetAlert {
  id: string
  budget_id: string
  message: string
  type: 'warning' | 'danger' | 'info'
  threshold_reached: number
  created_at: string
  is_dismissed: boolean
}

export const budgetService = BudgetService.getInstance()
