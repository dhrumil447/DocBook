# 🏥 DocBook - Nearby Doctor Appointment System

A comprehensive healthcare appointment booking system built with React and Node.js that connects patients with nearby doctors.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)

## ✨ Features

### For Patients
- 🔍 Search and find nearby doctors by specialization and city
- 📅 Book appointments with available time slots
- ⭐ Rate and review doctors
- 📝 View appointment history
- 💳 Online payment via Razorpay or Pay on Counter
- 📧 Contact support

### For Doctors
- 👨‍⚕️ Professional registration with document verification
- 📊 Dashboard with appointment statistics
- 🕐 Set available time slots
- 👥 Manage patient appointments
- 💊 Write digital prescriptions
- 📈 View patient reviews

### For Admin
- 🎛️ Comprehensive admin dashboard
- ✅ Approve/reject doctor registrations
- 👁️ Monitor all appointments and payments
- 📊 View analytics and reports
- 📨 Manage contact messages
- ⭐ Moderate patient reviews

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18+ with Vite
- **UI Library:** React Bootstrap
- **Icons:** React Icons, Material UI Icons
- **Animations:** Framer Motion
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **PDF Generation:** jsPDF
- **Email Service:** EmailJS
- **Styling:** CSS3, Bootstrap 5

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** mysql2
- **Authentication:** bcryptjs
- **Environment:** dotenv
- **CORS:** cors

## 📁 Project Structure

```
DocBook---Nearby-Doctor-Appointment/
│
├── backend/                          # Backend Node.js application
│   ├── config/
│   │   ├── database.js              # Database connection
│   │   └── db_schema.sql            # Database schema
│   ├── routes/
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── slotRoutes.js
│   ├── server.js                    # Main server file
│   ├── package.json
│   └── .env                         # Environment variables
│
├── react_practical/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── Admin/                   # Admin panel components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ViewDoctor.jsx
│   │   │   ├── ViewPatient.jsx
│   │   │   ├── Viewapp.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── AdminReview.jsx
│   │   │   ├── AdminContactMessages.jsx
│   │   │   ├── EditDoctor.jsx
│   │   │   └── EditPatient.jsx
│   │   ├── Doctor/                  # Doctor panel components
│   │   │   ├── Doctorpanel.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── Drnavbar.jsx
│   │   │   ├── Drsidebar.jsx
│   │   │   ├── DrSetslot.jsx
│   │   │   ├── ViewAppointment.jsx
│   │   │   ├── DoctorPatients.jsx
│   │   │   ├── DoctorReview.jsx
│   │   │   └── Prescription.jsx
│   │   ├── components/              # Common components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── ContactUs.jsx
│   │   │   ├── Finddoctor.jsx
│   │   │   ├── DrProfile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Doctorreg.jsx
│   │   │   ├── login.jsx
│   │   │   ├── ForgotPasswordModal.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Myprofile.jsx
│   │   │   ├── EditPatientProfile.jsx
│   │   │   ├── Medicalreport.jsx
│   │   │   ├── SlotSelectionModal.jsx
│   │   │   └── Routing.jsx
│   │   ├── redux/                   # Redux store
│   │   │   ├── mystore.js
│   │   │   ├── patientSlice.js
│   │   │   └── doctorSlice.js
│   │   ├── utils/                   # Utility functions
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── constants.js
│   │   │   └── validation.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env                         # Environment variables
│
└── README.md                        # This file
```

## 📦 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DocBook---Nearby-Doctor-Appointment
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
# OR on Linux/Mac
cp .env.example .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../react_practical

# Install dependencies
npm install

# Create .env file
copy .env.example .env
# OR on Linux/Mac
cp .env.example .env
```

## 🗄️ Database Setup

### 1. Create Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE docbook_db;
USE docbook_db;
```

### 2. Import Schema

```bash
# From MySQL command line
mysql -u root -p docbook_db < backend/config/db_schema.sql

# OR execute the SQL file directly in MySQL Workbench
```

### 3. Verify Tables

```sql
SHOW TABLES;
-- Should show: patients, doctors, appointments, slots, reviews, contacts, prescriptions, payments
```

## ⚙️ Environment Variables

### Backend (.env)

Create `backend/.env` file with following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=docbook_db
DB_PORT=3306

# CORS Origins
CORS_ORIGIN=http://localhost:7777

# JWT Secret (Optional - for future authentication)
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend (.env)

Create `react_practical/.env` file with following variables:

```env
# Backend API URL
VITE_BASE_URL=http://localhost:5001/api

# Cloudinary Configuration (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Razorpay Configuration (for payments)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🏃‍♂️ Running the Application

### Method 1: Run Backend and Frontend Separately

#### Start Backend Server

```bash
# From backend directory
cd backend
npm start

# Server will start on http://localhost:5001
```

You should see:
```
🚀 Starting DocBook Backend Server...
✅ All routes imported successfully
🗄️ Database connected successfully
🌐 Server running on port 5001
```

#### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd react_practical
npm run dev

# Frontend will start on http://localhost:7777
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:7777/
➜  Network: use --host to expose
```

### Method 2: Run Both Simultaneously (Using Concurrently)

Add this to root `package.json`:

```json
{
  "scripts": {
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd react_practical && npm run dev",
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

Then run:
```bash
npm install
npm start
```

## 🌐 Accessing the Application

Once both servers are running:

- **Frontend:** http://localhost:7777
- **Backend API:** http://localhost:5001/api
- **Admin Panel:** http://localhost:7777/admin
- **Doctor Panel:** http://localhost:7777/doctor

## 👥 User Roles

### Default Credentials

After setting up the database, you can create users through the registration pages or manually insert admin credentials.

### Admin Access
1. Create an admin account by setting `is_admin = 1` in the `patients` table
2. Login at: http://localhost:7777/login
3. You'll be redirected to admin dashboard

### Doctor Access
1. Register at: http://localhost:7777/doctorreg
2. Wait for admin approval
3. Login at: http://localhost:7777/login
4. Access doctor panel

### Patient Access
1. Register at: http://localhost:7777/register
2. Login at: http://localhost:7777/login
3. Search and book appointments

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Register doctor
- `PUT /api/doctors/:id` - Update doctor
- `PATCH /api/doctors/:id` - Partially update doctor (status, verification)
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id` - Update appointment status
- `DELETE /api/appointments/:id` - Cancel appointment

### Slots
- `GET /api/slots` - Get all slots
- `POST /api/slots` - Create slot
- `PUT /api/slots/:id` - Update slot
- `DELETE /api/slots/:id` - Delete slot

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Add review
- `PATCH /api/reviews/:id` - Update review status
- `DELETE /api/reviews/:id` - Delete review

### Payments
- `GET /api/Payment` - Get all payments
- `POST /api/Payment` - Create payment
- `GET /api/Payment/:id` - Get payment by ID

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Contact
- `GET /api/contacts` - Get all contact messages
- `POST /api/contacts` - Submit contact message

## 🎨 Key Features Implemented

### UI/UX
- ✅ Modern gradient-based design system
- ✅ Icon-based professional interface
- ✅ Responsive design for all devices
- ✅ Smooth animations with Framer Motion
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling

### Security
- ✅ Password hashing with bcrypt
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ CORS configuration
- ✅ Secure file uploads to Cloudinary

### Functionality
- ✅ Real-time slot availability
- ✅ PDF report generation
- ✅ Email notifications
- ✅ Image upload for documents
- ✅ Payment integration
- ✅ Review and rating system
- ✅ Search and filter functionality

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find process using port 5001
netstat -ano | findstr :5001
# Kill the process
taskkill /PID <process_id> /F
```

**Database connection error:**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

**Module not found:**
```bash
cd backend
rm -rf node_modules
npm install
```

### Frontend Issues

**Port already in use:**
```bash
# Find process using port 7777
netstat -ano | findstr :7777
# Kill the process
taskkill /PID <process_id> /F
```

**Build errors:**
```bash
cd react_practical
rm -rf node_modules
npm install
```

**Environment variables not loading:**
- Ensure `.env` file exists
- Variables must start with `VITE_`
- Restart dev server after changes

## 📚 Additional Resources

### Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name and upload preset
3. Add to frontend `.env`

### Razorpay Setup
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get API keys from dashboard
3. Add to frontend `.env`

### EmailJS Setup
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create email service and template
3. Update credentials in `AdminContactMessages.jsx`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React Bootstrap for UI components
- Framer Motion for animations
- Material-UI for icons
- All open-source contributors

## 📞 Support

For support, email your.email@example.com or create an issue in the repository.

---

**Made with ❤️ using React & Node.js**
