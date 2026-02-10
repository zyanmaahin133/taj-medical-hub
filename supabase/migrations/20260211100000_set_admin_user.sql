
-- This script ensures that the user with the specified email is assigned the 'admin' role.
-- It is safe to run multiple times.

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Find the user_id from the auth.users table using the email address
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'abbasmolla311@gmail.com';

  -- If a user with that email was found, insert or update their role in the public.user_roles table
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id)
    DO UPDATE SET role = 'admin';
  END IF;
END $$;
