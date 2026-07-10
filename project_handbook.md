# CampusBoard Project Handbook

Welcome to the definitive engineering and design handbook for CampusBoard. This document is the single source of truth for the project. It ensures that every future feature, component, and page adheres to the established architectural standards and ultra-premium minimalist design language.

---

## 1. Project Overview

**Purpose:** CampusBoard is a real-time, authenticated notice board platform designed for university or corporate environments. It features a premium, minimalist UI with a flawless dark/light mode implementation.

**Tech Stack:**
- **Frontend Framework:** React 19 (Vite)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS (Custom extended design system)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications/Toasts:** Sonner
- **Backend as a Service (BaaS):** Supabase (Auth, Postgres, Realtime, Storage)

**Architecture Strategy:** 
The app is built as a Single Page Application (SPA). It uses a Context API (`AuthContext`, `ThemeContext`) for global state, and custom React Hooks (`useNotices`, `useNotifications`) to encapsulate data fetching and Supabase Realtime subscriptions.

---

## 2. Folder-by-Folder Breakdown

```text
src/
├── components/     # Reusable UI blocks
│   └── ui/         # Atomic design system components (buttons, inputs, badges)
├── context/        # Global state providers (React Context)
├── hooks/          # Custom React hooks containing business logic
├── lib/            # Utility libraries and third-party wrappers
├── pages/          # Top-level route components
├── routes/         # Routing logic (e.g., ProtectedRoute)
└── utils/          # Pure helper functions
```

- **`components/`**: Place domain-specific reusable blocks here (e.g., `NoticeCard`, `AvatarUpload`). Do *not* place entire pages here.
- **`components/ui/`**: Place "dumb" atomic components here (e.g., `Button`, `Badge`). They should never fetch data or know about business logic.
- **`hooks/`**: All Supabase data fetching and state manipulation must live here. Never put `supabase.from(...)` directly inside a UI component.
- **`pages/`**: Only top-level components mapped directly in React Router belong here.
- **`utils/`**: Place pure, stateless javascript functions here (e.g., date formatting).

---

## 3. File-by-File Documentation

### Core Configuration
- **`tailwind.config.js`**: Extends the default theme to include our custom `ink`, `surface`, and `brand` color scales, Fraunces typography, and custom `fade-up` animations. 
- **`src/index.css`**: The heart of the CSS system. Uses CSS variables (`--color-surface`) to enable a seamless, semantic dark mode. Also contains overrides for annoying browser defaults (like `-webkit-autofill`).
- **`src/supabaseClient.js`**: Initializes and exports the single singleton instance of the Supabase client.

### Core Application
- **`src/App.jsx`**: The entry point. Wraps the app in `ThemeProvider`, `AuthProvider`, and `BrowserRouter`.
- **`src/main.jsx`**: React 19 `createRoot` rendering entry point.

---

## 4. Component Library Documentation

### Atomic Components (`src/components/ui/`)

#### `Badge.jsx` (The Unified Tag System)
- **Purpose:** Single source of truth for all tags, roles, and pill-shaped markers.
- **Styling:** Enforces a strict pill shape (`rounded-full`), `text-[11px]`, `uppercase`, `font-bold`, `tracking-wider`, and `backdrop-blur-md`. 
- **Usage:** Takes a `variant` prop (`brand`, `red`, `indigo`, `emerald`, `blue`, `default`) to semantically color the badge. 

#### `Button.jsx`
- **Purpose:** The standard interactive trigger.
- **Styling:** Uses a scale effect on active (`active:scale-[0.98]`), rounded corners (`rounded`), and smooth transition colors.
- **Variants:** Primary (brand background), Ghost/Outline variants, Danger (red).

#### `Input.jsx` (Includes `Input` and `Textarea`)
- **Purpose:** Form inputs.
- **Styling:** Borderless inside forms or subtly bordered in standalone areas, using `placeholder:text-ink-400` globally.

### Domain Components (`src/components/`)

#### `RoleBadge.jsx`
- **Purpose:** Wraps the atomic `<Badge />` component to automatically assign the correct color variant based on the user's string role (e.g., mapping `admin` to the `brand` variant).

#### `NoticeForm.jsx`
- **Purpose:** The composer block for submitting announcements.
- **Design:** A single, seamless frosted-glass pane (`backdrop-blur-xl`) with native inputs floating inside. 

#### `NoticeCard.jsx`
- **Purpose:** Displays a single feed item.
- **Design:** Highly subtle borders (`border-border/40 dark:border-white/5`), minimal background opacity, and utilizes the `<Badge />` component for audience tags, priority, and pins.

#### `AvatarUpload.jsx`
- **Purpose:** Handles direct-to-Supabase profile image uploads using the `avatars` storage bucket.

---

## 5. Design System Documentation

> [!IMPORTANT]
> Do not use raw Tailwind colors (e.g., `bg-gray-800`). You must use the semantic tokens defined below to ensure Dark Mode works automatically.

### Typography
- **Display (`font-display`):** Fraunces/Georgia. Used strictly for Auth/Landing Page Titles (e.g., "Welcome back", "Your Campus"). **Do not use this on data-heavy dashboards.**
- **Sans (`font-sans`):** Inter. The core application font. Used for everything on the Dashboard (headers, body text, buttons, inputs) to maintain a strict, professional SaaS aesthetic.

### Colors (Semantic Scale)
- **`canvas`**: The absolute background of the application (very light grey in light mode, near-black in dark mode).
- **`surface`**: Elements resting *on* the canvas (e.g., cards, popovers).
- **`border`**: Faint lines to separate elements.
- **`ink-900` to `ink-200`**: Semantic Text hierarchy. 
  - *Note on Dark Mode:* The `.dark` scale in `index.css` is strictly semantic, NOT mathematically inverted. This ensures `ink-400` remains a legible medium-gray (`#71717A`) against dark backgrounds.

### Glassmorphism System
To achieve our signature floating UI, combine:
1. `bg-white/40 dark:bg-black/20`
2. `backdrop-blur-xl` or `backdrop-blur-md`
3. `border border-border/60 dark:border-white/10`

---

## 6. UI Consistency Rules (Phase 2 Refined)

- **Unified Tags:** All tags, markers, and statuses must use the `<Badge />` component. Never write custom `<span>` elements for tags.
- **Glassmorphism Standard:** When creating a new card, it must use the glassmorphism system. Crucially, enforce **Responsive Padding**: all main cards must use `p-5 md:p-6` to ensure vertical rhythm is completely unified on desktop.
- **Global Layout Wrapper:** The content must be wrapped in a `max-w-3xl mx-auto px-4 md:px-8` container to maintain elegant line-reading lengths.
- **Header Anchoring:** Any standalone page headers (e.g. Auth navbars) must include `pt-4` padding to perfectly match the internal app Navbar, preventing vertical "jumping" on route changes.
- **Interactive Component Sizing:** The standard `<Button size="md" />` must always be `h-10` to perfectly align with the `h-10` standard of `<Input />` fields when placed side-by-side.
- **Focus Rings:** All interactive elements (buttons, links) must utilize our global unified focus ring: `focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface`. 
- **Empty States:** Absolutely no emojis. Use a high-quality monochromatic `lucide-react` icon inside a subtle circular background (`bg-ink-900/5 dark:bg-white/5`), followed by a `font-sans` title and `ink-400` subtitle.

---

## 7. Design Tokens

| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| Primary Text | `text-ink-900` | Headings, core body text |
| Subdued Text | `text-ink-600` | Subtitles, disabled inputs |
| Meta Text | `text-ink-400` | Timestamps, placeholders, empty states |
| Brand Color | `text-brand-500` | Links, primary icons |
| Page Background | `bg-canvas` | `<body>` or root `main` div |
| Card Radius | `rounded-2xl` | Large containers, composer, cards |
| Input Radius | `rounded` | Buttons, standalone inputs |
| Focus Ring | `focus-visible:ring-brand-500` | Applied globally with `ring-2` and `ring-offset-2` |
| Glass Padding | `p-5 md:p-6` | Standard internal padding for all glassmorphism cards |

---

## 8. Reusable Patterns

### 1. The Custom Hook API Pattern
Never write `useEffect` and `supabase` calls inside a UI component for core data. 
**Pattern:** Create a hook (e.g., `useNotices.js`) that handles `loading`, `error`, and `data` states. The UI component imports this hook and simply renders the states.

### 2. Intelligent Auth Fallbacks (`AuthContext.jsx`)
If a user creates an account but `user_metadata.full_name` is missing, `AuthContext` will intelligently fallback to extracting the prefix from their email address (`user.email.split('@')[0]`) during Profile creation, avoiding hardcoded generic strings.

### 3. Non-blocking Auth & Protected Route Pattern
Use `ProtectedRoute.jsx` to wrap any route in `App.jsx` that requires authentication. It automatically checks the `AuthContext` and redirects to `/login` if no user exists.

### 4. The Relational Realtime Subscription Pattern
Use `useRealtimeNotices.js` to listen for database `INSERT` or `DELETE` payloads. When an `INSERT` occurs, perform an immediate secondary fetch to grab the joined relational data (like the author's Profile) before updating the React state, ensuring the feed stays live and fully attributed.

---

## 9. Component Relationships

- **Dependency Rule:** UI Components (`components/ui`) can never import Domain Components (`components/`). 
- **State Rule:** The `Dashboard` holds the notices array. It passes the `addNotice` function down to `NoticeForm`, and the array of data down to a mapped list of `NoticeCard`s.
- **Avoid Duplication:** If you need a styled container, do not write raw HTML. Build a `Card` component in `ui/` if the glassmorphism classes become too repetitive.

---

## 10. Coding Standards

1. **Imports:** Standardize import order:
   - React & Third Party (`lucide-react`, `framer-motion`)
   - Contexts / Hooks
   - Components
   - Utils
2. **File Naming:** React components use `PascalCase.jsx`. Hooks use `camelCase.js`. Utils use `camelCase.js`.
3. **Exports:** Always use `export function ComponentName() {}` for main components.

---

## 11. Supabase Setup & Full Reset Schema

If you are setting up this project from scratch, or need to perform a **full database reset**, use the SQL script below. It safely drops tables, recreates the schema, configures storage buckets, and establishes Realtime publications.

### 1. Environment Variables
Create a `.env.local` file in the root directory:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 2. Full SQL Schema (Drop & Recreate)
Run the following SQL in the Supabase SQL Editor. 
> [!WARNING]
> This drops all tables in the public schema and destroys existing data (excluding `auth.users`).

```sql
-- CampusBoard Full Reset & Schema Script

-------------------------------------------------
-- 0. DANGER ZONE: DROP EXISTING TABLES
-------------------------------------------------
drop table if exists notifications cascade;
drop table if exists replies cascade;
drop table if exists notices cascade;
drop table if exists profiles cascade;

-------------------------------------------------
-- 1. PROFILES TABLE
-------------------------------------------------
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  bio text,
  role text default 'member',
  updated_at timestamp default now()
);

alter table profiles enable row level security;
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-------------------------------------------------
-- 2. NOTICES TABLE
-------------------------------------------------
create table notices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  title text not null,
  content text,
  priority text default 'normal',
  is_pinned boolean default false,
  audience text[] default '{}',
  department text,
  status text default 'published',
  created_at timestamp default now()
);

alter table notices enable row level security;
create policy "Notices are viewable by everyone" on notices for select using (true);
create policy "Users can insert their own notices" on notices for insert with check (auth.uid() = user_id);
create policy "Users or Admins can update notices" on notices for update using (
  auth.uid() = user_id or exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Users or Admins can delete notices" on notices for delete using (
  auth.uid() = user_id or exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-------------------------------------------------
-- 3. REPLIES TABLE
-------------------------------------------------
create table replies (
  id uuid default gen_random_uuid() primary key,
  notice_id uuid references notices on delete cascade,
  user_id uuid references profiles on delete cascade,
  message text not null,
  created_at timestamp default now()
);

alter table replies enable row level security;
create policy "Replies viewable by everyone" on replies for select using (true);
create policy "Users can insert own replies" on replies for insert with check (auth.uid() = user_id);
create policy "Users can delete own replies" on replies for delete using (auth.uid() = user_id);
create policy "Admins can delete any reply" on replies for delete using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-------------------------------------------------
-- 4. NOTIFICATIONS TABLE
-------------------------------------------------
create table notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  message text not null,
  is_read boolean default false,
  created_at timestamp default now()
);

alter table notifications enable row level security;
create policy "Users can view their own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users can insert their own notifications" on notifications for insert with check (auth.uid() = user_id);
create policy "Users can update their own notifications" on notifications for update using (auth.uid() = user_id);

-------------------------------------------------
-- 5. NOTIFICATION TRIGGER
-------------------------------------------------
create or replace function notify_all_users_on_new_notice()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into notifications (user_id, message)
  select id, 'New notice posted: "' || new.title || '"'
  from auth.users
  where id != new.user_id;
  return new;
end;
$$;

drop trigger if exists trg_notify_all_users_on_new_notice on notices;
create trigger trg_notify_all_users_on_new_notice
after insert on notices
for each row
execute function notify_all_users_on_new_notice();

-------------------------------------------------
-- 6. REALTIME CONFIGURATION
-------------------------------------------------
-- We use a DO block to safely add to publication only if they don't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notices'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notices;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'replies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE replies;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;

-------------------------------------------------
-- 7. STORAGE BUCKET (AVATARS)
-------------------------------------------------
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;

create policy "Avatar images are publicly accessible"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects for update using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
```

*End of Document. Refer to this handbook before making architectural decisions.*
