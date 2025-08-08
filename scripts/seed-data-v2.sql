-- Insert default app configuration
INSERT INTO app_config (key, value, description, is_public) VALUES
('app_name', '"VTopup"', 'Application name', true),
('app_version', '"1.0.0"', 'Current app version', true),
('maintenance_mode', 'false', 'Enable/disable maintenance mode', false),
('min_wallet_balance', '100', 'Minimum wallet balance required', false),
('max_transaction_amount', '50000', 'Maximum transaction amount allowed', false),
('transaction_fee_percentage', '0', 'Transaction fee percentage', false),
('supported_networks', '["MTN", "GLO", "AIRTEL", "9MOBILE"]', 'Supported mobile networks', true),
('payment_gateways', '["paystack", "flutterwave"]', 'Enabled payment gateways', true),
('customer_support_email', '"support@vtopup.com"', 'Customer support email', true),
('customer_support_phone', '"+2348000000000"', 'Customer support phone', true),
('social_media_links', '{"facebook": "https://facebook.com/vtopup", "twitter": "https://twitter.com/vtopup", "instagram": "https://instagram.com/vtopup"}', 'Social media links', true),
('terms_of_service_url', '"https://vtopup.com/terms"', 'Terms of service URL', true),
('privacy_policy_url', '"https://vtopup.com/privacy"', 'Privacy policy URL', true),
('referral_bonus', '500', 'Referral bonus amount in naira', false),
('welcome_bonus', '100', 'Welcome bonus for new users', false),
('daily_transaction_limit', '100000', 'Daily transaction limit per user', false),
('api_rate_limit', '1000', 'API rate limit per hour', false),
('sms_notifications_enabled', 'true', 'Enable SMS notifications', false),
('email_notifications_enabled', 'true', 'Enable email notifications', false),
('push_notifications_enabled', 'true', 'Enable push notifications', false)
ON CONFLICT (key) DO NOTHING;

-- Insert sample data plans for different networks
INSERT INTO data_plans (network, plan_name, data_value, validity, price, discount_price, plan_code, is_active) VALUES
-- MTN Data Plans
('MTN', 'MTN 1GB', '1GB', '30 days', 350.00, 320.00, 'mtn_1gb_30', true),
('MTN', 'MTN 2GB', '2GB', '30 days', 700.00, 650.00, 'mtn_2gb_30', true),
('MTN', 'MTN 3GB', '3GB', '30 days', 1050.00, 980.00, 'mtn_3gb_30', true),
('MTN', 'MTN 5GB', '5GB', '30 days', 1750.00, 1650.00, 'mtn_5gb_30', true),
('MTN', 'MTN 10GB', '10GB', '30 days', 3500.00, 3300.00, 'mtn_10gb_30', true),
('MTN', 'MTN 20GB', '20GB', '30 days', 7000.00, 6500.00, 'mtn_20gb_30', true),

-- GLO Data Plans
('GLO', 'GLO 1GB', '1GB', '30 days', 350.00, 300.00, 'glo_1gb_30', true),
('GLO', 'GLO 2GB', '2GB', '30 days', 700.00, 600.00, 'glo_2gb_30', true),
('GLO', 'GLO 3GB', '3GB', '30 days', 1050.00, 900.00, 'glo_3gb_30', true),
('GLO', 'GLO 5GB', '5GB', '30 days', 1750.00, 1500.00, 'glo_5gb_30', true),
('GLO', 'GLO 10GB', '10GB', '30 days', 3500.00, 3000.00, 'glo_10gb_30', true),

-- AIRTEL Data Plans
('AIRTEL', 'Airtel 1GB', '1GB', '30 days', 350.00, 330.00, 'airtel_1gb_30', true),
('AIRTEL', 'Airtel 2GB', '2GB', '30 days', 700.00, 660.00, 'airtel_2gb_30', true),
('AIRTEL', 'Airtel 3GB', '3GB', '30 days', 1050.00, 990.00, 'airtel_3gb_30', true),
('AIRTEL', 'Airtel 5GB', '5GB', '30 days', 1750.00, 1650.00, 'airtel_5gb_30', true),
('AIRTEL', 'Airtel 10GB', '10GB', '30 days', 3500.00, 3300.00, 'airtel_10gb_30', true),

-- 9MOBILE Data Plans
('9MOBILE', '9mobile 1GB', '1GB', '30 days', 350.00, 340.00, '9mobile_1gb_30', true),
('9MOBILE', '9mobile 2GB', '2GB', '30 days', 700.00, 680.00, '9mobile_2gb_30', true),
('9MOBILE', '9mobile 3GB', '3GB', '30 days', 1050.00, 1020.00, '9mobile_3gb_30', true),
('9MOBILE', '9mobile 5GB', '5GB', '30 days', 1750.00, 1700.00, '9mobile_5gb_30', true),
('9MOBILE', '9mobile 10GB', '10GB', '30 days', 3500.00, 3400.00, '9mobile_10gb_30', true)
ON CONFLICT DO NOTHING;

-- Create admin user (password: admin123)
INSERT INTO users (
  id,
  email, 
  phone_number, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  is_verified,
  email_verified_at,
  phone_verified_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@vtopup.com',
  '+2348000000001',
  '$2b$10$rQZ8kHp.TB.It.NvHNUHl.j8m8GjVKW5zV5rF5.5F5F5F5F5F5F5F5',
  'Admin',
  'User',
  'super_admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create admin wallet
INSERT INTO wallets (user_id, balance) VALUES (
  '00000000-0000-0000-0000-000000000001',
  10000.00
) ON CONFLICT (user_id) DO NOTHING;

-- Create demo user (password: demo123)
INSERT INTO users (
  id,
  email, 
  phone_number, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  is_verified,
  email_verified_at,
  phone_verified_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'demo@vtopup.com',
  '+2348000000002',
  '$2b$10$rQZ8kHp.TB.It.NvHNUHl.j8m8GjVKW5zV5rF5.5F5F5F5F5F5F5F5',
  'Demo',
  'User',
  'user',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create demo user wallet
INSERT INTO wallets (user_id, balance) VALUES (
  '00000000-0000-0000-0000-000000000002',
  5000.00
) ON CONFLICT (user_id) DO NOTHING;

-- Insert sample notifications for demo user
INSERT INTO notifications (user_id, title, message, type) VALUES
('00000000-0000-0000-0000-000000000002', 'Welcome to VTopup!', 'Your account has been created successfully. Enjoy seamless airtime and data purchases.', 'welcome'),
('00000000-0000-0000-0000-000000000002', 'Wallet Credited', 'Your wallet has been credited with ₦5,000.00. Start enjoying our services!', 'wallet'),
('00000000-0000-0000-0000-000000000002', 'New Feature Alert', 'We have added biometric authentication for enhanced security. Enable it in your settings.', 'feature')
ON CONFLICT DO NOTHING;

-- Insert sample contacts for demo user
INSERT INTO contacts (user_id, name, phone_number, network, is_favorite) VALUES
('00000000-0000-0000-0000-000000000002', 'John Doe', '08012345678', 'MTN', true),
('00000000-0000-0000-0000-000000000002', 'Jane Smith', '08087654321', 'GLO', false),
('00000000-0000-0000-0000-000000000002', 'Mike Johnson', '07012345678', 'AIRTEL', false),
('00000000-0000-0000-0000-000000000002', 'Sarah Wilson', '09012345678', '9MOBILE', true)
ON CONFLICT DO NOTHING;

-- Insert sample transaction history for demo user
INSERT INTO transactions (
  user_id, 
  service_type, 
  service_provider, 
  phone_number, 
  amount, 
  final_amount, 
  status, 
  reference, 
  completed_at,
  created_at
) VALUES
('00000000-0000-0000-0000-000000000002', 'airtime', 'MTN', '08012345678', 1000.00, 1000.00, 'completed', 'TXN_' || extract(epoch from now())::text || '_1', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('00000000-0000-0000-0000-000000000002', 'data', 'GLO', '08087654321', 650.00, 600.00, 'completed', 'TXN_' || extract(epoch from now())::text || '_2', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('00000000-0000-0000-0000-000000000002', 'airtime', 'AIRTEL', '07012345678', 500.00, 500.00, 'completed', 'TXN_' || extract(epoch from now())::text || '_3', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
('00000000-0000-0000-0000-000000000002', 'data', 'MTN', '08012345678', 1650.00, 1650.00, 'pending', 'TXN_' || extract(epoch from now())::text || '_4', NULL, NOW() - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;

-- Insert sample analytics events
INSERT INTO analytics_events (event_name, user_id, properties) VALUES
('user_registered', '00000000-0000-0000-0000-000000000002', '{"source": "web", "referrer": "google"}'),
('wallet_funded', '00000000-0000-0000-0000-000000000002', '{"amount": 5000, "method": "bank_transfer"}'),
('transaction_completed', '00000000-0000-0000-0000-000000000002', '{"service": "airtime", "amount": 1000, "network": "MTN"}'),
('page_view', '00000000-0000-0000-0000-000000000002', '{"page": "/dashboard", "duration": 45}'),
('feature_used', '00000000-0000-0000-0000-000000000002', '{"feature": "contact_save", "success": true}')
ON CONFLICT DO NOTHING;

-- Insert system logs
INSERT INTO system_logs (level, message, context) VALUES
('info', 'Application started successfully', '{"version": "1.0.0", "environment": "production"}'),
('info', 'Database migration completed', '{"tables_created": 15, "indexes_created": 20}'),
('info', 'Seed data inserted successfully', '{"users": 2, "data_plans": 20, "config_items": 20}')
ON CONFLICT DO NOTHING;
