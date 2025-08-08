-- Production Database Setup Script
-- Run this script to set up the production database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create optimized indexes for production
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);

-- Set up Row Level Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own wallet" ON user_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions FOR SELECT USING (auth.uid() = (SELECT user_id FROM user_wallets WHERE id = wallet_id));

-- Create admin role and policies
CREATE ROLE admin_role;
CREATE POLICY "Admins can view all data" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage transactions" ON transactions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Set up database configuration for production
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Create backup user
CREATE USER backup_user WITH PASSWORD 'secure_backup_password';
GRANT CONNECT ON DATABASE postgres TO backup_user;
GRANT USAGE ON SCHEMA public TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO backup_user;

-- Create monitoring views
CREATE OR REPLACE VIEW system_health AS
SELECT 
  'database_size' as metric,
  pg_size_pretty(pg_database_size(current_database())) as value,
  now() as timestamp
UNION ALL
SELECT 
  'active_connections' as metric,
  count(*)::text as value,
  now() as timestamp
FROM pg_stat_activity 
WHERE state = 'active'
UNION ALL
SELECT 
  'total_users' as metric,
  count(*)::text as value,
  now() as timestamp
FROM users
UNION ALL
SELECT 
  'transactions_today' as metric,
  count(*)::text as value,
  now() as timestamp
FROM transactions 
WHERE created_at >= current_date;

-- Grant permissions
GRANT SELECT ON system_health TO authenticated;
