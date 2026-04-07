# BuildSpace - Developer Collaboration Platform

[BuildSpace](https://build-space-sage.vercel.app/) is a responsive web application designed to unify the fragmented student developer ecosystem. It brings together professional profiles, project collaboration, and opportunity discovery into a single, interactive platform.

[Live Demo](https://build-space-sage.vercel.app/)

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, TypeScript
* **Styling:** Tailwind CSS, Shadcn UI, Radix UI
* **Backend & Database:** Supabase with PostgreSQL
* **State Management:** TanStack Query (React Query)
* **Authentication:** Supabase Auth

---

## 🚀 Features

* **Dark & Light Mode:** Fully themed UI for comfortable viewing at any time.
* **Advanced Search & Filtering:** Filter projects by tech stack and developers by skills or name.
* **Profile Sharing:** Unique, shareable URLs (`/profile/:username`) to showcase your portfolio.
* **Interactive Feed:** A dynamic dashboard displaying new projects, team updates, and community opportunities.
* **Project Management:** Create and join projects with specific tech stacks and detailed descriptions.
* **Opportunity Board:** Browse or post "Hiring," "Looking for Teammates," or "Hackathon" openings.

---

## 📄 Pages Overview

| Path | Description |
| :--- | :--- |
| `/` | **Home**: The main landing page and interactive activity feed. |
| `/profiles` | **Profiles**: A directory to browse developers and filter by skills. |
| `/profile/:username` | **Profile Detail**: A dedicated page for individual developer portfolios. |
| `/projects` | **Projects**: A hub to discover projects by tech stack or title. |
| `/opportunities` | **Opportunities**: A board for job roles and team formations. |
| `/auth` | **Auth**: Unified page for login, registration, and password recovery. |

---

## 🔐 Authentication

BuildSpace uses secure email-based authentication via Supabase:

1.  **Sign Up:** Create an account using your email and a password (min. 6 characters).
2.  **Sign In:** Access your account with your credentials.
3.  **Password Reset:** Request a reset link via email if you forget your credentials.

