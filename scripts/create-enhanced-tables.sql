-- Enhanced VTopup Database Schema with Production Features
-- This script creates all necessary tables, functions, triggers, and security policies

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'frozen', 'pending');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'refunded');
CREATE TYPE transaction_type AS ENUM ('airtime', 'data', 'cable', 'electricity', 'wallet_funding', 'wallet_transfer', 'bank_transfer');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE budget_period AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- Users table with enhanced security
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    wallet_balance DECIMAL(15,2) DEFAULT 0.00,
    status user_status DEFAULT 'pending',
    kyc_status kyc_status DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    backup_codes TEXT[],
    pin_hash VARCHAR(255),
    biometric_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    frozen_reason TEXT,
    frozen_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User devices for security tracking
CREATE TABLE user_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    device_name VARCHAR(255),
    device_type VARCHAR(50),
    user_agent TEXT,
    ip_address INET,
    location JSONB,
    is_trusted BOOLEAN DEFAULT FALSE,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, device_id)
);

-- User sessions for JWT management
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id UUID REFERENCES user_devices(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC documents
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    document_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    rejection_reason TEXT,
    metadata JSONB,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table with enhanced tracking
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reference VARCHAR(100) UNIQUE NOT NULL,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount + fee) STORED,
    recipient VARCHAR(255) NOT NULL,
    network VARCHAR(50),
    status transaction_status DEFAULT 'pending',
    provider VARCHAR(50),
    provider_transaction_id VARCHAR(255),
    provider_response JSONB,
    gateway_response JSONB,
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    device_id VARCHAR(255),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet transactions for detailed tracking
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    reference VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL, -- credit, debit
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled transactions
CREATE TABLE scheduled_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    network VARCHAR(50),
    frequency VARCHAR(20) NOT NULL, -- daily, weekly, monthly, quarterly, yearly
    next_run_date DATE NOT NULL,
    last_run_date DATE,
    run_count INTEGER DEFAULT 0,
    max_runs INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    spent DECIMAL(15,2) DEFAULT 0.00,
    period budget_period NOT NULL,
    alert_threshold DECIMAL(5,2) DEFAULT 80.00, -- percentage
    is_active BOOLEAN DEFAULT TRUE,
    auto_reset BOOLEAN DEFAULT TRUE,
    last_reset_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget alerts
CREATE TABLE budget_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(20) NOT NULL, -- threshold, exceeded
    percentage_used DECIMAL(5,2) NOT NULL,
    amount_spent DECIMAL(15,2) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    network VARCHAR(50),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, phone)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'info',
    category VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification settings
CREATE TABLE notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    transaction_alerts BOOLEAN DEFAULT TRUE,
    budget_alerts BOOLEAN DEFAULT TRUE,
    security_alerts BOOLEAN DEFAULT TRUE,
    promotional_emails BOOLEAN DEFAULT FALSE,
    low_balance_alerts BOOLEAN DEFAULT TRUE,
    weekly_reports BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- System alerts for admin monitoring
CREATE TABLE system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL,
    severity alert_severity NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    source VARCHAR(100),
    metadata JSONB,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fraud alerts
CREATE TABLE fraud_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    rule_id VARCHAR(100),
    severity alert_severity NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    status VARCHAR(20) DEFAULT 'open',
    investigated_by UUID REFERENCES users(id),
    investigation_notes TEXT,
    investigated_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    current_count INTEGER NOT NULL DEFAULT 0,
    limit_value INTEGER NOT NULL,
    window_seconds INTEGER NOT NULL,
    reset_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limit violations
CREATE TABLE rate_limit_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id VARCHAR(100),
    identifier VARCHAR(255) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    limit_value INTEGER NOT NULL,
    window_seconds INTEGER NOT NULL,
    scope VARCHAR(20) NOT NULL,
    violated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limit rules
CREATE TABLE rate_limit_rules (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pattern VARCHAR(255) NOT NULL,
    limit_value INTEGER NOT NULL,
    window_seconds INTEGER NOT NULL,
    scope VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System metrics for monitoring
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    disk_usage DECIMAL(5,2),
    active_connections INTEGER,
    response_time DECIMAL(10,2),
    error_rate DECIMAL(5,2),
    transaction_volume INTEGER,
    success_rate DECIMAL(5,2),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics data aggregation
CREATE TABLE analytics_hourly (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hour TIMESTAMP WITH TIME ZONE NOT NULL,
    metrics JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hour)
);

-- Webhook logs
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    reference VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    data JSONB,
    error TEXT,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs for compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment gateways configuration
CREATE TABLE payment_gateways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VTU providers configuration
CREATE TABLE vtu_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 1,
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service configurations
CREATE TABLE service_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_type VARCHAR(50) NOT NULL,
    network VARCHAR(50),
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_type, network)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_reference ON transactions(reference);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_completed_at ON transactions(completed_at);

CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_reference ON wallet_transactions(reference);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_system_alerts_severity ON system_alerts(severity);
CREATE INDEX idx_system_alerts_is_resolved ON system_alerts(is_resolved);
CREATE INDEX idx_system_alerts_created_at ON system_alerts(created_at);

CREATE INDEX idx_fraud_alerts_user_id ON fraud_alerts(user_id);
CREATE INDEX idx_fraud_alerts_severity ON fraud_alerts(severity);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX idx_fraud_alerts_created_at ON fraud_alerts(created_at);

CREATE INDEX idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX idx_webhook_logs_provider ON webhook_logs(provider);
CREATE INDEX idx_webhook_logs_reference ON webhook_logs(reference);
CREATE INDEX idx_webhook_logs_processed_at ON webhook_logs(processed_at);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create wallet management functions
CREATE OR REPLACE FUNCTION credit_wallet(
    p_user_id UUID,
    p_amount DECIMAL(15,2),
    p_reference VARCHAR(100),
    p_description TEXT,
    p_transaction_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_current_balance DECIMAL(15,2);
    v_new_balance DECIMAL(15,2);
BEGIN
    -- Lock the user row to prevent concurrent modifications
    SELECT wallet_balance INTO v_current_balance
    FROM users 
    WHERE id = p_user_id 
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Calculate new balance
    v_new_balance := v_current_balance + p_amount;
    
    -- Update user wallet balance
    UPDATE users 
    SET wallet_balance = v_new_balance,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Insert wallet transaction record
    INSERT INTO wallet_transactions (
        user_id,
        transaction_id,
        reference,
        type,
        amount,
        balance_before,
        balance_after,
        description
    ) VALUES (
        p_user_id,
        p_transaction_id,
        p_reference,
        'credit',
        p_amount,
        v_current_balance,
        v_new_balance,
        p_description
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION debit_wallet(
    p_user_id UUID,
    p_amount DECIMAL(15,2),
    p_reference VARCHAR(100),
    p_description TEXT,
    p_transaction_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_current_balance DECIMAL(15,2);
    v_new_balance DECIMAL(15,2);
BEGIN
    -- Lock the user row to prevent concurrent modifications
    SELECT wallet_balance INTO v_current_balance
    FROM users 
    WHERE id = p_user_id 
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Check if user has sufficient balance
    IF v_current_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient wallet balance';
    END IF;
    
    -- Calculate new balance
    v_new_balance := v_current_balance - p_amount;
    
    -- Update user wallet balance
    UPDATE users 
    SET wallet_balance = v_new_balance,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Insert wallet transaction record
    INSERT INTO wallet_transactions (
        user_id,
        transaction_id,
        reference,
        type,
        amount,
        balance_before,
        balance_after,
        description
    ) VALUES (
        p_user_id,
        p_transaction_id,
        p_reference,
        'debit',
        p_amount,
        v_current_balance,
        v_new_balance,
        p_description
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to transfer between wallets
CREATE OR REPLACE FUNCTION transfer_wallet(
    p_sender_id UUID,
    p_recipient_id UUID,
    p_amount DECIMAL(15,2),
    p_reference VARCHAR(100),
    p_description TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_sender_balance DECIMAL(15,2);
    v_recipient_balance DECIMAL(15,2);
BEGIN
    -- Start transaction
    BEGIN
        -- Debit sender
        SELECT debit_wallet(
            p_sender_id,
            p_amount,
            p_reference || '_DEBIT',
            'Transfer to recipient - ' || p_description
        );
        
        -- Credit recipient
        SELECT credit_wallet(
            p_recipient_id,
            p_amount,
            p_reference || '_CREDIT',
            'Transfer from sender - ' || p_description
        );
        
        RETURN TRUE;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE;
    END;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_transactions_updated_at BEFORE UPDATE ON scheduled_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON kyc_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (
            user_id,
            action,
            resource_type,
            resource_id,
            new_values,
            created_at
        ) VALUES (
            COALESCE(NEW.user_id, (SELECT id FROM users WHERE email = current_user LIMIT 1)),
            TG_OP,
            TG_TABLE_NAME,
            NEW.id::TEXT,
            row_to_json(NEW),
            NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (
            user_id,
            action,
            resource_type,
            resource_id,
            old_values,
            new_values,
            created_at
        ) VALUES (
            COALESCE(NEW.user_id, OLD.user_id, (SELECT id FROM users WHERE email = current_user LIMIT 1)),
            TG_OP,
            TG_TABLE_NAME,
            NEW.id::TEXT,
            row_to_json(OLD),
            row_to_json(NEW),
            NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (
            user_id,
            action,
            resource_type,
            resource_id,
            old_values,
            created_at
        ) VALUES (
            COALESCE(OLD.user_id, (SELECT id FROM users WHERE email = current_user LIMIT 1)),
            TG_OP,
            TG_TABLE_NAME,
            OLD.id::TEXT,
            row_to_json(OLD),
            NOW()
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_transactions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_wallet_transactions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON wallet_transactions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- User can only see their own data
CREATE POLICY users_own_data ON users
    FOR ALL USING (id = (SELECT id FROM users WHERE email = current_user));

CREATE POLICY transactions_own_data ON transactions
    FOR ALL USING (user_id = (SELECT id FROM users WHERE email = current_user));

CREATE POLICY wallet_transactions_own_data ON wallet_transactions
    FOR ALL USING (user_id = (SELECT id FROM users WHERE email = current_user));

CREATE POLICY notifications_own_data ON notifications
    FOR ALL USING (user_id = (SELECT id FROM users WHERE email = current_user));

CREATE POLICY contacts_own_data ON contacts
    FOR ALL USING (user_id = (SELECT id FROM users WHERE email = current_user));

CREATE POLICY budgets_own_data ON budgets
    FOR ALL USING (user_id = (SELECT id FROM users WHERE email = current_user));

CREATE POLICY kyc_documents_own_data ON kyc_documents
    FOR ALL USING (user_id = (SELECT id FROM users WHERE email = current_user));

-- Insert default configurations
INSERT INTO payment_gateways (name, config) VALUES
('paystack', '{"public_key": "", "secret_key": "", "webhook_url": "/api/webhooks/paystack"}'),
('flutterwave', '{"public_key": "", "secret_key": "", "webhook_url": "/api/webhooks/flutterwave"}');

INSERT INTO vtu_providers (name, priority, config) VALUES
('vtpass', 1, '{"api_key": "", "secret_key": "", "base_url": "https://vtpass.com/api"}'),
('baxi', 2, '{"api_key": "", "secret_key": "", "base_url": "https://www.baxipay.com.ng/api/baxipay"}'),
('clubkonnect', 3, '{"api_key": "", "secret_key": "", "base_url": "https://www.clubkonnect.com/api"}');

INSERT INTO rate_limit_rules (id, name, pattern, limit_value, window_seconds, scope) VALUES
('auth_login', 'Login attempts', '/api/auth/login', 5, 900, 'ip'),
('auth_register', 'Registration attempts', '/api/auth/register', 3, 3600, 'ip'),
('transaction_create', 'Transaction creation', '/api/services/*', 10, 60, 'user'),
('wallet_fund', 'Wallet funding', '/api/wallet/fund', 5, 300, 'user'),
('password_reset', 'Password reset requests', '/api/auth/forgot-password', 3, 3600, 'ip'),
('otp_request', 'OTP requests', '/api/auth/send-otp', 5, 300, 'user');

-- Create views for common queries
CREATE VIEW user_summary AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.wallet_balance,
    u.status,
    u.kyc_status,
    u.created_at,
    COUNT(t.id) as total_transactions,
    COALESCE(SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END), 0) as total_spent,
    u.last_login_at
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id;

CREATE VIEW transaction_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    transaction_type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_count,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count,
    ROUND(
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(*), 0) * 100, 2
    ) as success_rate
FROM transactions
GROUP BY DATE_TRUNC('day', created_at), transaction_type
ORDER BY date DESC;

-- Create materialized view for analytics
CREATE MATERIALIZED VIEW daily_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(*) as total_transactions,
    SUM(amount) as total_revenue,
    AVG(amount) as avg_transaction_amount,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_transactions,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_transactions
FROM transactions
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Create index on materialized view
CREATE INDEX idx_daily_analytics_date ON daily_analytics(date);

-- Function to refresh analytics
CREATE OR REPLACE FUNCTION refresh_analytics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_analytics;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE users IS 'Main users table with enhanced security features';
COMMENT ON TABLE transactions IS 'All transaction records with comprehensive tracking';
COMMENT ON TABLE wallet_transactions IS 'Detailed wallet transaction history';
COMMENT ON TABLE system_alerts IS 'System-wide alerts for monitoring';
COMMENT ON TABLE fraud_alerts IS 'Fraud detection alerts';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for compliance';

COMMENT ON FUNCTION credit_wallet IS 'Safely credit user wallet with transaction logging';
COMMENT ON FUNCTION debit_wallet IS 'Safely debit user wallet with balance checking';
COMMENT ON FUNCTION transfer_wallet IS 'Transfer funds between user wallets';

-- Grant necessary permissions (adjust based on your user roles)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Final success message
DO $$
BEGIN
    RAISE NOTICE 'Enhanced VTopup database schema created successfully!';
    RAISE NOTICE 'Tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE 'Functions created: %', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public');
    RAISE NOTICE 'Indexes created: %', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public');
END $$;
