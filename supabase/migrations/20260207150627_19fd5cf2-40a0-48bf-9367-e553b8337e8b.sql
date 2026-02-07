-- Add new role types for wholesale users
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'wholesale';

-- Create wholesale_profiles table for local shop owners
CREATE TABLE IF NOT EXISTS public.wholesale_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  business_name text NOT NULL,
  business_type text CHECK (business_type IN ('pharmacy', 'clinic', 'hospital', 'retail_shop', 'distributor')),
  gst_number text,
  drug_license_number text,
  pan_number text,
  business_address text,
  business_city text,
  business_state text,
  business_pincode text,
  contact_person text,
  phone text,
  email text,
  credit_limit numeric DEFAULT 0,
  credit_used numeric DEFAULT 0,
  discount_percentage numeric DEFAULT 10,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quote_requests table for wholesale custom quotes
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  wholesale_profile_id uuid REFERENCES public.wholesale_profiles(id),
  items jsonb NOT NULL,
  pdf_url text,
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'rejected', 'expired')),
  quoted_amount numeric,
  quoted_items jsonb,
  valid_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id),
  lab_booking_id uuid REFERENCES public.lab_bookings(id),
  scan_booking_id uuid REFERENCES public.scan_bookings(id),
  invoice_type text NOT NULL CHECK (invoice_type IN ('order', 'lab_test', 'scan', 'appointment')),
  customer_name text,
  customer_email text,
  customer_phone text,
  customer_address text,
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  tax_amount numeric DEFAULT 0,
  discount numeric DEFAULT 0,
  total numeric NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method text,
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

-- Create advertisements table for admin to manage homepage ads
CREATE TABLE IF NOT EXISTS public.advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  link_url text,
  link_type text DEFAULT 'external' CHECK (link_type IN ('external', 'product', 'category', 'page')),
  link_id text,
  position text DEFAULT 'carousel' CHECK (position IN ('carousel', 'banner', 'sidebar', 'popup')),
  priority integer DEFAULT 0,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notification_logs table for tracking sent notifications
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  notification_type text NOT NULL CHECK (notification_type IN ('email', 'sms', 'push')),
  template text NOT NULL,
  recipient text NOT NULL,
  subject text,
  content text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  error_message text,
  reference_type text,
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_id uuid REFERENCES public.orders(id),
  gateway text NOT NULL CHECK (gateway IN ('stripe', 'razorpay', 'cod')),
  gateway_transaction_id text,
  gateway_order_id text,
  amount numeric NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.wholesale_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS for wholesale_profiles
CREATE POLICY "Users can view own wholesale profile" ON public.wholesale_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wholesale profile" ON public.wholesale_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wholesale profile" ON public.wholesale_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage wholesale profiles" ON public.wholesale_profiles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS for quote_requests
CREATE POLICY "Users can view own quote requests" ON public.quote_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create quote requests" ON public.quote_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage quote requests" ON public.quote_requests
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS for invoices
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage invoices" ON public.invoices
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS for advertisements (public read, admin write)
CREATE POLICY "Advertisements are publicly readable" ON public.advertisements
  FOR SELECT USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));
CREATE POLICY "Admins can manage advertisements" ON public.advertisements
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS for notification_logs
CREATE POLICY "Users can view own notification logs" ON public.notification_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage notification logs" ON public.notification_logs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS for payment_transactions
CREATE POLICY "Users can view own payment transactions" ON public.payment_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage payment transactions" ON public.payment_transactions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wholesale_profiles_user_id ON public.wholesale_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_user_id ON public.quote_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON public.invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_advertisements_position ON public.advertisements(position);

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('invoice_seq')::text, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create sequence for invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- Create trigger for invoice number generation
DROP TRIGGER IF EXISTS generate_invoice_number_trigger ON public.invoices;
CREATE TRIGGER generate_invoice_number_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_invoice_number();