-- =====================================================================
-- ArthaMind Cloudflare D1 SQLite Schema Migration: 0001_initial_schema.sql
-- Supports: Living Money Model, Active Learning, UPI P2P, Reimbursement Netting,
-- Deterministic What-Ifs, and SEBI Guardrails.
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS living_profile (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    monthly_baseline_income REAL NOT NULL DEFAULT 85000,
    variable_income_estimate REAL NOT NULL DEFAULT 15000,
    fixed_costs REAL NOT NULL DEFAULT 32000,
    current_rent REAL NOT NULL DEFAULT 18000,
    emergency_fund_target REAL NOT NULL DEFAULT 250000,
    emergency_fund_current REAL NOT NULL DEFAULT 145000,
    liquid_cash_balance REAL NOT NULL DEFAULT 42500,
    payday_day_of_month INTEGER NOT NULL DEFAULT 1,
    last_life_event_sync DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('debit', 'credit')),
    raw_text TEXT NOT NULL,
    clean_payee TEXT NOT NULL,
    source TEXT NOT NULL CHECK(source IN ('SMS', 'PDF', 'CSV', 'HINGLISH_VOICE', 'MANUAL')),
    bank TEXT NOT NULL,
    channel TEXT NOT NULL CHECK(channel IN ('UPI', 'CARD', 'NETBANKING', 'CASH', 'ACH')),
    category TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 1.0,
    is_reviewed INTEGER NOT NULL DEFAULT 0,
    review_needed INTEGER NOT NULL DEFAULT 0,
    is_p2p INTEGER NOT NULL DEFAULT 0,
    is_reimbursed INTEGER NOT NULL DEFAULT 0,
    linked_reimbursement_id TEXT,
    net_amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS scoped_rules (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    payee_pattern TEXT NOT NULL,
    amount_min REAL DEFAULT 0,
    amount_max REAL DEFAULT 9999999,
    time_pattern TEXT DEFAULT 'all' CHECK(time_pattern IN ('morning', 'lunch', 'night', 'all')),
    category TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 1.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    billing_frequency TEXT NOT NULL DEFAULT 'monthly' CHECK(billing_frequency IN ('monthly', 'yearly', 'quarterly')),
    next_renewal_date TEXT NOT NULL,
    last_charged_date TEXT NOT NULL,
    price_change_detected INTEGER NOT NULL DEFAULT 0,
    previous_amount REAL,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'evaluating', 'cancelled')),
    user_usage_confirmed INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sinking_funds (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    due_month INTEGER NOT NULL,
    monthly_allocation REAL NOT NULL,
    current_saved REAL NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL NOT NULL,
    target_date TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('high', 'medium', 'low')),
    monthly_contribution REAL NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS life_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK(event_type IN ('RENT_INCREASE', 'SALARY_INCREMENT', 'NEW_EMI', 'VARIABLE_INCOME_DIP')),
    description TEXT NOT NULL,
    detected_value REAL NOT NULL,
    previous_value REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING_CONFIRMATION' CHECK(status IN ('PENDING_CONFIRMATION', 'ACCEPTED', 'DISMISSED')),
    detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS guardrail_logs (
    id TEXT PRIMARY KEY,
    user_query TEXT NOT NULL,
    blocked_reason TEXT,
    status TEXT NOT NULL CHECK(status IN ('PASSED', 'BLOCKED_SPECIFIC_STOCK', 'BLOCKED_GUARANTEED_RETURN', 'REDIRECTED_TO_EDUCATION')),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_rules_user_payee ON scoped_rules(user_id, payee_pattern);
