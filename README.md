# GarageGo

Book, track and manage your vehicle service online.

**Live site:** https://garagego-frontend.netlify.app

## Features
- Customers: sign up, add cars, book a service and track its status
- Admin: manage the service catalog, see all requests, update their status and set an estimated completion
- Email notifications when a request's status changes
- Forgot password with an emailed reset link

## Tech stack
React + Vite (frontend), Django REST Framework (backend). Hosted on Netlify and PythonAnywhere.

Backend repository: https://github.com/Vahini-123/garagego-backend

The backend runs on a free plan, so login and booking may be unavailable for a short time if it hasn't been renewed.

## Run locally
```
npm install
npm run dev
```
Set `VITE_API_URL` in a `.env` file (see `.env.example`) if your backend isn't at `http://localhost:8000/api`.
