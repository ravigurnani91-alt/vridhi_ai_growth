# Vridhi — AI Growth & Outreach Engine

A GitHub-ready frontend prototype for the Vridhi AI Growth & Outreach Engine.

## What is included
- Dashboard overview with sample KPIs
- Lead discovery workspace
- Lead database with search and filtering
- Campaign overview and campaign creation UI
- Email outreach sequence preview
- LinkedIn outreach assistant (human-operated workflow)
- Follow-up task list
- Opportunities pipeline
- Analytics view
- Responsive layout

## Important prototype boundaries
This is a frontend prototype using sample data in the browser. It does **not** yet:
- discover or enrich real leads,
- send emails,
- access LinkedIn or automate LinkedIn messages,
- connect to Gmail, Outlook, a CRM, or an AI provider,
- persist data to a production database,
- provide authentication or multi-tenant security.

Those require backend services, provider credentials, permissions, compliance controls, and testing. Do not enter real customer or prospect data into this prototype.

## Run locally
Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy
1. Create a GitHub repository, for example `vridhi-ai-growth-engine`.
2. Upload the contents of this folder to the repository root.
3. Import the repository into Vercel.
4. Keep the framework preset as Next.js and deploy.

## Suggested next development milestone
Connect authentication and a PostgreSQL database, then implement tenant isolation, user roles, audit logs, lead CRUD, and CSV import before connecting AI research or email sending.

## Project structure
```text
app/
  globals.css
  layout.js
  page.js
components/
  AppShell.js
  Dashboard.js
  Leads.js
  Campaigns.js
  Outreach.js
  Tasks.js
  Pipeline.js
  Analytics.js
```
