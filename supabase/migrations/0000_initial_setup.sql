
-- ========= Part 1: Clean Slate - Drop All Existing Tables =========
DROP TABLE IF EXISTS public.lab_bookings, public.health_packages, public.lab_tests, public.doctors, public.products, public.profiles, public.user_roles CASCADE;

-- ========= Part 2: Create All Tables Correctly =========

CREATE TABLE public.user_roles ( user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, role TEXT NOT NULL );
CREATE TABLE public.profiles ( id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, full_name TEXT, avatar_url TEXT, updated_at TIMESTAMPTZ );
CREATE TABLE public.products ( id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name TEXT NOT NULL, brand TEXT, price REAL NOT NULL, discount_percent INTEGER, image_url TEXT, category TEXT, requires_prescription BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT now() );
CREATE TABLE public.doctors ( id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name TEXT NOT NULL, specialty TEXT, qualification TEXT, schedule TEXT, category TEXT, image_url TEXT, created_at TIMESTAMPTZ DEFAULT now() );
CREATE TABLE public.lab_tests ( id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name TEXT NOT NULL, price REAL NOT NULL, discount_percent INTEGER, report_time TEXT, home_collection_available BOOLEAN, category TEXT, created_at TIMESTAMPTZ DEFAULT now() );
CREATE TABLE public.health_packages ( id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name TEXT NOT NULL, total_tests INTEGER, discounted_price REAL, original_price REAL, is_popular BOOLEAN, tests_included TEXT[], created_at TIMESTAMPTZ DEFAULT now() );
CREATE TABLE public.lab_bookings ( id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, user_id uuid REFERENCES auth.users(id), booking_date DATE, booking_time TIME, amount REAL, is_home_collection BOOLEAN, collection_address TEXT, status TEXT DEFAULT 'pending', payment_status TEXT DEFAULT 'pending', test_id BIGINT REFERENCES public.lab_tests(id), package_id BIGINT REFERENCES public.health_packages(id), created_at TIMESTAMPTZ DEFAULT now() );

-- ========= Part 3: Insert All Demo Data & Set Admin =========

DO $$ DECLARE admin_user_id uuid; BEGIN SELECT id INTO admin_user_id FROM auth.users WHERE email = 'abbasmolla311@gmail.com'; IF admin_user_id IS NOT NULL THEN INSERT INTO public.user_roles (user_id, role) VALUES (admin_user_id, 'admin') ON CONFLICT (user_id) DO UPDATE SET role = 'admin'; END IF; END $$;

-- Add Extensive Demo Products (20+)
INSERT INTO public.products (name, brand, price, discount_percent, image_url, category, requires_prescription) VALUES
('Paracetamol 650mg', 'Generic', 30, 15, '', 'otc-health', false),
('Himalaya Neem Face Wash', 'Himalaya', 150, 10, '', 'skin-care', false),
('Cetirizine 10mg', 'Cipla', 20, 10, '', 'otc-health', false),
('Vicks Vaporub', 'P&G', 90, 5, '', 'otc-health', false),
('Band-Aid (Pack of 20)', 'J&J', 40, 0, '', 'first-aid', false),
('Dettol Antiseptic Liquid', 'Reckitt', 120, 8, '', 'first-aid', false),
('Pampers Premium Pants (M)', 'P&G', 699, 12, '', 'baby-care', false),
('Cerelac Wheat-Apple', 'Nestle', 320, 5, '', 'baby-food', false),
('Colgate Total Toothpaste', 'Colgate', 95, 0, '', 'oral-care', false),
('Listerine Mouthwash', 'J&J', 180, 10, '', 'oral-care', false),
('Protinex Powder', 'Danone', 550, 15, '', 'health-nutrition', false),
('Ensure Diabetes Care', 'Abbott', 800, 12, '', 'diabetic-nutrition', false),
('Accu-Chek Instant Glucometer', 'Roche', 1100, 20, '', 'diabetic-testing', false),
('Dabur Honey', 'Dabur', 250, 10, '', 'ayurvedic-foods', false),
('Patanjali Aloe Vera Gel', 'Patanjali', 90, 5, '', 'ayurvedic-personal-care', false),
('Amoxicillin 500mg', 'Generic', 70, 18, '', 'antibiotics', true),
('Azithromycin 500mg', 'Generic', 110, 22, '', 'antibiotics', true),
('Atorvastatin 10mg', 'Sun Pharma', 100, 15, '', 'cardiovascular', true),
('Metformin 500mg', 'Generic', 15, 5, '', 'diabetic-aids', true),
('Omeprazole 20mg', 'Dr. Reddy''s', 55, 10, '', 'gastrointestinal', true);

-- Add Extensive Demo Doctors (12+)
INSERT INTO public.doctors (name, specialty, qualification, schedule, category) VALUES
('Dr. Priya Sharma', 'General Physician', 'MBBS, MD', 'Mon, Wed, Fri 5-7 PM', 'general-medicine'),
('Dr. Rajesh Gupta', 'Cardiologist', 'MBBS, DM (Cardiology)', 'Tue & Fri, 4-6 PM', 'cardiology'),
('Dr. Anjali Verma', 'Dermatologist', 'MBBS, MD (Skin)', 'Thu, 3-5 PM', 'dermatology'),
('Dr. Sameer Khan', 'Orthopedic Surgeon', 'MBBS, MS (Ortho)', 'Sat, 11 AM - 1 PM', 'orthopaedics'),
('Dr. Sunita Patel', 'Pediatrician', 'MBBS, DCH', 'Mon & Thu, 10-12 PM', 'paediatrics'),
('Dr. Vikram Singh', 'Neurologist', 'MBBS, DM (Neurology)', 'Wed, 6-8 PM', 'neurology'),
('Dr. Meena Iyer', 'Gynecologist', 'MBBS, MS (G&O)', 'Fri, 10-12 PM', 'gynaecology'),
('Dr. Arjun Reddy', 'ENT Specialist', 'MBBS, MS (ENT)', 'Tue, 2-4 PM', 'ent'),
('Dr. Fatima Ahmed', 'Diabetologist', 'MBBS, CCEBDM', 'Sat, 9-11 AM', 'diabetology'),
('Dr. Rohan Desai', 'Pulmonologist', 'MBBS, MD (Chest)', 'Mon, 2-4 PM', 'pulmonology'),
('Dr. Alok Nath', 'Psychiatrist', 'MBBS, MD (Psychiatry)', 'Fri, 6-8 PM', 'cns'),
('Dr. Ishita Biswas', 'Ophthalmologist', 'MBBS, MS (Ophth)', 'Wed, 10-12 PM', 'eye-care');

-- Add Extensive Demo Lab Tests (12+)
INSERT INTO public.lab_tests (name, price, discount_percent, report_time, home_collection_available, category) VALUES
('Complete Blood Count (CBC)', 300, 20, '8 hours', true, 'Routine'),
('Fasting Blood Sugar', 150, 15, '6 hours', true, 'Diabetes'),
('Lipid Profile', 600, 25, '12 hours', true, 'Heart'),
('Thyroid Profile (T3,T4,TSH)', 500, 20, '24 hours', true, 'Hormones'),
('Liver Function Test (LFT)', 700, 15, '24 hours', true, 'Routine'),
('Kidney Function Test (KFT)', 650, 15, '24 hours', true, 'Routine'),
('Urine Routine & Microscopic', 200, 10, '6 hours', true, 'Routine'),
('Vitamin D, 25-Hydroxy', 1400, 30, '36 hours', true, 'Vitamins'),
('Vitamin B12', 1200, 25, '36 hours', true, 'Vitamins'),
('Iron Studies Panel', 900, 20, '24 hours', true, 'Routine'),
('Dengue NS1 Antigen', 800, 10, '8 hours', true, 'Fever'),
('C-Reactive Protein (CRP)', 400, 15, '10 hours', true, 'Inflammation');

-- Add Extensive Demo Health Packages (10+)
INSERT INTO public.health_packages (name, total_tests, discounted_price, original_price, is_popular, tests_included) VALUES
('Basic Health Check', 35, 799, 1500, true, '{"CBC", "Blood Sugar", "Urine R/M"}'),
('Advanced Health Check', 68, 1499, 3500, true, '{"Basic Health Check", "Lipid Profile", "LFT", "KFT"}'),
('Full Body Checkup (Male)', 92, 2499, 6000, true, '{"Advanced Health Check", "Thyroid Profile", "PSA"}'),
('Full Body Checkup (Female)', 95, 2799, 6500, true, '{"Advanced Health Check", "Thyroid Profile", "Pap Smear"}'),
('Diabetes Care Premium', 15, 999, 2000, false, '{"Fasting Blood Sugar", "HbA1c", "KFT", "Microalbuminuria"}'),
('Healthy Heart Package', 25, 1999, 4500, false, '{"Lipid Profile", "hs-CRP", "Homocysteine", "ECG"}'),
('Senior Citizen (Male)', 75, 2999, 7000, false, '{"Full Body Checkup (Male)"}'),
('Senior Citizen (Female)', 75, 2999, 7000, false, '{"Full Body Checkup (Female)"}'),
('Women''s Wellness Advanced', 60, 2199, 5000, false, '{"CBC", "Thyroid", "Vitamin D", "Iron Studies"}'),
('Men''s Wellness Advanced', 60, 2199, 5000, false, '{"CBC", "Lipid Profile", "Prostate Health", "Testosterone"}'),
('Monsoon Fever Panel', 10, 1299, 2500, false, '{"CBC", "Dengue Test", "Malaria Test", "Typhoid"}');
