# LifeLink - Interactive Blood Bank Management System

A premium, full-stack MERN application designed to streamline blood donation, inventory management, and emergency response.

**✨ Zero-Config Setup**: This project uses **SQLite** for the database, so you **do not** need to install or configure MySQL. It works out-of-the-box!

---

## 🚀 Quick Start (Fresh Clone)

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/YourUsername/Blood-Bank-Management-System.git
    cd Blood-Bank-Management-System
    ```

2.  **Install Dependencies** (Root, Server, and Client):
    ```bash
    # Install server dependencies
    cd server
    npm install
    
    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Setup Environment** (Server):
    Create a `.env` file in the `server` folder (optional, defaults are provided):
    ```env
    JWT_SECRET=your_super_secret_key_here
    ```

4.  **Start the System**:
    Go back to the root or `server` folder and run:
    ```bash
    # In server terminal
    cd server
    node index.js
    ```
    *The server will verify/create the `bloodbank.db` file automatically on start.*

    ```bash
    # In client terminal
    cd client
    npm run dev
    ```

---

## 🛠️ Troubleshooting

### "Internal Server Error" on Login?
-   **Check the Console**: Look at the terminal running `node index.js`. It will print the exact error.
-   **Database Permissions**: Ensure the `server` directory is writable. The app needs to create/write to `bloodbank.db`.
-   **Dependencies**: Ensure `bcryptjs` and `sqlite3` are installed (`npm install` in server).
-   **Re-seed**: If the database seems corrupt, delete `bloodbank.db` from the `server` folder and restart the server. It will recreate it with fresh seed data.

### Frontend can't connect?
-   Ensure backend is running on Port 3000.
-   Check `client/src/pages/Login.jsx` is pointing to `http://localhost:3000`.

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
