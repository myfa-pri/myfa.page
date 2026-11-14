MyfaPost Creator OS (myfa.page) — Production Deployment Guide

Overview
MyfaPost Creator OS is a 100% free-forever multi-tenant wildcard subdomain publishing platform built with Next.js 14 (App Router), Tailwind CSS, Vercel Edge Middleware, and Firebase Spark Free Tier (Firebase Authentication + Cloud Firestore).

Quick Start (Local Development)
1. Extract myfa-page-full-project.zip into a new folder.
2. Run npm install
3. Copy .env.example to .env.local and fill in your Firebase Spark project credentials.
4. Run npm run dev and open http://localhost:3000

Testing Wildcard Subdomains Locally & on Vercel
- Native subdomain host: http://cyberpulse.localhost:3000 or https://hacker.myfa.page/top-hack-now
- Query preview override: http://localhost:3000/?preview_sub=hacker&preview_slug=top-hack-now

Deploying to Vercel with myfa.page and *.myfa.page
1. Push this project to a GitHub repository and import it into Vercel (Hobby Free Tier).
2. Add your NEXT_PUBLIC_FIREBASE_* variables inside Vercel Project Settings -> Environment Variables.
3. In Vercel Project Settings -> Domains, add both:
   - myfa.page
   - *.myfa.page
4. At your domain registrar for myfa.page, set your Nameservers to:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
5. Paste the included firestore.rules file into your Firebase Console -> Firestore Database -> Rules tab and click Publish.
