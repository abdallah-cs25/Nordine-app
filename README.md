# My Word Marketplace 🛒

A complete multi-store marketplace platform for Algeria with mobile app (customer + driver), web admin dashboard, and backend API.

---

## 🖥️ How to Run Locally on Your Desktop

### Prerequisites

Make sure you have the following installed on your machine:

| Tool           | Version  | Download Link                                           |
|----------------|----------|---------------------------------------------------------|
| **Node.js**    | 18+      | https://nodejs.org/                                      |
| **PostgreSQL** | 15+      | https://www.postgresql.org/download/                     |
| **Flutter**    | 3.0+     | https://docs.flutter.dev/get-started/install             |
| **Git**        | any      | https://git-scm.com/                                     |
| **Android Studio** | latest | https://developer.android.com/studio (for mobile emulator) |

---

### Step 1: Set Up the Database (PostgreSQL)

Open a terminal and run:

```bash
# 1. Start PostgreSQL (if not already running)
sudo systemctl start postgresql

# 2. Create the database and user
sudo -u postgres psql -c "CREATE USER myword_admin WITH PASSWORD 'securepassword123';"
sudo -u postgres psql -c "CREATE DATABASE myword_marketplace OWNER myword_admin;"

# 3. Import the database schema and seed data
sudo -u postgres psql -d myword_marketplace -f backend/schema.sql
sudo -u postgres psql -d myword_marketplace -f backend/seeds.sql
```

> **Note:** If you already created the database before, you can skip this step.

---

### Step 2: Start the Backend API

Open **Terminal 1**:

```bash
cd backend
npm install
node index.js
```

You should see:
```
My Word API running on port 3001
Connected to PostgreSQL database
```

✅ **Backend is now running at:** http://localhost:3001  
✅ **Test it:** Open http://localhost:3001/health in your browser

---

### Step 3: Start the Web Admin Dashboard

Open **Terminal 2**:

```bash
cd web-admin
npm install
npm run dev
```

You should see:
```
▲ Next.js 16.1.6 (Turbopack)
- Local: http://localhost:3000
✓ Ready in ~1s
```

✅ **Web Admin is now running at:** http://localhost:3000  

Pages available:
- http://localhost:3000 → Landing page
- http://localhost:3000/admin → Admin dashboard
- http://localhost:3000/seller → Seller dashboard

---

### Step 4: Run the Mobile App (Flutter)

Open **Terminal 3**:

```bash
cd my-word-app
flutter pub get
flutter run
```

#### Important: Configure the API URL for Mobile

The mobile app connects to the backend API. Before running, update the IP address in:

📄 `my-word-app/lib/services/api_service.dart` (line 5)

```dart
static const String baseUrl = 'http://<YOUR_PC_IP>:3001/api';
```

**How to find your PC's IP address:**
```bash
# Linux
hostname -I | awk '{print $1}'

# Or look for the IP in
ip addr show
```

> **Why not `localhost`?** The mobile emulator/device runs on a separate network.  
> Use your local IP (e.g., `192.168.1.14`) so the phone can reach the backend.  
> For Android emulator specifically, you can also use `10.0.2.2` instead of your IP.

#### Running on Different Devices

| Target               | Command                        |
|----------------------|--------------------------------|
| Android Emulator     | `flutter run` (with emulator open) |
| Physical Android     | Connect via USB + `flutter run` |
| Chrome (web preview) | `flutter run -d chrome`        |
| iOS Simulator (Mac)  | `flutter run` (with Xcode)     |

---

## 📁 Project Structure

```
my-word-marketplace/
├── backend/                 # Node.js/Express API (port 3001)
│   ├── routes/              # API routes (auth, stores, products, orders, etc.)
│   ├── schema.sql           # Database tables
│   ├── seeds.sql            # Sample data
│   ├── .env                 # Environment config
│   └── index.js             # Server entry point
│
├── my-word-app/             # Flutter Mobile App
│   ├── lib/
│   │   ├── main.dart        # App entry point
│   │   ├── screens/         # UI screens
│   │   ├── services/        # API service & localization
│   │   └── widgets/         # Reusable components
│   ├── assets/i18n/         # Translations (ar, en, fr)
│   └── pubspec.yaml
│
├── web-admin/               # Next.js Admin Dashboard (port 3000)
│   ├── src/app/admin/       # Admin pages
│   ├── src/app/seller/      # Seller pages
│   └── src/components/      # UI components
│
├── docker-compose.yml       # Optional: run everything in containers
└── deploy.sh                # Optional: deployment script
```

---

## ⚙️ Environment Configuration

The backend uses a `.env` file at `backend/.env`:

```env
# Database connection
DATABASE_URL=postgresql://myword_admin:securepassword123@localhost:5432/myword_marketplace

# JWT secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server port
PORT=3001

# Admin credentials (for first login)
ADMIN_EMAIL=admin@myword.dz
ADMIN_PASSWORD=password123
```

> Edit `backend/.env` if your PostgreSQL username, password, or database name is different.

---

## 📡 API Endpoints

| Method | Endpoint                  | Description           | Auth |
|--------|---------------------------|-----------------------|------|
| POST   | `/api/auth/register`      | Register user         | ❌   |
| POST   | `/api/auth/login`         | Login                 | ❌   |
| GET    | `/api/stores`             | List stores           | ❌   |
| GET    | `/api/stores/:id`         | Store details         | ❌   |
| GET    | `/api/products`           | List products         | ❌   |
| GET    | `/api/categories`         | List categories       | ❌   |
| POST   | `/api/orders`             | Create order          | ✅   |
| GET    | `/api/delivery/available` | Available deliveries  | ✅   |
| POST   | `/api/delivery/accept`    | Accept delivery       | ✅   |

---

## 🌐 Multi-Language Support

| Code | Language          | RTL |
|------|-------------------|-----|
| `ar` | العربية (Arabic)  | ✅  |
| `en` | English           | ❌  |
| `fr` | Français          | ❌  |

---

## �️ Tech Stack

| Component  | Technology                      |
|------------|---------------------------------|
| Backend    | Node.js, Express, PostgreSQL    |
| Mobile     | Flutter, Dart                   |
| Web Admin  | Next.js, TypeScript, Tailwind   |
| Database   | PostgreSQL 15                   |
| Container  | Docker, Docker Compose (optional) |

---

## � Troubleshooting

### Backend won't start
- Make sure PostgreSQL is running: `sudo systemctl status postgresql`
- Check your `backend/.env` — does `DATABASE_URL` match your PostgreSQL credentials?
- Make sure the database exists: `sudo -u postgres psql -l` (look for `myword_marketplace`)

### Web Admin shows errors
- Make sure the backend is running on port 3001 first
- Run `npm install` if you see missing module errors

### Mobile app can't connect to API
- Make sure you updated the IP in `api_service.dart` to your actual PC IP
- Make sure the backend is running
- Make sure your phone/emulator is on the same WiFi network as your PC
- Try `http://10.0.2.2:3001/api` if using Android emulator

### Port already in use
```bash
# Find what's using the port
lsof -i :3001   # for backend
lsof -i :3000   # for web admin

# Kill it
kill -9 <PID>
```

---

## 📞 Support

For questions or issues, please contact the development team.

---

**Made with ❤️ for Algeria**
