# My Word Marketplace 🛒

A complete multi-store marketplace platform for Algeria with mobile app (customer + driver), web admin dashboard, and backend API.

## 🌟 Features

### For Customers
- Browse stores by category (Gym, Clothing, Perfumes, Equipment, etc.)
- View products and add to cart
- Cash on delivery payment
- Real-time order tracking
- Multi-language support (Arabic, French, English)

### For Drivers
- Accept delivery requests
- Navigate to stores and customers
- Manage delivery status
- Cash collection & settlement

### For Admins
- Dashboard with analytics
- Store management
- Order tracking
- Commission management

---

## 🏗️ Project Structure

```
prime-cassini/
├── backend/                 # Node.js/Express API
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication (JWT)
│   │   ├── stores.js        # Store management
│   │   ├── products.js      # Product CRUD
│   │   ├── categories.js    # Categories
│   │   ├── orders.js        # Order processing
│   │   ├── delivery.js      # Driver management
│   │   └── notifications.js # Push notifications
│   ├── schema.sql           # Database schema
│   ├── seeds.sql            # Initial data
│   └── Dockerfile
│
├── my-word-app/             # Flutter Mobile App
│   ├── lib/
│   │   ├── main.dart        # App entry point
│   │   ├── screens/         # UI screens
│   │   ├── services/        # API & localization
│   │   └── widgets/         # Reusable components
│   ├── assets/i18n/         # Translations (ar, en, fr)
│   └── pubspec.yaml
│
├── web-admin/               # Next.js Admin Dashboard
│   ├── src/
│   │   ├── app/admin/       # Admin pages
│   │   ├── components/      # UI components
│   │   └── lib/             # Utilities & translations
│   └── Dockerfile
│
├── nginx/                   # Reverse proxy config
├── docker-compose.yml       # Container orchestration
├── deploy.sh                # Deployment script
└── .env.example             # Environment template
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Flutter 3.0+
- Docker (optional)

### Development Setup

```bash
# 1. Clone and setup environment
cp .env.example .env
# Edit .env with your database credentials

# 2. Start database
docker-compose up postgres -d

# 3. Run backend
cd backend
npm install
node index.js

# 4. Run web admin
cd web-admin
npm install
npm run dev

# 5. Run mobile app
cd my-word-app
flutter pub get
flutter run
```

### Production Deployment

```bash
./deploy.sh prod
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/stores` | List stores | ❌ |
| GET | `/api/stores/:id` | Store details | ❌ |
| GET | `/api/products` | List products | ❌ |
| GET | `/api/categories` | List categories | ❌ |
| POST | `/api/orders` | Create order | ✅ |
| GET | `/api/delivery/available` | Available deliveries | ✅ |
| POST | `/api/delivery/accept` | Accept delivery | ✅ |

---

## 🌐 Multi-Language Support

| Code | Language | RTL |
|------|----------|-----|
| `ar` | العربية (Arabic) | ✅ |
| `en` | English | ❌ |
| `fr` | Français | ❌ |

---

## 💰 Commission System

- Default rate: **10%**
- Auto-calculated on each order
- Tracked in admin dashboard
- Driver collects cash → pays store (minus commission)

---

## 🔒 Security

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting (nginx)
- CORS protection

---

## 📱 Mobile App Screens

1. **Splash** - App loading
2. **Home** - Offers, services, categories
3. **Stores** - Store listing with search
4. **Store Details** - Products & add to cart
5. **Cart** - Review & checkout
6. **Map** - Store locations
7. **Profile** - Settings & driver mode
8. **Driver Dashboard** - Order acceptance

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js, Express, PostgreSQL |
| Mobile | Flutter, Dart |
| Web Admin | Next.js, TypeScript, Tailwind |
| Database | PostgreSQL 15 |
| Container | Docker, Docker Compose |
| Proxy | Nginx |

---

## 📞 Support

For questions or issues, please contact the development team.

---

**Made with ❤️ for Algeria**
