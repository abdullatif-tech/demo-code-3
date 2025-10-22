# Quick Setup Instructions - Day 3 (MySQL Version)

## Prerequisites Check

Before starting, verify you have:
- [ ] Node.js installed (run: `node --version`)
- [ ] MySQL installed with phpMyAdmin
- [ ] Postman installed
- [ ] Code editor (VS Code recommended)

---

## Installation Steps

### 1. Navigate to Project
```bash
cd demo-code-day3
```

### 2. Install Dependencies
```bash
npm install
```

Expected output:
```
added 50+ packages in 10s
```

### 3. Setup MySQL Database

#### Option A: Using phpMyAdmin (Recommended)
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "New" to create a database
3. Database name: `invoice_api`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

Alternatively, run the SQL schema file:
1. In phpMyAdmin, select the database
2. Click "Import"
3. Choose file: `database-schema.sql`
4. Click "Go"

#### Option B: Using MySQL Command Line
```bash
mysql -u root -p < database-schema.sql
```

Or manually:
```bash
mysql -u root -p
```

Then in MySQL prompt:
```sql
CREATE DATABASE invoice_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE invoice_api;
-- Tables will be created automatically by Sequelize
```

### 4. Create Environment File
```bash
# Copy the example file
cp .env.example .env

# Then edit .env with your preferred editor
nano .env  # or use VS Code
```

Required variables in `.env`:
```env
PORT=3000
NODE_ENV=development

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=invoice_api
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRES_IN=1h
```

⚠️ **Important:** 
- Change `DB_PASSWORD` to your MySQL root password
- Change `JWT_SECRET` to a secure random string!

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Verify MySQL is Running

**Check phpMyAdmin:**
- Visit: http://localhost/phpmyadmin
- You should see the login page
- Login with your MySQL credentials

**Or check MySQL service:**

**macOS:**
```bash
mysql.server status
# or
brew services list | grep mysql
```

**Windows:**
```bash
# Check if MySQL service is running
net start | findstr MySQL
```

**Linux:**
```bash
sudo systemctl status mysql
```

### 6. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Expected output:
```
✅ MySQL connection established successfully
✅ Database synchronized
📊 Database: invoice_api

🚀 ==========================================
🚀 Server running on port 3000
🚀 ==========================================

📍 Environment: development
💾 Database: MySQL (localhost:3306)
🔗 Local URL: http://localhost:3000
🏥 Health check: http://localhost:3000/health

📚 Available endpoints:
   POST   http://localhost:3000/api/auth/register
   POST   http://localhost:3000/api/auth/login
   GET    http://localhost:3000/api/auth/profile
   PUT    http://localhost:3000/api/auth/profile
   PUT    http://localhost:3000/api/auth/change-password

🎓 Day 3: API Authentication & Security (MySQL Version)

Press Ctrl+C to stop the server
```

---

## Testing

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-10-18T10:00:00.000Z",
  "environment": "development",
  "database": "MySQL",
  "version": "1.0.0"
}
```

### 2. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Mohamed",
    "email": "ahmed@libyatelecom.ly",
    "password": "Password123!",
    "role": "accountant",
    "department": "finance"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@libyatelecom.ly",
    "password": "Password123!"
  }'
```

Copy the `token` from the response!

### 4. Get Profile
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Verify in phpMyAdmin
1. Open phpMyAdmin
2. Select `invoice_api` database
3. Click on `users` table
4. You should see your registered user!

---

## Troubleshooting

### MySQL Connection Error
```
Error: Access denied for user 'root'@'localhost'
```

**Solution:**
1. Check your MySQL password in `.env` file
2. Verify MySQL is running
3. Try connecting via phpMyAdmin with the same credentials

### Database Not Found
```
Error: Unknown database 'invoice_api'
```

**Solution:**
```bash
# Create database manually
mysql -u root -p
CREATE DATABASE invoice_api;
```

Or use phpMyAdmin to create it.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change port in .env file
PORT=3001
```

### JWT Secret Error
```
FATAL ERROR: Missing required environment variables: JWT_SECRET
```

**Solution:**
Make sure `.env` file exists and has `JWT_SECRET` defined.

### Tables Not Created
```
Error: Table 'invoice_api.users' doesn't exist
```

**Solution:**
The tables should be created automatically by Sequelize. If not:
1. Make sure database exists
2. Check MySQL permissions
3. Run the SQL schema file manually
4. Restart the server

---

## Verify Everything Works

### Check Database Tables
In phpMyAdmin or MySQL command line:
```sql
USE invoice_api;
SHOW TABLES;
```

You should see:
- `users`
- `invoices`
- `invoice_items`
- `invoice_summary` (view)

### Check Table Structure
```sql
DESCRIBE users;
```

### Check Data
After registering a user:
```sql
SELECT id, name, email, role, department FROM users;
```

---

## Postman Setup

1. Open Postman
2. Create new Collection: "Invoice API - Day 3 (MySQL)"
3. Create Environment with variables:
   - `baseUrl` = `http://localhost:3000`
   - `token` = (empty, will be set by tests)
4. Import requests from `Invoice_API_Day3.postman_collection.json`

---

## What's Next?

After successful setup:
1. ✅ Test all auth endpoints in Postman
2. ✅ Verify data in phpMyAdmin
3. ✅ Try error scenarios
4. ✅ Review the code
5. ✅ Ask questions!

See **README_DAY3.md** for detailed API documentation.

---

## MySQL vs MongoDB Differences

### What Changed:
- ❌ Removed `mongoose`
- ✅ Added `mysql2` and `sequelize`
- ✅ Added `database.js` config
- ✅ Added `database-schema.sql`
- ✅ Updated models to use Sequelize
- ✅ Updated queries to use Sequelize methods

### What Stayed the Same:
- ✅ All API endpoints
- ✅ JWT authentication
- ✅ bcrypt password hashing
- ✅ Rate limiting
- ✅ Security features
- ✅ Error handling
- ✅ Postman collection

---

## phpMyAdmin Tips

### Viewing Data:
1. Select `invoice_api` database
2. Click table name (e.g., `users`)
3. Click "Browse" tab

### Searching:
1. Click table name
2. Click "Search" tab
3. Enter search criteria

### Exporting:
1. Select database or table
2. Click "Export" tab
3. Choose format (SQL, CSV, etc.)

### Running Queries:
1. Click "SQL" tab
2. Enter your query
3. Click "Go"

Example queries:
```sql
-- Count users
SELECT COUNT(*) FROM users;

-- Find user by email
SELECT * FROM users WHERE email = 'ahmed@libyatelecom.ly';

-- Check password field (should be hashed)
SELECT email, password FROM users LIMIT 1;
```

---

## Need Help?

- **Server won't start:** Check MySQL is running and credentials are correct
- **Can't connect:** Verify `.env` settings match your MySQL setup
- **Auth errors:** Check JWT_SECRET is set
- **Database errors:** Check phpMyAdmin for database and tables
- **Still stuck:** Ask the trainer!

---

## Advantages of MySQL for This Project

✅ **Already installed** - You have it with phpMyAdmin  
✅ **Visual interface** - phpMyAdmin makes it easy to see data  
✅ **Relational** - Better for complex relationships  
✅ **SQL knowledge** - Uses standard SQL  
✅ **Industry standard** - Widely used in enterprises  
✅ **Transactions** - Better data consistency  

---

**Happy Coding! 🚀**

**Database:** MySQL with phpMyAdmin  
**ORM:** Sequelize  
**Authentication:** JWT + bcrypt  
**Security:** Full implementation
