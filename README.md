# BlogSpace — Blog Platform with Comments

MERN full-stack blog platform for Task 4.

Features:
- User registration, login and JWT authentication
- Create, edit and delete blog posts
- Post search and categories
- Comments with ownership-based deletion
- REST APIs
- MongoDB + Mongoose
- Responsive React UI

## Setup

Backend:
```bash
cd server
npm install
```
Create `server/.env`:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/blogspace
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5176
```
If no local MongoDB is running, the backend will automatically use an in-memory MongoDB instance for local development.

Run:
```bash
npm run dev
```

Frontend:
```bash
cd client
npm install
```
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```
Run:
```bash
npm run dev
```
Open http://localhost:5176

API:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id
- POST /api/posts/:id/comments
- DELETE /api/comments/:id
