-- Add commission_rate to users for drivers
ALTER TABLE users ADD COLUMN commission_rate DECIMAL(5, 2) DEFAULT 10.00;
