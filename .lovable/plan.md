

# Connect BuildSpace to External Supabase with Auth

## Current Architecture (where each feature lives)

```text
Feature                   Files
─────────────────────────────────────────────────────────
Developer Profiles        src/components/ProfileCard.tsx
  - Create profile        src/components/CreateProfileDialog.tsx
  - Data model            src/data/mockData.ts (Developer interface)

Projects & Teams          src/components/ProjectCard.tsx
  - Create project        src/components/CreateProjectDialog.tsx
  - Join project          src/context/DataContext.tsx (joinProject)

Opportunity Board         src/components/OpportunityCard.tsx
  - Post opportunity      src/components/CreateOpportunityDialog.tsx

Activity Feed             src/components/FeedItemCard.tsx
  - Auto-generated        src/context/DataContext.tsx (addFeedItem)

State Management          src/context/DataContext.tsx (React Context + localStorage)
Navigation                src/components/Navbar.tsx
Pages                     src/pages/Index.tsx, Profiles.tsx, Projects.tsx, Opportunities.tsx
Routing                   src/App.tsx
```

Currently everything is in-memory + localStorage. No real database, no auth.

---

## Plan

### 1. Connect Supabase Integration
- Use the Supabase connector to link your external Supabase project
- This gives us the Supabase URL and anon key as environment variables

### 2. Create Database Tables (migrations)

Four tables matching existing interfaces:

- **profiles** — `id (uuid, FK to auth.users)`, `name`, `username`, `avatar_url`, `bio`, `skills (text[])`, `interests (text[])`, `github`, created_at
- **projects** — `id`, `title`, `description`, `tech_stack (text[])`, `owner_id (FK profiles)`, `members`, `max_members`, `status`, created_at
- **project_members** — `project_id`, `user_id` (join table for tracking who joined)
- **opportunities** — `id`, `title`, `type`, `description`, `tags (text[])`, `deadline`, `posted_by (FK profiles)`, created_at
- **feed_items** — `id`, `type`, `title`, `description`, `author_id (FK profiles)`, `tags (text[])`, created_at

All tables get RLS enabled. Policies: authenticated users can read all rows; users can only insert/update their own data.

### 3. Auth — Login/Signup Pages
- Create `src/pages/Auth.tsx` with email/password login and signup forms
- Create `src/hooks/useAuth.ts` for session management via `onAuthStateChange`
- Add a `ProtectedRoute` wrapper for pages that require login
- Auto-create a profile row on first signup via a database trigger
- Add login/logout button to the Navbar

### 4. Replace DataContext with Supabase Queries
- Set up `src/integrations/supabase/client.ts` with the Supabase JS client
- Replace `DataContext` localStorage logic with real Supabase queries (select, insert, update)
- Use React Query (`useQuery`/`useMutation`) for data fetching and caching
- Update `CreateProfileDialog`, `CreateProjectDialog`, `CreateOpportunityDialog` to insert into Supabase
- Update `joinProject` to insert into `project_members` and increment the counter
- Feed items auto-created via a Postgres trigger on inserts to projects/opportunities

### 5. Update UI Components
- Navbar gets a user avatar + logout button when logged in
- Create/Join actions require authentication (redirect to login if not signed in)
- Profile page shows "Edit Profile" for the logged-in user's own card

---

## What You Need to Provide
- Your **external Supabase project URL** and **anon key** (you'll be prompted to connect via the Supabase integration dialog)

