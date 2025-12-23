# DocBook Backend - Node.js + MySQL

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure MySQL Database

#### Option A: Using MySQL Command Line
```bash
mysql -u root -p
```
Then run the schema file:
```sql
source config/db_schema.sql
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `config/db_schema.sql`
4. Execute the script

### 3. Configure Environment Variables
Update `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=docbook_db
DB_PORT=3306
PORT=5000
JWT_SECRET=your_secret_key
```

### 4. Start the Server
```bash
npm start
# Or for development with auto-restart
npm run dev
```

Server will run on: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register Patient

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review status

### Contacts
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create contact

### Slots
- `GET /api/slots` - Get all slots
- `POST /api/slots` - Create slot
- `PUT /api/slots/:id` - Update slot availability

## Frontend Integration

Update your React app's `.env` file:
```env
VITE_BASE_URL=http://localhost:5000/api
```

## Default Admin Credentials
- Email: admin@docbook.com
- Password: admin123
