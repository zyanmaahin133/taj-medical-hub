
-- Grant all permissions to the service_role so it can bypass RLS
-- This ensures your server-side code and migrations can always access the database.

-- For existing tables:
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow admin users to perform all operations on these tables.
-- We check if the user has the 'admin' role using a helper function.

-- Drop policies if they exist to prevent conflicts
DROP POLICY IF EXISTS "Allow admin full access" ON public.orders;
DROP POLICY IF EXISTS "Allow admin full access" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin full access" ON public.appointments;
DROP POLICY IF EXISTS "Allow admin full access" ON public.wholesale_profiles;
DROP POLICY IF EXISTS "Allow admin full access" ON public.quote_requests;

-- Create policies for admin
CREATE POLICY "Allow admin full access" ON public.orders FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow admin full access" ON public.profiles FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow admin full access" ON public.appointments FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow admin full access" ON public.wholesale_profiles FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow admin full access" ON public.quote_requests FOR ALL USING (public.is_admin(auth.uid()));

-- Also ensure non-admins have some basic permissions to prevent other errors
CREATE POLICY "Allow users to see their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

