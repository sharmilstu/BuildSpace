
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  github TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  members INTEGER NOT NULL DEFAULT 1,
  max_members INTEGER NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their projects" ON public.projects FOR UPDATE USING (auth.uid() = owner_id);

-- Create project_members join table
CREATE TABLE public.project_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members are viewable by everyone" ON public.project_members FOR SELECT USING (true);
CREATE POLICY "Users can join projects" ON public.project_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave projects" ON public.project_members FOR DELETE USING (auth.uid() = user_id);

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'hackathon' CHECK (type IN ('hackathon', 'open-source', 'internship', 'collaboration')),
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  deadline DATE,
  posted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Opportunities are viewable by everyone" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Users can post opportunities" ON public.opportunities FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Users can update their opportunities" ON public.opportunities FOR UPDATE USING (auth.uid() = posted_by);

-- Create feed_items table
CREATE TABLE public.feed_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('project', 'team-update', 'opportunity')),
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feed items are viewable by everyone" ON public.feed_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create feed items" ON public.feed_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'https://api.dicebear.com/9.x/notionists/svg?seed=' || encode(convert_to(COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 'UTF8'), 'base64')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: auto-create feed item when project is created
CREATE OR REPLACE FUNCTION public.handle_new_project_feed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.feed_items (type, title, description, author_id, tags)
  VALUES ('project', 'New project: ' || NEW.title, NEW.description, NEW.owner_id, NEW.tech_stack[1:2]);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_project_created
  AFTER INSERT ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_project_feed();

-- Trigger: auto-create feed item when opportunity is posted
CREATE OR REPLACE FUNCTION public.handle_new_opportunity_feed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.feed_items (type, title, description, author_id, tags)
  VALUES ('opportunity', NEW.title, NEW.description, NEW.posted_by, NEW.tags[1:2]);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_opportunity_created
  AFTER INSERT ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_opportunity_feed();

-- Trigger: auto-create feed item when someone joins a project
CREATE OR REPLACE FUNCTION public.handle_project_join_feed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  proj_title TEXT;
  proj_tech TEXT[];
  member_name TEXT;
  member_count INTEGER;
  proj_max INTEGER;
BEGIN
  SELECT title, tech_stack, max_members INTO proj_title, proj_tech, proj_max FROM public.projects WHERE id = NEW.project_id;
  SELECT name INTO member_name FROM public.profiles WHERE id = NEW.user_id;
  SELECT COUNT(*) INTO member_count FROM public.project_members WHERE project_id = NEW.project_id;
  
  UPDATE public.projects SET members = member_count + 1 WHERE id = NEW.project_id;
  
  INSERT INTO public.feed_items (type, title, description, author_id, tags)
  VALUES ('team-update', member_name || ' joined ' || proj_title, proj_title || ' now has ' || (member_count + 1) || '/' || proj_max || ' members.', NEW.user_id, proj_tech[1:2]);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_project_member_joined
  AFTER INSERT ON public.project_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_project_join_feed();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
