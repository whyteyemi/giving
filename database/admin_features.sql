
-- =====================================================
-- GIVING WITHOUT LIMIT - ADMIN FEATURES UPDATE
-- Events, Media, Help Me Campaigns, Volunteer Apps, Donations
-- =====================================================

-- 1. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'upcoming', -- 'upcoming', 'past', 'cancelled'
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EVENT MEDIA TABLE (Media Session)
CREATE TABLE IF NOT EXISTS public.event_media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL, -- 'image', 'video', 'audio'
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HELP ME CAMPAIGNS (Special Fundraising)
CREATE TABLE IF NOT EXISTS public.help_me_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  closing_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'closed'
  beneficiary_name TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. VOLUNTEER APPLICATIONS
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest_area TEXT,
  bio TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'disapproved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DONATIONS table (for accountability)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  campaign_id UUID REFERENCES public.help_me_campaigns(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'success', -- 'pending', 'success', 'failed'
  payment_id TEXT, -- external payment reference
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_me_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 1. Events Policies
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Event Media Policies
DROP POLICY IF EXISTS "Anyone can view event media" ON public.event_media;
CREATE POLICY "Anyone can view event media" ON public.event_media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage event media" ON public.event_media;
CREATE POLICY "Admins can manage event media" ON public.event_media FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Help Me Campaigns Policies
DROP POLICY IF EXISTS "Anyone can view campaigns" ON public.help_me_campaigns;
CREATE POLICY "Anyone can view campaigns" ON public.help_me_campaigns FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage campaigns" ON public.help_me_campaigns;
CREATE POLICY "Admins can manage campaigns" ON public.help_me_campaigns FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Volunteer Applications Policies
DROP POLICY IF EXISTS "Admins can view/manage applications" ON public.volunteer_applications;
CREATE POLICY "Admins can view/manage applications" ON public.volunteer_applications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Anyone can submit application" ON public.volunteer_applications;
CREATE POLICY "Anyone can submit application" ON public.volunteer_applications FOR INSERT WITH CHECK (true);

-- 5. Donations Policies
DROP POLICY IF EXISTS "Admins can view donations" ON public.donations;
CREATE POLICY "Admins can view donations" ON public.donations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Anyone can insert donation" ON public.donations;
CREATE POLICY "Anyone can insert donation" ON public.donations FOR INSERT WITH CHECK (true);

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================

DROP TRIGGER IF EXISTS on_events_updated ON public.events;
CREATE TRIGGER on_events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_campaigns_updated ON public.help_me_campaigns;
CREATE TRIGGER on_campaigns_updated BEFORE UPDATE ON public.help_me_campaigns FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_volunteer_apps_updated ON public.volunteer_applications;
CREATE TRIGGER on_volunteer_apps_updated BEFORE UPDATE ON public.volunteer_applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. IMPACT RECORDS (Media, Videos, Stories for Impact Page)
CREATE TABLE IF NOT EXISTS public.impact_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL, -- 'image', 'video', 'story'
  title TEXT NOT NULL,
  content TEXT,
  media_url TEXT,
  thumbnail_url TEXT,
  category TEXT, -- 'general', 'feeding', 'recovery', 'widows', 'education'
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.impact_records ENABLE ROW LEVEL SECURITY;

-- Impact Records Policies
DROP POLICY IF EXISTS "Anyone can view impact records" ON public.impact_records;
CREATE POLICY "Anyone can view impact records" ON public.impact_records FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage impact records" ON public.impact_records;
CREATE POLICY "Admins can manage impact records" ON public.impact_records FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS on_impact_records_updated ON public.impact_records;
CREATE TRIGGER on_impact_records_updated BEFORE UPDATE ON public.impact_records FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
