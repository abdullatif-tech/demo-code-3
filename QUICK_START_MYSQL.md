# ⚡ Quick Start - MySQL Version

**Get up and running in 5 minutes!**

---

## 📋 Prerequisites

You already have:
- ✅ Node.js
- ✅ MySQL with phpMyAdmin
- ✅ This project folder

---

## 🚀 3-Step Setup

### Step 1: Install (30 seconds)
```bash
cd demo-code-day3
npm install
```

### Step 2: Database (1 minute)

**Open phpMyAdmin:** http://localhost/phpmyadmin

1. Click "**New**" (left sidebar)
2. Database name: `invoice_api`
3. Click "**Create**"

✅ **Done!** Tables will be created automatically.

### Step 3: Configure (30 seconds)

**Edit the `.env` file:**

Change only these 2 lines:
```env
DB_PASSWORD=your_mysql_password  # ← Your MySQL password
JWT_SECRET=abc123xyz789secret456  # ← Any random string (min 32 chars)
```

Or generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ▶️ Run

```bash
npm run dev
```

Expected output:
```
✅ MySQL connection established successfully
✅ Database synchronized
🚀 Server running on port 3000
```

**Server is ready!** 🎉

---

## 🧪 Test It!

### 1. Open Postman

Import: `Invoice_API_Day3.postman_collection.json`

### 2. Register a User

**Request:**
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Ahmed Mohamed",
  "email": "ahmed@libyatelecom.ly",
  "password": "Password123!",
  "role": "accountant",
  "department": "finance"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGci..."  ← Copy this!
  }
}
```

### 3. Check in phpMyAdmin

1. Open phpMyAdmin
2. Select `invoice_api` database
3. Click `users` table
4. **See your user!** ✨

### 4. Login

```http
POST http://localhost:3000/api/auth/login

{
  "email": "ahmed@libyatelecom.ly",
  "password": "Password123!"
}
```

### 5. Get Profile (Protected Route)

```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

**Works!** 🎉

---

## 🎯 What You Have Now

✅ User registration with bcrypt  
✅ JWT authentication  
✅ MySQL database with auto-created tables  
✅ Protected API routes  
✅ Role-based access control  
✅ Rate limiting  
✅ Security headers  
✅ Visual data viewing in phpMyAdmin  

---

## 📊 View Your Data

### In phpMyAdmin:

**See all users:**
```sql
SELECT id, name, email, role, department FROM users;
```

**Count users:**
```sql
SELECT COUNT(*) as total FROM users;
```

**Search:**
```sql
SELECT * FROM users WHERE email LIKE '%ahmed%';
```

---

## ❓ Problems?

### Server won't start
**Check:** Is MySQL running? Test phpMyAdmin first.

### Can't connect to database
**Fix:** Check `DB_PASSWORD` in `.env` matches your MySQL password.

### Database not found
**Fix:** Create it in phpMyAdmin: New → `invoice_api` → Create

### Port 3000 in use
**Fix:** Change `PORT=3001` in `.env`

---

## 🎓 Next Steps

1. ✅ Test all endpoints in Postman
2. ✅ Try creating multiple users with different roles
3. ✅ View data in phpMyAdmin
4. ✅ Test error scenarios (wrong password, duplicate email)
5. ✅ Review the code in `src/` folder

---

## 📚 More Info

- **Detailed Setup:** `SETUP_INSTRUCTIONS.md`
- **API Docs:** `README_DAY3.md`
- **Migration Info:** `MYSQL_MIGRATION_SUMMARY.md`
- **Complete Guide:** `MYSQL_CONVERSION_COMPLETE.md`

---

## ✅ You're Ready!

**Time to build secure APIs with MySQL!** 🚀

---

**Questions?** Check the documentation files above or ask your trainer!

**Happy coding!** 💻🔒

