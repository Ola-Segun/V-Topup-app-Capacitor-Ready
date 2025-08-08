-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('airtime', 'data', 'cable', 'electricity', 'wallet_funding', 'all')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  spent DECIMAL(12,2) DEFAULT 0 CHECK (spent >= 0),
  period VARCHAR(20) NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  alert_threshold INTEGER DEFAULT 80 CHECK (alert_threshold >= 0 AND alert_threshold <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_alerts table
CREATE TABLE IF NOT EXISTS budget_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('warning', 'danger', 'info')),
  threshold_reached INTEGER NOT NULL,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
CREATE INDEX IF NOT EXISTS idx_budgets_is_active ON budgets(is_active);
CREATE INDEX IF NOT EXISTS idx_budget_alerts_budget_id ON budget_alerts(budget_id);

-- Create function to update budget spending
CREATE OR REPLACE FUNCTION update_budget_spending(
  p_user_id UUID,
  p_category VARCHAR(50),
  p_amount DECIMAL(12,2)
)
RETURNS VOID AS $$
BEGIN
  -- Update specific category budgets
  UPDATE budgets 
  SET spent = spent + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id 
    AND category = p_category 
    AND is_active = true
    AND NOW() BETWEEN start_date AND end_date;
    
  -- Update 'all' category budgets
  UPDATE budgets 
  SET spent = spent + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id 
    AND category = 'all' 
    AND is_active = true
    AND NOW() BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for budgets
CREATE POLICY "Users can view their own budgets" ON budgets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own budgets" ON budgets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own budgets" ON budgets
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own budgets" ON budgets
  FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for budget_alerts
CREATE POLICY "Users can view alerts for their budgets" ON budget_alerts
  FOR SELECT USING (
    budget_id IN (
      SELECT id FROM budgets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert budget alerts" ON budget_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update alerts for their budgets" ON budget_alerts
  FOR UPDATE USING (
    budget_id IN (
      SELECT id FROM budgets WHERE user_id = auth.uid()
    )
  );
