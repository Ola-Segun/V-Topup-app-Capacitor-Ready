-- Insert sample data plans
INSERT INTO data_plans (network, plan_name, data_amount, validity, price, plan_code) VALUES
-- MTN Plans
('mtn', '1GB Monthly', '1GB', '30 days', 500.00, 'MTN_1GB_30'),
('mtn', '2GB Monthly', '2GB', '30 days', 1000.00, 'MTN_2GB_30'),
('mtn', '5GB Monthly', '5GB', '30 days', 2000.00, 'MTN_5GB_30'),
('mtn', '10GB Monthly', '10GB', '30 days', 3500.00, 'MTN_10GB_30'),

-- Airtel Plans
('airtel', '1GB Monthly', '1GB', '30 days', 500.00, 'AIRTEL_1GB_30'),
('airtel', '2GB Monthly', '2GB', '30 days', 1000.00, 'AIRTEL_2GB_30'),
('airtel', '5GB Monthly', '5GB', '30 days', 2000.00, 'AIRTEL_5GB_30'),
('airtel', '10GB Monthly', '10GB', '30 days', 3500.00, 'AIRTEL_10GB_30'),

-- Glo Plans
('glo', '1GB Monthly', '1GB', '30 days', 500.00, 'GLO_1GB_30'),
('glo', '2GB Monthly', '2GB', '30 days', 1000.00, 'GLO_2GB_30'),
('glo', '5GB Monthly', '5GB', '30 days', 2000.00, 'GLO_5GB_30'),
('glo', '10GB Monthly', '10GB', '30 days', 3500.00, 'GLO_10GB_30'),

-- 9mobile Plans
('9mobile', '1GB Monthly', '1GB', '30 days', 500.00, '9MOBILE_1GB_30'),
('9mobile', '2GB Monthly', '2GB', '30 days', 1000.00, '9MOBILE_2GB_30'),
('9mobile', '5GB Monthly', '5GB', '30 days', 2000.00, '9MOBILE_5GB_30'),
('9mobile', '10GB Monthly', '10GB', '30 days', 3500.00, '9MOBILE_10GB_30');
