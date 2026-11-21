-- Seed Demo Data for ArthaMind Demo & Testing
INSERT OR IGNORE INTO users (id, name, email) 
VALUES ('user_demo_01', 'Argho Deep', 'argho@arthamind.ai');

INSERT OR IGNORE INTO living_profile (
    id, user_id, monthly_baseline_income, variable_income_estimate, 
    fixed_costs, current_rent, emergency_fund_target, emergency_fund_current, 
    liquid_cash_balance, payday_day_of_month
) VALUES (
    'prof_demo_01', 'user_demo_01', 95000, 15000, 
    36500, 18000, 250000, 160000, 
    48500, 1
);

-- Seed Initial Scoped Heuristic Rules
INSERT OR IGNORE INTO scoped_rules (id, user_id, payee_pattern, amount_min, amount_max, time_pattern, category, confidence) VALUES
('rule_01', 'user_demo_01', 'Swiggy', 0, 5000, 'all', 'Food & Dining', 0.99),
('rule_02', 'user_demo_01', 'Zomato', 0, 5000, 'all', 'Food & Dining', 0.99),
('rule_03', 'user_demo_01', 'Uber India', 0, 2000, 'all', 'Transport', 0.95),
('rule_04', 'user_demo_01', 'Tata Power', 0, 10000, 'all', 'Utilities', 0.98),
('rule_05', 'user_demo_01', 'Blinkit', 0, 3000, 'all', 'Groceries', 0.96);

-- Seed Subscriptions & Recurring Spends
INSERT OR IGNORE INTO subscriptions (id, user_id, name, amount, billing_frequency, next_renewal_date, last_charged_date, price_change_detected, previous_amount, status, user_usage_confirmed) VALUES
('sub_01', 'user_demo_01', 'Netflix Premium', 649, 'monthly', '2026-11-28', '2026-10-28', 1, 499, 'evaluating', 1),
('sub_02', 'user_demo_01', 'Spotify Individual', 119, 'monthly', '2026-11-24', '2026-10-24', 0, 119, 'active', 1),
('sub_03', 'user_demo_01', 'Cult.fit Gym', 1750, 'monthly', '2026-12-05', '2026-11-05', 0, 1750, 'active', 1),
('sub_04', 'user_demo_01', 'AWS Cloud Server', 820, 'monthly', '2026-12-02', '2026-11-02', 0, 820, 'active', 1);

-- Seed Sinking Funds
INSERT OR IGNORE INTO sinking_funds (id, user_id, name, target_amount, due_month, monthly_allocation, current_saved) VALUES
('sink_01', 'user_demo_01', 'Diwali Gifts & Travel', 35000, 10, 3500, 14000),
('sink_02', 'user_demo_01', 'Car Comprehensive Insurance', 18000, 4, 1500, 9000),
('sink_03', 'user_demo_01', 'Tech Gear Upgrade Fund', 60000, 12, 5000, 25000);

-- Seed Goals
INSERT OR IGNORE INTO goals (id, user_id, title, target_amount, current_amount, target_date, priority, monthly_contribution) VALUES
('goal_01', 'user_demo_01', '6-Month Emergency Cushion', 250000, 160000, '2027-03-31', 'high', 15000),
('goal_02', 'user_demo_01', 'Ladakh Bike Expedition', 75000, 32000, '2027-06-30', 'medium', 6000);

-- Seed Life Events (Rent Increase detected!)
INSERT OR IGNORE INTO life_events (id, user_id, event_type, description, detected_value, previous_value, status, detected_at) VALUES
('event_01', 'user_demo_01', 'RENT_INCREASE', 'Rent payment to landlord Suresh Sharma shifted from ₹18,000 to ₹21,500 (+₹3,500/mo)', 21500, 18000, 'PENDING_CONFIRMATION', '2026-11-20 10:14:00');

-- Seed Transactions (Including P2P ambiguity and Reimbursement Netting scenario)
INSERT OR IGNORE INTO transactions (id, user_id, date, amount, type, raw_text, clean_payee, source, bank, channel, category, confidence, is_reviewed, review_needed, is_p2p, is_reimbursed, linked_reimbursement_id, net_amount) VALUES
-- Normal categorized
('tx_01', 'user_demo_01', '2026-11-01', 95000, 'credit', 'Salary credited from Razorpay Technologies Ltd NEFT REF 9021', 'Razorpay Technologies', 'SMS', 'HDFC', 'NETBANKING', 'Salary', 1.0, 1, 0, 0, 0, NULL, 95000),
('tx_02', 'user_demo_01', '2026-11-02', 21500, 'debit', 'Sent Rs 21,500.00 via UPI to Suresh Sharma UPI Ref 410291910', 'Suresh Sharma', 'SMS', 'HDFC', 'UPI', 'Rent & Housing', 0.92, 1, 0, 1, 0, NULL, 21500),
('tx_03', 'user_demo_01', '2026-11-04', 1850, 'debit', 'Paid Rs 1850.00 to Blinkit Quick Commerce Gurgaon', 'Blinkit', 'SMS', 'HDFC', 'UPI', 'Groceries', 0.98, 1, 0, 0, 0, NULL, 1850),
('tx_04', 'user_demo_01', '2026-11-06', 420, 'debit', 'Paid Rs 420.00 to Uber India Bangalore on Card **4102', 'Uber India', 'SMS', 'HDFC', 'CARD', 'Transport', 0.97, 1, 0, 0, 0, NULL, 420),

-- Group Dinner with Reimbursement Netting!
('tx_05', 'user_demo_01', '2026-11-10', 4400, 'debit', 'Paid Rs 4400.00 at Toit Indiranagar Bangalore on Card **4102', 'Toit Brewpub', 'CSV', 'HDFC', 'CARD', 'Food & Dining', 0.99, 1, 0, 0, 1, 'tx_06,tx_07,tx_08', 1100),
('tx_06', 'user_demo_01', '2026-11-10', 1100, 'credit', 'UPI/P2M/CR/Karan Verma/Toit share/HDFC/5541', 'Karan Verma (Splitwise)', 'SMS', 'HDFC', 'UPI', 'Reimbursement', 0.95, 1, 0, 1, 0, 'tx_05', 0),
('tx_07', 'user_demo_01', '2026-11-10', 1100, 'credit', 'UPI/P2M/CR/Rhea Sen/Dinner/HDFC/5542', 'Rhea Sen (Splitwise)', 'SMS', 'HDFC', 'UPI', 'Reimbursement', 0.95, 1, 0, 1, 0, 'tx_05', 0),
('tx_08', 'user_demo_01', '2026-11-11', 1100, 'credit', 'UPI/P2M/CR/Ankit J/food/HDFC/5543', 'Ankit J (Splitwise)', 'SMS', 'HDFC', 'UPI', 'Reimbursement', 0.95, 1, 0, 1, 0, 'tx_05', 0),

-- Ambiguous P2P Spends for the Active-Learning 2-Minute Review
('tx_09', 'user_demo_01', '2026-11-18', 350, 'debit', 'Sent Rs 350.00 to Ramesh Kumar UPI Ref 410881', 'Ramesh Kumar', 'SMS', 'HDFC', 'UPI', 'Uncategorized P2P', 0.45, 0, 1, 1, 0, NULL, 350),
('tx_10', 'user_demo_01', '2026-11-19', 1200, 'debit', 'Sent Rs 1200.00 to Pooja Medicals UPI Ref 410912', 'Pooja Medicals', 'SMS', 'ICICI', 'UPI', 'Healthcare', 0.65, 0, 1, 0, 0, NULL, 1200),
('tx_11', 'user_demo_01', '2026-11-20', 80, 'debit', 'kal auto wale bhaiya ko 80 diye the cash me', 'Auto Cash', 'HINGLISH_VOICE', 'CASH', 'CASH', 'Transport', 0.70, 0, 1, 0, 0, NULL, 80);
