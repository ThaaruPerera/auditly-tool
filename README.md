# Auditly

Auditly is a React-based AI website audit tool that analyzes a public webpage and generates:

- factual website metrics
- AI content insights
- critical recommendations
- a printable PDF report
- saved report history per signed-in user
- shareable public report links

The UI is based on the original Stitch-designed HTML screens and has been converted into a routed React application.

## Features

- Home page with URL input and landing page UI
- Dashboard with:
  - factual metrics
  - audit score and summary
  - AI insight cards
  - recommendation cards
  - snapshot preview
  - PDF export
  - rerun analysis
  - public share link generation
- History page connected to the signed-in user
- Shared public report page at `/shared/:shareId`
- Email/password authentication with Supabase
- Google sign-in with Supabase OAuth

## Development Process Overview

The development of Auditly followed a structured UI-first workflow, moving from design, to frontend implementation, to backend integration, and finally deployment.

The project started with the visual design phase. The Home page was first designed in Figma, with additional template inspiration used to shape the layout and visual direction. That Figma design was then used as the reference for building the Home screen in Google Stitch.

After the Home UI was established, the remaining screens such as Dashboard, Analysis/loading, History, and supporting product states were generated in Google Stitch and then fine-tuned to better match the intended product experience. Once those screens were finalized, the corresponding HTML was generated from Stitch and used as the visual foundation of the application.

These static HTML files were then brought into Visual Studio Code and converted into a complete React application using Codex. During this stage, the focus was on preserving the original design exactly while restructuring the code into reusable React components, page-level routes, shared layout elements, and a maintainable project architecture.

Once the frontend structure was in place, the application was enhanced with real functionality. The dashboard was connected to a live analysis flow that accepts a website URL, extracts structured content signals, and presents factual metrics such as word count, headings, CTAs, links, images, alt-text coverage, and metadata. On top of these extracted signals, the app generates AI-style content insights, audit scoring, and recommendation summaries to create a full website audit experience.

After the core dashboard flow was functional, user-focused features were added around it. This included authentication, personalized report history, saved audit records tied to each signed-in user, public report sharing, and printable PDF export. Supabase was integrated as the backend service to support authentication, persistent analysis history, and shared report storage.

Finally, the application was prepared for deployment as a React single-page app and configured for hosting through Vercel, with routing support for direct page access and refresh-safe navigation.

Prompt logs used during the AI-assisted development process and feature orchestration were documented separately and included as part of the project materials.

## Tech Stack

- React 18
- React Router 6
- Supabase Auth + Database
- jsPDF
- Create React App

## Project Structure

```text
src/
  components/      Shared UI pieces
  context/         Auth and analysis state
  lib/             Supabase client
  pages/           Routed app pages
  styles/          Global and page styles
public/
  index.html
```

Main routes:

- `/` - Home
- `/login` - Login
- `/signup` - Signup
- `/dashboard` - Audit dashboard
- `/analysis` - Analysis/loading view
- `/history` - Saved audit history
- `/shared/:shareId` - Public shared report

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local`

Create a `.env.local` file in the project root:

```bash
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

Important:

- Do not commit `.env.local`
- If you previously exposed your anon key publicly, rotate it in Supabase

### 3. Run the app

```bash
npm start
```

The app will usually open at:

```text
http://localhost:3000
```

### 4. Production build

```bash
npm run build
```

## Supabase Setup

Auditly uses Supabase for:

- authentication
- saved analysis history
- shared public reports

### Auth

In Supabase Auth:

- enable Email/Password sign-in
- optionally enable Google provider
- add your local and deployed URLs to the allowed redirect URLs

Recommended redirect URLs:

- `http://localhost:3000/dashboard`
- `https://your-domain.com/dashboard`

If email confirmation is enabled, users may need to verify their email before they can log in.

### Database

Run this SQL in the Supabase SQL editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  metrics jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.analysis_history enable row level security;

create policy "Users can read their own analysis history"
on public.analysis_history
for select
using (auth.uid() = user_id);

create policy "Users can insert their own analysis history"
on public.analysis_history
for insert
with check (auth.uid() = user_id);

create table if not exists public.public_report_shares (
  id uuid primary key default gen_random_uuid(),
  share_id text not null unique,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  owner_name text not null default 'Auditly User',
  url text not null,
  metrics jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.public_report_shares
add column if not exists owner_name text not null default 'Auditly User';

alter table public.public_report_shares enable row level security;

create policy "Owners can insert public report shares"
on public.public_report_shares
for insert
to authenticated
with check (auth.uid() = owner_user_id);

create policy "Anyone can read public report shares"
on public.public_report_shares
for select
to anon, authenticated
using (true);
```

## How the App Works

### Website analysis

When a user submits a URL:

1. the app normalizes the URL
2. it tries to fetch the page HTML through multiple fallback sources
3. it parses the content in the browser
4. it calculates factual metrics
5. it generates AI insight text and recommendation cards
6. it stores the completed analysis in Supabase history for the signed-in user

### Factual metrics currently extracted

- total word count
- heading count (`H1` to `H3`)
- CTA count
- reading time
- internal links
- external links
- image count
- missing alt text percentage
- meta title
- meta description

### Saved history

Each successful analysis can be saved to `analysis_history` for the authenticated user.

The History page reads those saved rows and lets the user reopen a past report in the dashboard.

### Public sharing

The dashboard can create a public report share link.

Shared reports are stored in `public_report_shares` and can be viewed without login at:

```text
/shared/:shareId
```

## Notes and Limitations

- Some websites block browser-based fetching, even with proxy fallbacks
- Google login requires correct OAuth setup in Supabase
- The app depends on `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` for auth/history/share features
- Without Supabase config, UI pages still load, but auth-backed features will not work

## Deployment

### Vercel

This project can be deployed to Vercel as a React SPA.

Set these environment variables in Vercel:

```bash
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

The included `vercel.json` adds a rewrite so client-side routes continue to work on refresh, including:

- `/dashboard`
- `/history`
- `/analysis`
- `/shared/:shareId`

## Useful Scripts

```bash
npm start
npm run build
npm test
```

## Source Assets

The original HTML source files used as the design base are included in the project root:

- `Home.html`
- `dashboard.html`
- `Analysing.html`
- `history.html`

## Future Improvements

With more time, the website can be enhanced with the following features to improve usability, functionality, and overall user experience:

### Frontend / UI Enhancements

- Dark Mode / Light Mode Toggle for user preference and readability
- History filtering and searching so users can quickly find and revisit previous audits
- Drag & drop reordering for selected history or dashboard modules
- Enhanced dashboard customization so users can choose which metrics or insight blocks they want to see

### Backend / Data Management

- A backend proxy for more reliable website fetching and fewer browser-side fetch failures
- Rate limiting and a queue system to handle multiple audits efficiently and prevent overload
- Richer historical comparisons between saved audits over time
- Deeper persistence for additional analysis signals and report states
- Expanded sharing controls, including options like link revocation or share management
- A dedicated user profile page where users can view and edit their personal information

### Additional Improvements

- Notifications to alert users when an audit completes or requires attention
- Further AI and scoring improvements for more advanced and configurable insights

These enhancements would make the tool more robust, user-friendly, and scalable for real-world usage.

## License

This project currently has no explicit open-source license attached. Add one if you plan to distribute it publicly.
