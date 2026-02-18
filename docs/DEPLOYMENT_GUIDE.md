# My Word Marketplace - Deployment Guide

## 1. Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04 LTS or newer
- **CPU**: 2 vCPU minimum
- **RAM**: 4GB minimum
- **Storage**: 20GB SSD
- **Tools**: Docker & Docker Compose

### Accounts Needed
- **Domain Name** (e.g., myword.dz)
- **Google Cloud Platform** (for Maps API)
- **Firebase Project** (for Notification)
- **Apple Developer Account** (for iOS App Store)
- **Google Play Console** (for Android Play Store)

---

## 2. Server Setup

### Step 1: Install Docker
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
```

### Step 2: Clone Repository
```bash
git clone https://github.com/your-repo/prime-cassini.git
cd prime-cassini
```

### Step 3: Configure Environment
Copy the example environment file and fill in your secrets.
```bash
cp .env.example .env
nano .env
```
**Critical Variables:**
- `JWT_SECRET`: Generate a strong random string
- `DB_PASSWORD`: Set a strong database password
- `GOOGLE_MAPS_API_KEY`: Your key from GCP
- `FIREBASE_*`: Your credentials from Firebase Console

---

## 3. Deployment with Docker

### Build and Run
Use the provided `deploy.sh` script or run manually:
```bash
# Make script executable
chmod +x deploy.sh

# Run production deployment
./deploy.sh prod
```

Or manually:
```bash
docker-compose down
docker-compose up -d --build
```

### Verify Status
```bash
docker-compose ps
```
Should show:
- `postgres`: Up (Port 5432)
- `backend`: Up (Port 3001)
- `web-admin`: Up (Port 3000)
- `nginx`: Up (Port 80/443)

---

## 4. SSL Configuration (HTTPS)

### Step 1: Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### Step 2: Obtain Certificate
```bash
sudo certbot --nginx -d myword.dz -d api.myword.dz -d admin.myword.dz
```

### Step 3: Update Nginx
Ensure `nginx/nginx.conf` points to the new certificates.

---

## 5. Mobile App Release

### Android (Play Store)
1. **Update Version**: Check `pubspec.yaml` version.
2. **Sign App**: Create a keystore.
   ```bash
   keytool -genkey -v -keystore key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key
   ```
3. **Build Bundle**:
   ```bash
   cd my-word-app
   flutter build appbundle
   ```
4. **Upload**: Upload `app-release.aab` to Play Console.

### iOS (App Store)
1. **Open Xcode**:
   ```bash
   cd my-word-app/ios
   open Runner.xcworkspace
   ```
2. **Configure Signing**: Select your Team in "Signing & Capabilities".
3. **Archive**: Product -> Archive.
4. **Distribute**: Upload to App Store Connect.

---

## 6. Maintenance

### Backup Database
```bash
# Automatic daily backup recommended
docker exec postgres pg_dump -U postgres myword > backup_$(date +%F).sql
```

### View Logs
```bash
docker-compose logs -f backend
```

### Update Application
```bash
git pull origin main
./deploy.sh prod
```
