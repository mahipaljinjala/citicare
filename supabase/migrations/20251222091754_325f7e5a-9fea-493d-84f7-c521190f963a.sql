-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'department_head', 'officer', 'citizen');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  department_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'citizen',
  UNIQUE (user_id, role)
);

-- Create has_role function for RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create zones table
CREATE TABLE public.zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create wards table
CREATE TABLE public.wards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES public.zones(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create areas table
CREATE TABLE public.areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_id UUID REFERENCES public.wards(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create complaint status enum
CREATE TYPE public.complaint_status AS ENUM ('pending', 'in_progress', 'resolved', 'rejected', 'closed');

-- Create priority enum
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create complaints table
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status complaint_status NOT NULL DEFAULT 'pending',
  priority priority_level NOT NULL DEFAULT 'medium',
  department_id UUID REFERENCES public.departments(id),
  assigned_to UUID REFERENCES auth.users(id),
  zone_id UUID REFERENCES public.zones(id),
  ward_id UUID REFERENCES public.wards(id),
  area_id UUID REFERENCES public.areas(id),
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create complaint images table
CREATE TABLE public.complaint_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create complaint comments table
CREATE TABLE public.complaint_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Public read access for location tables
CREATE POLICY "Anyone can view zones" ON public.zones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view wards" ON public.wards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view areas" ON public.areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view departments" ON public.departments FOR SELECT TO authenticated USING (true);

-- Admin management for location tables
CREATE POLICY "Admins can manage zones" ON public.zones FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage wards" ON public.wards FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage areas" ON public.areas FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Complaints policies
CREATE POLICY "Users can view their own complaints" ON public.complaints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create complaints" ON public.complaints FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Officers can view assigned complaints" ON public.complaints FOR SELECT USING (auth.uid() = assigned_to);
CREATE POLICY "Admins and dept heads can view all complaints" ON public.complaints FOR SELECT USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'department_head') OR public.has_role(auth.uid(), 'officer')
);
CREATE POLICY "Staff can update complaints" ON public.complaints FOR UPDATE USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'department_head') OR public.has_role(auth.uid(), 'officer')
);

-- Complaint images policies
CREATE POLICY "Anyone can view complaint images" ON public.complaint_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can add images to their complaints" ON public.complaint_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.complaints WHERE id = complaint_id AND user_id = auth.uid())
);

-- Complaint comments policies
CREATE POLICY "Users can view non-internal comments on their complaints" ON public.complaint_comments FOR SELECT USING (
  (NOT is_internal AND EXISTS (SELECT 1 FROM public.complaints WHERE id = complaint_id AND user_id = auth.uid()))
);
CREATE POLICY "Staff can view all comments" ON public.complaint_comments FOR SELECT USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'department_head') OR public.has_role(auth.uid(), 'officer')
);
CREATE POLICY "Authenticated users can add comments" ON public.complaint_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Authenticated users can view documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can manage documents" ON public.documents FOR ALL USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'department_head')
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'full_name', 'User'), new.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'citizen');
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate complaint number
CREATE OR REPLACE FUNCTION public.generate_complaint_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.complaint_number := 'SMC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('complaint_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Create sequence for complaint numbers
CREATE SEQUENCE IF NOT EXISTS complaint_number_seq START 1;

-- Create trigger for complaint number generation
CREATE TRIGGER set_complaint_number
  BEFORE INSERT ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION public.generate_complaint_number();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for zones
INSERT INTO public.zones (name, code) VALUES
  ('Zone 1 - Central', 'Z1'),
  ('Zone 2 - East', 'Z2'),
  ('Zone 3 - West', 'Z3'),
  ('Zone 4 - North', 'Z4'),
  ('Zone 5 - South', 'Z5');

-- Insert sample departments
INSERT INTO public.departments (name, code, description) VALUES
  ('Roads & Infrastructure', 'ROADS', 'Handles road maintenance and infrastructure'),
  ('Water Supply', 'WATER', 'Water supply and drainage'),
  ('Sanitation', 'SANIT', 'Waste management and cleanliness'),
  ('Electricity', 'ELEC', 'Street lighting and electrical issues'),
  ('Town Planning', 'TOWN', 'Building and construction related');