# CareerTrack – Student Placement Readiness

A separate UI variation of the Placement Skill Monitoring project. It keeps the same core features and REST API while using a teal-and-coral visual theme.

## Features
- Dashboard summary: total students, placement-ready students, and in-progress students
- Add student skill assessments
- Search and view student records
- Edit and delete student records
- Technical skills, aptitude score, communication score, and placement status
- Express REST API with MongoDB/Mongoose persistence

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas

## Backend setup
1. Open a terminal in `server`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set `MONGO_URI` to your MongoDB connection string.
5. Run `npm run dev`.

Backend runs on `http://localhost:5000`.

## Frontend setup
1. Open another terminal in `client`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

The frontend API URL can be changed with `VITE_API_URL`, for example `http://localhost:5000/api`.

## Important
- Do not upload your real `.env` file or MongoDB password to GitHub.
- GitHub Pages can host the frontend only. Deploy the Express backend separately and set `VITE_API_URL` to the deployed backend URL before building for production.
