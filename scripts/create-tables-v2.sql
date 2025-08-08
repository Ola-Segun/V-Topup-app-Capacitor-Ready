-- Add new columns for mobile features
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS biometric_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS push_token TEXT,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS device_info JSONB;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('transaction', 'security', 'promotional', 'system')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create offline queue table
CREATE TABLE IF NOT EXISTS offline_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  retry_count INTEGER DEFAULT 0,
  last_retry TIMESTAMP WITH TIME ZONE
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add synced column to transactions
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS synced BOOLEAN DEFAULT TRUE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_offline_queue_user_id ON offline_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_transactions_synced ON transactions(synced);

-- Create RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Offline queue policies
CREATE POLICY "Users can manage own offline queue" ON offline_queue
  FOR ALL USING (auth.uid() = user_id);

-- Contacts policies
CREATE POLICY "Users can manage own contacts" ON contacts
  FOR ALL USING (auth.uid() = user_id);

-- Create functions for wallet operations
CREATE OR REPLACE FUNCTION debit_wallet(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET wallet_balance = wallet_balance - amount,
      updated_at = NOW()
  WHERE id = user_id AND wallet_balance >= amount;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient wallet balance';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION credit_wallet(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET wallet_balance = wallet_balance + amount,
      updated_at = NOW()
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
