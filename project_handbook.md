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
- **Backend as a Service (BaaS):** Supabase (Auth, Postgres, Realtime)

**Architecture Strategy:** 
The app is built as a Single Page Application (SPA). It uses a Context API (`AuthContext`, `ThemeContext`) for global state, and custom React Hooks (`useNotices`, `useNotifications`) to encapsulate data fetching and Supabase Realtime subscriptions.

---

## 2. Folder-by-Folder Breakdown

```text
src/
├── components/     # Reusable UI blocks
│   └── ui/         # Atomic design system components (buttons, inputs)
├── context/        # Global state providers (React Context)
├── hooks/          # Custom React hooks containing business logic
├── lib/            # Utility libraries and third-party wrappers
├── pages/          # Top-level route components
├── routes/         # Routing logic (e.g., ProtectedRoute)
└── utils/          # Pure helper functions
```

- **`components/`**: Place domain-specific reusable blocks here (e.g., `NoticeCard`). Do *not* place entire pages here.
- **`components/ui/`**: Place "dumb" atomic components here (e.g., `Button`). They should never fetch data or know about business logic.
- **`hooks/`**: All Supabase data fetching and state manipulation must live here. Never put `supabase.from(...)` directly inside a UI component.
- **`pages/`**: Only top-level components mapped directly in React Router belong here.
- **`utils/`**: Place pure, stateless javascript functions here (e.g., date formatting).

---

## 3. File-by-File Documentation

### Core Configuration
- **`tailwind.config.js`**: Extends the default theme to include our custom `ink`, `surface`, and `brand` color scales, Fraunces typography, and custom `fade-up` animations. 
- **`src/index.css`**: The heart of the CSS system. Uses CSS variables (`--color-surface`) to enable a seamless, inverted dark mode. Also contains overrides for annoying browser defaults (like `-webkit-autofill`).
- **`src/supabaseClient.js`**: Initializes and exports the single singleton instance of the Supabase client.

### Core Application
- **`src/App.jsx`**: The entry point. Wraps the app in `ThemeProvider`, `AuthProvider`, and `BrowserRouter`.
- **`src/main.jsx`**: React 19 `createRoot` rendering entry point.

---

## 4. Component Library Documentation

### Atomic Components (`src/components/ui/`)

#### `Button.jsx`
- **Purpose:** The standard interactive trigger.
- **Styling:** Uses a scale effect on active (`active:scale-[0.98]`), rounded corners (`rounded-xl`), and smooth transition colors.
- **Variants:** Primary (brand background) and Ghost/Outline variants.

#### `Input.jsx` (Includes `Input` and `Textarea`)
- **Purpose:** Form inputs.
- **Styling:** Borderless by default inside forms, using a subtle `placeholder:text-ink-400` strategy.

### Domain Components (`src/components/`)

#### `NoticeForm.jsx`
- **Purpose:** The composer block for submitting announcements.
- **Design:** A single, seamless frosted-glass pane (`backdrop-blur-xl`) with native inputs floating inside. No nested borders.

#### `NoticeCard.jsx`
- **Purpose:** Displays a single feed item.
- **Design:** Highly subtle borders (`border-white/10`), minimal background opacity, and a hover effect that slightly lifts the card and reveals the delete action (for owners only).

#### `NotificationBell.jsx`
- **Purpose:** Top-nav indicator for unread messages.
- **Design:** Uses `framer-motion` to mount/unmount a sleek, absolute-positioned popover menu.

---

## 5. Design System Documentation

> [!IMPORTANT]
> Do not use raw Tailwind colors (e.g., `bg-gray-800`). You must use the semantic tokens defined below to ensure Dark Mode works automatically.

### Typography
- **Display (`font-display`):** Fraunces/Georgia. Used strictly for large Page Titles (e.g., "Welcome back", "Notice Board") and the Logo.
- **Sans (`font-sans`):** Inter. Used for everything else (body text, buttons, inputs).

### Colors (Semantic Scale)
- **`canvas`**: The absolute background of the application (very light grey in light mode, near-black in dark mode).
- **`surface`**: Elements resting *on* the canvas (e.g., cards, popovers).
- **`border`**: Faint lines to separate elements.
- **`ink-950` to `ink-200`**: Text hierarchy. Use `ink-900` for primary text, `ink-700` for secondary, and `ink-400` for placeholders/meta.
- **`brand-500`**: The primary action color (Moss Green).

### Glassmorphism System
To achieve our signature floating UI, combine:
1. `bg-white/40 dark:bg-black/20`
2. `backdrop-blur-xl`
3. `border border-white/10 dark:border-white/5`

---

## 6. UI Consistency Rules

- **When creating a new card:** It must use the glassmorphism system above. Do not use solid `bg-white` or `bg-gray-800`.
- **When creating a new page:** The content must be wrapped in a `max-w-3xl mx-auto` container to maintain elegant line-reading lengths.
- **When adding buttons:** Primary buttons must use the semantic `brand` color. Secondary actions should use `text-ink-700 hover:text-ink-900`.
- **When creating empty states:** Do not use dashed borders. Use a single icon floating above a subtle, small circular background, followed by a `font-display` title and `ink-500` subtitle.

---

## 7. Design Tokens

| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| Primary Text | `text-ink-900` | Headings, core body text |
| Subdued Text | `text-ink-600` | Subtitles, helper text |
| Meta Text | `text-ink-400` | Timestamps, placeholders |
| Brand Color | `text-brand-500` | Links, primary icons |
| Page Background | `bg-canvas` | `<body>` or root `main` div |
| Card Radius | `rounded-2xl` | Large containers, composer, cards |
| Input Radius | `rounded-xl` | Buttons, standalone inputs |

---

## 8. Reusable Patterns

### 1. The Custom Hook API Pattern
Never write `useEffect` and `supabase` calls inside a UI component. 
**Pattern:** Create a hook (e.g., `useNotices.js`) that handles `loading`, `error`, and `data` states. The UI component imports this hook and simply renders the states.

### 2. The Protected Route Pattern
Use `ProtectedRoute.jsx` to wrap any route in `App.jsx` that requires authentication. It automatically checks the `AuthContext` and redirects to `/login` if no user exists.

### 3. The Realtime Subscription Pattern
Use `useRealtimeNotices.js` to listen for database `INSERT` or `DELETE` payloads, and update the React state instantly without requiring a page reload.

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
3. **Exports:** Always use `export default function ComponentName() {}` for main components (avoid arrow functions for default exports to improve React DevTools naming).

---

## 11. Future Development Guide

**If you add a new "Events" module:**
1. Create `src/hooks/useEvents.js`.
2. Create `src/components/EventCard.jsx` (mirroring `NoticeCard`).
3. Create `src/pages/Events.jsx`.
4. Wrap `Events` in `<ProtectedRoute>` in `App.jsx`.

**If you build another form:**
1. Wrap it in the standard `rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-black/20` container.
2. Use raw, unbordered `<input className="bg-transparent">` elements inside it.
3. Separate inputs with a `1px bg-border/40` divider line.

---

## 12. UI/UX Best Practices

- **Where we excel:** The ultra-minimalist, borderless forms and the completely automated light/dark mode inversion.
- **Where we must be careful:** As we add more features, the UI can easily become cluttered. Always default to hiding secondary actions (like "Delete") behind a CSS hover state (`opacity-0 group-hover:opacity-100`) rather than cluttering the screen with icons.

---

## 13. Project Style Guide

### Do's
- **DO** use `lucide-react` for all icons.
- **DO** use `framer-motion` for mounting/unmounting dropdowns and modals.
- **DO** rely on spacing (`gap`, `mt`, `mb`) rather than hard lines to separate content.

### Don'ts
- **DON'T** use `box-shadow` aggressively. Rely on the `backdrop-blur` for depth.
- **DON'T** use the `style={{}}` prop inline. Use Tailwind classes.
- **DON'T** use alerts or `window.confirm()`. Use the `sonner` toast library for feedback.

---

## 14. Future AI Reference

```json
{
  "project": "CampusBoard",
  "framework": "React+Vite",
  "css": "Tailwind",
  "design_language": "Glassmorphism, Minimalist, High-Contrast Dark Mode",
  "rules": [
    "Never use hard borders on containers; use border-white/10.",
    "Use font-display for headers, font-sans for body.",
    "Data fetching logic MUST live in custom hooks in /src/hooks.",
    "Do not use generic colors (e.g. gray-800); use the semantic 'ink', 'surface', and 'brand' scales."
  ]
}
```
*End of Document. Refer to this handbook before making architectural decisions.*
