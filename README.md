# LifeLink - Interactive Blood Bank Management System

A premium, full-stack MERN application designed to streamline blood donation, inventory management, and emergency response between Citizens, Hospitals, and Blood Banks.

## 🌟 Key Features

### 1. User (Citizen) View
- **Dashboard**: personalized hub for donors.
- **Medical Reports**: Detailed knowledge base for blood and urine tests with normal ranges and interpretations.
- **Test Scheduling**: Interactive interface to book lab tests with nearby hospitals.
- **Community**: Donor Leaderboards (Gold/Silver/Bronze badges) and Success Stories.

### 2. Blood Bank View
- **Inventory Control**: Live visual grid for managing blood stock levels.
- **Emergency Response**: Real-time alerts for incoming blood requests with simulated drone tracking.
- **Analytics**: Reports for annual/monthly collection and distribution.
- **Event Management**: Tools to organize and broadcast donation camps.

### 3. Hospital View
- **Command Console**: Interactive Map showing nearby blood banks.
- **SOS Broadcast**: Instant emergency request system to all connected blood banks.
- **Patient Management**: Track patient requirements and critical status.
- **Annual Needs**: Monitoring tools for projected vs. current blood availability.

### 4. Admin View
- **System Overview**: High-level statistics on users, total blood units, and request fulfillment.
- **User Management**: Full control to manage enrolled Hospitals, Blood Banks, and Users.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), CSS Modules (Premium Glassmorphism UI), React Router, Leaflet Maps.
- **Backend**: Node.js, Express.js, Socket.io (Real-time updates).
- **Database**: MySQL (Relational data for users, inventory, requests).
- **Tools**: Git, npm.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js installed.
- MySQL installed and running.

### 1. Database Setup
1. Open your MySQL client (Workbench, CLI, etc.).
2. Create a database named `blood_bank` (or match your config).
3. Import the `server/schema.sql` file to create the necessary tables and seed initial data.

### 2. Backend Setup
```bash
cd server
npm install
# Ensure your db.js credentials match your local MySQL setup
node index.js
# Server runs on http://localhost:3000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
# Application runs on http://localhost:5173
```

---

## 🔐 Demo Credentials

Use these credentials to explore the different user roles:

| Role | Email | Password |
|------|-------|----------|
| **User (Citizen)** | `ravi@gmail.com` | `password123` |
| **Blood Bank** | `redcross@gmail.com` | `password123` |
| **Hospital** | `admin@nims.edu.in` | `password123` |
| **Admin** | `admin@lifelink.com` | `admin123` |

---

## 📂 Project Structure

```
/
├── client/         # React Frontend Application
├── server/         # Node.js/Express Backend API
└── README.md       # Project Documentation
```

---

## ✨ UI/UX Highlights
- **Glassmorphism Design**: Modern, translucent UI elements.
- **Real-time Updates**: Socket.io for instant emergency notifications.
- **Interactive Maps**: Leaflet integration for location services.
