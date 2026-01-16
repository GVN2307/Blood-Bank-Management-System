# LifeLink - Interactive Blood Bank Management System

A premium, full-stack MERN application designed to streamline blood donation, inventory management, and emergency response.

**✨ Zero-Config Setup**: This project uses **SQLite** for the database, so you **do not** need to install or configure MySQL. It works out-of-the-box!

---

## 🚀 Quick Start (Recommended)

1.  **Clone the repository** (if you haven't already).
2.  **Open the root folder** in your terminal.
3.  **Run ONE command**:
    ```bash
    npm run dev
    ```

    *This command will install all dependencies, set up the database automatically, and launch both the backend (port 3000) and frontend (port 5173).*

---

## 🌟 Key Features

### 1. User (Citizen) View
- **Dashboard**: personalized hub for donors.
- **Medical Reports**: Knowledge base for blood/urine tests.
- **Test Scheduling**: Book lab tests with nearby hospitals.
- **Community**: Donor Leaderboards and Success Stories.

### 2. Blood Bank View
- **Inventory: Live visual grid for blood stock.
- **Emergency Response**: Real-time alerts with simulated drone tracking.
- **Analytics**: Mock reports for collection/distribution.

### 3. Hospital View
- **Console**: Map showing nearby blood banks.
- **SOS Broadcast**: Instant emergency request system.
- **Patient Management**: Track patient requirements.

### 4. Admin View
- **System Overview**: High-level statistics.
- **User Management**: Manage enrolled entities.

---

## 🔐 Demo Credentials

Use these credentials to login:

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
├── client/         # React Frontend
├── server/         # Node.js Backend & SQLite DB
├── package.json    # Unified start script
└── README.md       # This file
```
