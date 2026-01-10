# 📦 DocBook - Installation Guide for New Users

This guide will help you set up the DocBook project on a new computer from scratch.

## 📋 What You'll Need Before Starting

### Required Software (Download These First)

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Click "Download" and choose LTS version
   - Install with default settings

2. **MySQL** (v8 or higher)
   - Download: https://dev.mysql.com/downloads/installer/
   - Choose "MySQL Installer for Windows"
   - During installation, set a root password (remember this!)

3. **Visual Studio Code** (Optional but Recommended)
   - Download: https://code.visualstudio.com/
   - Best code editor for this project

4. **Git** (Optional - if cloning from GitHub)
   - Download: https://git-scm.com/

---

## 🚀 Step-by-Step Installation (For Receiver)

### Step 1: Get the Project Files

**Option A: If you received a ZIP file**
```
1. Extract the ZIP file to a location like: D:\DocBook---Nearby-Doctor-Appointment
2. Make sure all folders (backend, react_practical) are present
```

**Option B: If you're cloning from GitHub**
```bash
git clone <repository-url>
cd DocBook---Nearby-Doctor-Appointment
```

### Step 2: Verify You Have All Files

Your project folder should have:
```
DocBook---Nearby-Doctor-Appointment/
├── backend/
│   ├── config/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── react_practical/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### Step 3: Setup MySQL Database

**3.1 Open MySQL Command Line**
- Windows: Search "MySQL Command Line Client" in Start Menu
- Enter your MySQL root password

**3.2 Create Database**
```sql
CREATE DATABASE docbook_db;
USE docbook_db;
```

**3.3 Import Database Schema**

**Option A: Using Command Line**
```bash
# Open Command Prompt in project folder
cd D:\DocBook---Nearby-Doctor-Appointment\backend\config
mysql -u root -p docbook_db < db_schema.sql
# Enter your MySQL password when prompted
```

**Option B: Using MySQL Workbench**
```
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Go to: File > Run SQL Script
4. Select: backend/config/db_schema.sql
5. Click "Run"
```

**3.4 Verify Tables Created**
```sql
USE docbook_db;
SHOW TABLES;
-- You should see: patients, doctors, appointments, slots, reviews, contacts, prescriptions, payments
```

### Step 4: Setup Backend

**4.1 Navigate to Backend Folder**
```bash
cd D:\DocBook---Nearby-Doctor-Appointment\backend
```

**4.2 Install Dependencies**
```bash
npm install
```
This will install all required packages. Wait for it to complete (may take 2-3 minutes).

**4.3 Create Environment File**

Create a file named `.env` in the `backend` folder with this content:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=docbook_db
DB_PORT=3306

# CORS Origins
CORS_ORIGIN=http://localhost:7777
```

**⚠️ IMPORTANT:** Replace `your_mysql_password_here` with your actual MySQL password!

### Step 5: Setup Frontend

**5.1 Navigate to Frontend Folder**
```bash
cd D:\DocBook---Nearby-Doctor-Appointment\react_practical
```

**5.2 Install Dependencies**
```bash
npm install
```
This will install all React packages. Wait for it to complete (may take 5-7 minutes).

**5.3 Create Environment File**

Create a file named `.env` in the `react_practical` folder with this content:

```env
# Backend API URL
VITE_BASE_URL=http://localhost:5001/api

# Cloudinary Configuration (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=dhrumil7
VITE_CLOUDINARY_UPLOAD_PRESET=DocBook

# Razorpay Configuration (for payments) - Optional
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

### Step 6: Start the Application

**6.1 Start Backend Server**

Open **Command Prompt 1** (or Terminal 1):
```bash
cd D:\DocBook---Nearby-Doctor-Appointment\backend
npm start
```

You should see:
```
🚀 Starting DocBook Backend Server...
🗄️ Database connected successfully
🌐 Server running on port 5001
```

**✅ Keep this terminal window open!**

**6.2 Start Frontend Server**

Open **Command Prompt 2** (or Terminal 2) - NEW WINDOW:
```bash
cd D:\DocBook---Nearby-Doctor-Appointment\react_practical
npm run dev
```

You should see:
```
VITE ready in 500ms
➜  Local:   http://localhost:7777/
```

**✅ Keep this terminal window open too!**

### Step 7: Access the Application

Open your browser and go to:
```
http://localhost:7777
```

You should see the DocBook homepage! 🎉

---

## 🎯 Quick Test Checklist

After installation, test these:

- [ ] Homepage loads successfully
- [ ] Can navigate to "Find Doctor" page
- [ ] Can navigate to "Register" page
- [ ] Can view "About" page
- [ ] No console errors in browser (Press F12 to check)

---

## 🔐 Creating Your First Users

### Create Admin User

**Method 1: Direct Database Insert**
```sql
USE docbook_db;

INSERT INTO patients (username, email, password, phone, gender, age, is_admin, created_at)
VALUES (
    'Admin User',
    'admin@docbook.com',
    '$2a$10$xVGXqyHVz1C5gzX8qX8qXe8qXe8qXe8qXe8qXe8qXe8qXe8qXe8qX',
    '9876543210',
    'Male',
    30,
    1,
    NOW()
);
```

Then set a password by using the "Forgot Password" feature or update it manually.

**Method 2: Register and Update**
1. Register a new patient account
2. Go to MySQL and run:
```sql
UPDATE patients SET is_admin = 1 WHERE email = 'your_email@example.com';
```

### Register as Doctor

1. Go to: http://localhost:7777/doctorreg
2. Fill all details carefully
3. Upload required documents
4. Submit registration
5. Login as admin to approve the doctor

### Register as Patient

1. Go to: http://localhost:7777/register
2. Fill registration form
3. Login immediately after registration

---

## 📤 How to Share This Project

### For the Sender (Person Sharing the Project)

**Method 1: Create ZIP File (Recommended)**

**Step 1: Clean the Project**
```bash
# Delete node_modules from backend
cd backend
rmdir /s /q node_modules

# Delete node_modules from frontend
cd ..\react_practical
rmdir /s /q node_modules
```

**Step 2: Remove Sensitive Files**
- Delete `backend/.env` (they'll create their own)
- Delete `react_practical/.env` (they'll create their own)

**Step 3: Create ZIP**
- Right-click on `DocBook---Nearby-Doctor-Appointment` folder
- Send to > Compressed (zipped) folder
- This will be much smaller now (without node_modules)

**Step 4: Share**
- Upload to Google Drive / Dropbox / OneDrive
- Send link to receiver
- Share this INSTALLATION_GUIDE.md file

**Method 2: GitHub Repository (Best for Teams)**

```bash
# Initialize git (if not already)
cd D:\DocBook---Nearby-Doctor-Appointment
git init

# Create .gitignore file
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo dist/ >> .gitignore

# Commit files
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin <your-github-repo-url>
git push -u origin main
```

Then share the GitHub repository link.

**⚠️ IMPORTANT: Never share `.env` files with passwords!**

---

## 🛠️ Common Issues and Solutions

### Issue 1: "npm is not recognized"
**Solution:**
- Node.js not installed properly
- Restart computer after installing Node.js
- Verify: Open CMD and type `node --version`

### Issue 2: "Cannot connect to MySQL"
**Solution:**
- Check if MySQL service is running
- Windows: Services > MySQL > Start
- Verify password in `backend/.env`
- Ensure database `docbook_db` exists

### Issue 3: "Port 5001 is already in use"
**Solution:**
```bash
# Find what's using the port
netstat -ano | findstr :5001

# Kill the process (replace PID with actual number)
taskkill /PID <process_id> /F

# Or change port in backend/.env
PORT=5002
```

### Issue 4: "Port 7777 is already in use"
**Solution:**
```bash
# Change port in vite.config.js
server: {
  port: 7778
}
```

### Issue 5: Backend shows "Database connection failed"
**Solution:**
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists: `CREATE DATABASE docbook_db;`
- Check if port 3306 is open

### Issue 6: Images not uploading
**Solution:**
- Using Cloudinary credentials in frontend `.env`
- Check internet connection
- Verify Cloudinary account is active

### Issue 7: "Module not found" errors
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 8: Frontend shows blank page
**Solution:**
- Check browser console (F12) for errors
- Verify backend is running on port 5001
- Check `VITE_BASE_URL` in frontend `.env`
- Clear browser cache

---

## 📱 Access URLs

Once everything is running:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:7777 | Main application |
| Backend API | http://localhost:5001/api | REST API endpoints |
| Admin Panel | http://localhost:7777/admin | Admin dashboard |
| Doctor Panel | http://localhost:7777/doctor | Doctor dashboard |

---

## 🔄 Stopping the Application

**Stop Backend:**
- Go to backend terminal
- Press `Ctrl + C`
- Type `Y` and press Enter

**Stop Frontend:**
- Go to frontend terminal
- Press `Ctrl + C`
- Type `Y` and press Enter

---

## 🔄 Restarting the Application

Next time you want to run the project:

**Terminal 1 (Backend):**
```bash
cd D:\DocBook---Nearby-Doctor-Appointment\backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd D:\DocBook---Nearby-Doctor-Appointment\react_practical
npm run dev
```

No need to run `npm install` again unless you add new packages.

---

## 💾 Project File Sizes

**With node_modules (before cleanup):** ~500-700 MB
**Without node_modules (after cleanup):** ~5-10 MB

Always remove node_modules before sharing!

---

## 📞 Need Help?

If you face any issues:

1. Check this troubleshooting guide
2. Verify all software versions
3. Ensure all environment files are correct
4. Check if both servers are running
5. Look at terminal/console for error messages

---

## ✅ Installation Complete!

Once you see:
- ✅ Backend running without errors
- ✅ Frontend loads in browser
- ✅ Can navigate between pages
- ✅ Database tables created

**You're all set! Start using DocBook! 🎉**

---

**Made with ❤️ by DocBook Team**
