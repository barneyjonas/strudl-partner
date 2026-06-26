# Strudl for Cafés

Partner portal for independent cafés on the Strudl loyalty network. Café owners register via partner code, then access a dashboard with customer analytics, loyalty tracking, billing, and more.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── page.tsx              # Landing / partner registration page
├── services/             # Services overview
├── contact/              # Contact page
└── dashboard/
    ├── login/            # Dashboard login
    ├── page.tsx          # Dashboard home
    └── components/       # Analytics, Customers, Billing, Settings, Maps…
```
