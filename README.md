# LifeLink Blood Bank Management System

A premium, full-stack real-time blood bank management system for Telangana.

## Features
- **Real-time Location Tracking**: Integration with Leaflet Maps to show hospitals and blood banks.
- **Emergency Alerts**: Instant websocket-based broadcasts from Hospitals to Blood Banks.
- **Inventory Management**: Live blood stick tracking.
- **Premium UI**: Glassmorphism design, dark mode, and smooth animations.
- **Role-based Access**: Separate dashboards for Hospitals and Blood Banks.

## Tech Stack
- **Frontend**: React (Vite), Leaflet Maps, Vanilla CSS (Premium).
- **Backend**: Node.js, Express, Socket.io.
- **Database**: MySQL.

## Prerequisites
1. **Node.js**: Installed (v18+).
2. **MySQL**: Running locally or on a server.
   - Create a database named `blood_bank_db`.
   - Update `server/.env` or `server/db.js` with your credentials if they differ from default (root/blank).

## Setup & Running

1. **Database Setup**
   If you have MySQL installed and added to path:
   ```bash
   mysql -u root -p < server/schema.sql
   ```
   Or manually copy the contents of `server/schema.sql` and run in your MySQL workbench.

2. **Install Dependencies** (If not already done)
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Start the System**
   You need to run both Backend and Frontend.

   **Terminal 1 (Backend):**
   ```bash
   cd server
   node index.js
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd client
   npm run dev
   ```

4. **Access the App**
   Open http://localhost:5173

## default Login Credentials (from Seed Data)
- **Hospital**: `admin@nims.edu.in` / `password123`
- **Blood Bank**: `redcross@gmail.com` / `password123`

## Project Structure
- `client/`: React Frontend
- `server/`: Express Backend
