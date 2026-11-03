# Rakesh Godumala — Developer Portfolio

[![Live Portfolio](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://frontend-seven-lac-lb0bxqv4ae.vercel.app/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

A modern, responsive developer portfolio engineered with **React 19, Vite, and Bootstrap 5**, featuring a password-protected **Node.js/Express & MongoDB** admin dashboard for managing projects, verified certifications, and contact messages.

🌐 **Live Website:** [https://frontend-seven-lac-lb0bxqv4ae.vercel.app/](https://frontend-seven-lac-lb0bxqv4ae.vercel.app/)

---

## 🌟 Highlights & Features

### 🖥️ Public Portfolio
- **Hero Banner:** Dynamic typewriter role animation and executive signature styling.
- **Sticky Stacking Timeline:** Modern sticky-card experience for internships inspired by award-winning product sites (Linear/Ohm).
- **Interactive Certifications:** Direct credential links (Microsoft Azure, IBM SkillsBuild, Udemy, Cognitive Class, Coursera) opening directly in a new tab.
- **Projects Catalog:** Category filtering (Full Stack, React, Web Apps) with screenshot modals and GitHub/live demo links.
- **Theme Switcher:** Seamless Light & Dark mode support.
- **Mobile Optimized:** LAN host networking enabled for mobile device previews.

### 🔐 Admin Dashboard (`/admin/login`)
- Full CRUD operations for projects with image upload support.
- Manage certification credentials and display ordering.
- Read and manage incoming visitor contact messages.
- Secure session handling with HttpOnly cookies, CSRF protection, and rate limiting.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 19, JavaScript (ES6+), Vite, Bootstrap 5, React Icons, CSS Design Tokens |
| **Backend** | Node.js, Express 5, Mongoose 9, REST APIs |
| **Database** | MongoDB (Local & Atlas Cloud) |
| **Hosting & Cloud** | Vercel (Frontend), Render (Backend), Cloudinary (Media) |

---

## 📁 Project Architecture

```
MyPortfolio/
├── frontend/                # React 19 + Vite + Bootstrap 5
│   ├── public/              # Static assets & PDF resume
│   └── src/
│       ├── components/      # Reusable UI components & animations
│       ├── sections/        # Hero, About, Skills, Experience, Projects, Education, Certifications
│       ├── admin/           # Admin dashboard & management interfaces
│       ├── data/            # Static profile, fallback projects & certifications
│       └── styles/          # Design tokens (light/dark) & global stylesheets
└── backend/                 # Express 5 + Mongoose 9
    ├── config/              # Database & environment configurations
    ├── controllers/         # Business logic for auth, projects, certs, messages
    ├── models/              # Mongoose database schemas
    ├── routes/              # Public & protected admin API routes
    └── scripts/             # Admin creation & database seeding utilities
```

---

## 🚀 Quick Start (Local Setup)

```bash
# 1. Clone repository
git clone https://github.com/Rakeshgodumala/MyPortfolio.git
cd MyPortfolio

# 2. Run Frontend
cd frontend
npm install
npm run dev

# 3. Run Backend (optional, in second terminal)
cd ../backend
npm install
cp .env.example .env
npm run dev
```

---

## 📬 Connect with Me

- **Portfolio:** [rakeshgodumala.vercel.app](https://frontend-seven-lac-lb0bxqv4ae.vercel.app/)
- **LinkedIn:** [linkedin.com/in/rakesh-godumala](https://www.linkedin.com/in/rakesh-godumala-8b27371b6/)
- **GitHub:** [github.com/Rakeshgodumala](https://github.com/Rakeshgodumala)
- **LeetCode:** [leetcode.com/u/rakeshgodumala](https://leetcode.com/u/rakeshgodumala/)
- **Email:** [rakeshgodumala22@gmail.com](mailto:rakeshgodumala22@gmail.com)
