# Day 3 - Invoice API with Authentication & Security
## Libyan Telecom Company - API Fundamentals Course

A complete RESTful API with JWT authentication, role-based authorization, and security best practices.

---

## 🎯 What We're Building

A production-ready Invoice Management API with:
- ✅ JWT Authentication
- ✅ Role-based Authorization
- ✅ MongoDB Integration
- ✅ Input Validation
- ✅ Rate Limiting
- ✅ Security Headers
- ✅ Error Handling
- ✅ Logging

---

## 🚀 Quick Start

### Prerequisites

Make sure you have these installed:
- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MongoDB** v4.4+ ([Download](https://www.mongodb.com/try/download/community))
- **Postman** ([Download](https://www.postman.com/downloads/))
- **VS Code** or any code editor

### Installation

1. **Navigate to project directory:**
```bash
cd demo-code-day3
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Edit `.env` file:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/invoice-api
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

5. **Start MongoDB:**

**On macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**On Windows:**
```bash
# MongoDB should start automatically, or:
net start MongoDB
```

**On Linux:**
```bash
sudo systemctl start mongod
```

**Or use Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

6. **Start the server:**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 3000
📍 Environment: development
🏥 Health check: http://localhost:3000/health
```

---

## 📁 Project Structure

```
demo-code-day3/
├── src/
│   ├── models/
│   │   ├── User.js           # User model with bcrypt
│   │   └── Invoice.js        # Invoice model
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── invoiceController.js # Invoice logic (Day 4)
│   ├── routes/
│   │   ├── authRoutes.js     # Auth endpoints
│   │   └── invoiceRoutes.js  # Invoice endpoints (Day 4)
│   ├── middleware/
│   │   ├── auth.js           # JWT & authorization
│   │   └── validation.js     # Input validation (Day 4)
│   └── server.js             # Main application
├── .env                      # Environment variables
├── .env.example              # Example environment file
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
└── README_DAY3.md          # This file
```

---

## 🔐 API Endpoints

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ahmed Mohamed",
  "email": "ahmed@libyatelecom.ly",
  "password": "Password123!",
  "role": "accountant",
  "department": "finance"
}
```

**Roles:**
- `admin` - Full access
- `accountant` - Create/read/update invoices
- `viewer` - Read-only access

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "6527abc123...",
      "name": "Ahmed Mohamed",
      "email": "ahmed@libyatelecom.ly",
      "role": "accountant",
      "department": "finance",
      "isActive": true,
      "createdAt": "2024-10-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmed@libyatelecom.ly",
  "password": "Password123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "6527abc123...",
      "name": "Ahmed Mohamed",
      "email": "ahmed@libyatelecom.ly",
      "role": "accountant",
      "department": "finance"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Copy the token!** You'll need it for protected endpoints.

---

#### 3. Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "6527abc123...",
      "name": "Ahmed Mohamed",
      "email": "ahmed@libyatelecom.ly",
      "role": "accountant",
      "department": "finance",
      "isActive": true,
      "createdAt": "2024-10-15T10:00:00.000Z"
    }
  }
}
```

---

#### 4. Update Profile (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "name": "Ahmed Mohamed Al-Mansouri",
  "department": "operations"
}
```

---

#### 5. Change Password (Protected)
```http
PUT /api/auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

---

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-10-15T10:00:00.000Z"
}
```

---

## 🧪 Testing with Postman

### Setup

1. **Open Postman**

2. **Create new Collection:** "Invoice API - Day 3"

3. **Create Environment:**
   - Variable: `baseUrl` = `http://localhost:3000`
   - Variable: `token` = (will be set automatically)

4. **Add Requests:**

### Test Sequence

**Step 1: Register User**
```
POST {{baseUrl}}/api/auth/register
Body: {
  "name": "Ahmed Mohamed",
  "email": "ahmed@libyatelecom.ly",
  "password": "Password123!",
  "role": "accountant",
  "department": "finance"
}

Test Script (save token):
pm.test("Registration successful", function() {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
});
```

**Step 2: Login**
```
POST {{baseUrl}}/api/auth/login
Body: {
  "email": "ahmed@libyatelecom.ly",
  "password": "Password123!"
}

Test Script:
pm.test("Login successful", function() {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
});
```

**Step 3: Get Profile**
```
GET {{baseUrl}}/api/auth/profile
Headers: 
  Authorization: Bearer {{token}}

Test Script:
pm.test("Profile fetched", function() {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.data.user.email).to.exist;
});
```

**Step 4: Test Error Cases**
```
# No token
GET {{baseUrl}}/api/auth/profile
(No Authorization header)
Expected: 401 Unauthorized

# Invalid token
GET {{baseUrl}}/api/auth/profile
Authorization: Bearer invalid-token
Expected: 403 Forbidden

# Wrong password
POST {{baseUrl}}/api/auth/login
Body: {
  "email": "ahmed@libyatelecom.ly",
  "password": "WrongPassword"
}
Expected: 401 Unauthorized
```

---

## 🔒 Security Features

### 1. Password Hashing
- Uses bcrypt with salt rounds = 10
- Passwords never stored in plain text
- Automatic hashing before save

### 2. JWT Authentication
- Tokens expire in 1 hour
- Signed with secret key
- Contains user ID, email, role

### 3. Rate Limiting
- Auth endpoints: 5 requests per 15 minutes
- General API: 100 requests per 15 minutes
- Prevents brute force attacks

### 4. Input Validation
- Email format validation
- Password strength requirements
- Field length limits
- XSS prevention

### 5. Security Headers (Helmet)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- X-XSS-Protection

### 6. CORS
- Configured for specific origins
- Credentials support
- Pre-flight caching

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows
```

---

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change port in `.env` or kill the process
```bash
# Find process on port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

---

### JWT Secret Not Defined
```
FATAL ERROR: JWT_SECRET not defined
```
**Solution:** Set JWT_SECRET in `.env` file
```env
JWT_SECRET=your-super-secret-key-min-32-characters
```

---

### Token Expired
```
{
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Authentication token has expired"
  }
}
```
**Solution:** Login again to get a new token

---

## 📝 Common Errors & Solutions

| Error Code | Message | Solution |
|------------|---------|----------|
| `NO_TOKEN` | Authentication token required | Add Authorization header |
| `INVALID_TOKEN` | Invalid authentication token | Check token format (Bearer token) |
| `TOKEN_EXPIRED` | Token has expired | Login again |
| `USER_EXISTS` | User already exists | Use different email |
| `INVALID_CREDENTIALS` | Invalid email or password | Check credentials |
| `ACCOUNT_INACTIVE` | Account deactivated | Contact administrator |

---

## 💡 Tips for Students

### Understanding JWT

Decode your JWT at [jwt.io](https://jwt.io) to see:
- Header (algorithm)
- Payload (your user info)
- Signature (verification)

**Example JWT Payload:**
```json
{
  "userId": "6527abc123...",
  "email": "ahmed@libyatelecom.ly",
  "role": "accountant",
  "department": "finance",
  "iat": 1697369280,
  "exp": 1697372880
}
```

---

### Best Practices

1. **Never commit `.env` file**
   - Contains secrets
   - Use `.env.example` instead

2. **Use strong JWT secrets**
   - Minimum 32 characters
   - Random and complex

3. **Handle errors gracefully**
   - Always check response status
   - Read error messages carefully

4. **Keep tokens secure**
   - Don't log them
   - Don't share them
   - Store in secure storage (not localStorage)

5. **Test error scenarios**
   - Missing token
   - Invalid token
   - Expired token
   - Wrong permissions

---

## 🎯 Learning Objectives Checklist

After completing Day 3, you should be able to:

- [ ] Explain authentication vs authorization
- [ ] Implement JWT authentication
- [ ] Hash passwords with bcrypt
- [ ] Create protected routes
- [ ] Implement role-based access control
- [ ] Validate user input
- [ ] Apply rate limiting
- [ ] Use security headers
- [ ] Handle authentication errors
- [ ] Test authentication with Postman

---

## 📚 Additional Resources

### Documentation
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/introduction)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [Helmet](https://helmetjs.github.io/)

### Tutorials
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [REST API Authentication](https://www.youtube.com/watch?v=mbsmsi7l3r4)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

## 🚀 What's Next?

### Day 4 Preview
- Complete Invoice CRUD operations
- Advanced filtering and pagination
- API Documentation with Swagger
- Automated testing with Jest

### Homework (Optional)
1. Add password reset functionality
2. Implement refresh tokens
3. Add email verification
4. Create admin panel endpoints

---

## 📞 Need Help?

- **During class:** Ask the trainer
- **After class:** Check documentation
- **Errors:** Read error messages carefully
- **Stuck:** Review the curriculum document

---

## 🎉 You're Doing Great!

Building secure APIs is challenging but you're making excellent progress! Keep practicing and don't hesitate to ask questions.

**Remember:** Security is not optional - it's essential! 🔒

---

**Prepared for:** Libyan Telecom Company  
**Course:** API Fundamentals  
**Day:** 3 of 5  
**Version:** 1.0  
**Last Updated:** October 2024

