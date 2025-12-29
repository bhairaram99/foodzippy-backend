# Backend API Testing Guide - Postman

## Base URL
```
http://localhost:5000
```

---

## 1. ADMIN APIs

### 1.1 Admin Login
**Get admin token first - you'll need this for all admin operations**

```
POST /api/admin/login
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "email": "admin@foodzippy.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "email": "admin@foodzippy.com",
    "role": "admin"
  }
}
```

---

## 2. USER MANAGEMENT APIs (Admin Only)

### 2.1 Create Agent
```
POST /api/users
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <ADMIN_TOKEN>"
}
```

**Body:**
```json
{
  "name": "John Agent",
  "username": "john_agent",
  "password": "password123",
  "role": "agent",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Agent created successfully",
  "user": {
    "id": "...",
    "name": "John Agent",
    "username": "john_agent",
    "role": "agent",
    "isActive": true,
    "createdAt": "2025-12-29T..."
  }
}
```

---

### 2.2 Create Employee
```
POST /api/users
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <ADMIN_TOKEN>"
}
```

**Body:**
```json
{
  "name": "Sarah Employee",
  "username": "sarah_employee",
  "password": "password123",
  "role": "employee",
  "email": "sarah@example.com",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "user": {
    "id": "...",
    "name": "Sarah Employee",
    "username": "sarah_employee",
    "role": "employee",
    "isActive": true,
    "createdAt": "2025-12-29T..."
  }
}
```

---

### 2.3 Get All Agents
```
GET /api/users?role=agent
```

**Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_TOKEN>"
}
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "id": "...",
      "name": "John Agent",
      "username": "john_agent",
      "role": "agent",
      "email": "john@example.com",
      "isActive": true
    }
  ]
}
```

---

### 2.4 Get All Employees
```
GET /api/users?role=employee
```

**Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_TOKEN>"
}
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "users": [
    {
      "id": "...",
      "name": "Sarah Employee",
      "username": "sarah_employee",
      "role": "employee",
      "email": "sarah@example.com",
      "isActive": true
    }
  ]
}
```

---

### 2.5 Get All Users (Both Agents and Employees)
```
GET /api/users
```

**Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_TOKEN>"
}
```

---

### 2.6 Get Single User by ID
```
GET /api/users/:userId
```

**Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_TOKEN>"
}
```

**Example:**
```
GET /api/users/676f8a1b2c3d4e5f6a7b8c9d
```

---

### 2.7 Update User
```
PUT /api/users/:userId
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <ADMIN_TOKEN>"
}
```

**Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "1111111111",
  "isActive": true
}
```

---

### 2.8 Delete User
```
DELETE /api/users/:userId
```

**Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_TOKEN>"
}
```

---

## 3. AGENT APIs

### 3.1 Agent Login
```
POST /api/users/agent/login
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "username": "john_agent",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Agent",
    "username": "john_agent",
    "role": "agent"
  }
}
```

**⚠️ IMPORTANT: Save this token as AGENT_TOKEN for next requests**

---

### 3.2 Get Agent Profile
```
GET /api/users/agent/profile
```

**Headers:**
```json
{
  "Authorization": "Bearer <AGENT_TOKEN>"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Agent",
    "username": "john_agent",
    "role": "agent",
    "email": "john@example.com",
    "phone": "1234567890",
    "isActive": true
  }
}
```

---

### 3.3 Update Agent Profile
```
PUT /api/users/agent/profile
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <AGENT_TOKEN>"
}
```

**Body:**
```json
{
  "email": "john.new@example.com",
  "dob": "1990-01-15"
}
```

---

### 3.4 Agent Check-in
```
POST /api/attendance/agent/check-in
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <AGENT_TOKEN>"
}
```

**Body:**
```json
{
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "Bangalore, Karnataka, India"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checked in successfully",
  "attendance": {
    "userId": "...",
    "userName": "John Agent",
    "role": "agent",
    "date": "2025-12-29T00:00:00.000Z",
    "checkIn": "2025-12-29T10:30:00.000Z",
    "status": "Present"
  }
}
```

---

### 3.5 Agent Check-out
```
POST /api/attendance/agent/check-out
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <AGENT_TOKEN>"
}
```

**Body:**
```json
{
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "Bangalore, Karnataka, India"
  },
  "remark": "Completed all tasks for the day"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checked out successfully",
  "attendance": {
    "checkOut": "2025-12-29T18:30:00.000Z",
    "duration": 480,
    "status": "Present"
  }
}
```

---

### 3.6 Get Agent's Own Attendance
```
GET /api/attendance/agent/my
```

**Headers:**
```json
{
  "Authorization": "Bearer <AGENT_TOKEN>"
}
```

**Query Parameters (Optional):**
- `month` - Month number (1-12)
- `year` - Year (2025)
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Examples:**
```
GET /api/attendance/agent/my
GET /api/attendance/agent/my?month=12&year=2025
GET /api/attendance/agent/my?startDate=2025-12-01&endDate=2025-12-31
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "statistics": {
    "totalDays": 15,
    "presentDays": 14,
    "halfDays": 1,
    "avgDuration": 480,
    "totalHours": 120
  },
  "attendance": [...]
}
```

---

### 3.7 Get Today's Attendance Status
```
GET /api/attendance/agent/today
```

**Headers:**
```json
{
  "Authorization": "Bearer <AGENT_TOKEN>"
}
```

**Response:**
```json
{
  "success": true,
  "attendance": {
    "checkIn": "2025-12-29T10:30:00.000Z",
    "checkOut": null,
    "status": "Present"
  },
  "hasCheckedIn": true,
  "hasCheckedOut": false
}
```

---

### 3.8 Get Agent's Vendors
```
GET /api/users/agent/vendors
```

**Headers:**
```json
{
  "Authorization": "Bearer <AGENT_TOKEN>"
}
```

---

### 3.9 Request Vendor Edit
```
POST /api/users/agent/vendors/:vendorId/request-edit
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <AGENT_TOKEN>"
}
```

**Body:**
```json
{
  "remark": "Need to update restaurant timings and contact details"
}
```

---

### 3.10 Update Vendor (After Admin Approval)
```
PUT /api/users/agent/vendors/:vendorId
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <AGENT_TOKEN>"
}
```

**Body:**
```json
{
  "restaurantName": "Updated Restaurant Name",
  "mobileNumber": "9999999999",
  "shortDescription": "Updated description"
}
```

---

## 4. EMPLOYEE APIs

### 4.1 Employee Login
```
POST /api/users/employee/login
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "username": "sarah_employee",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Sarah Employee",
    "username": "sarah_employee",
    "role": "employee"
  }
}
```

**⚠️ IMPORTANT: Save this token as EMPLOYEE_TOKEN for next requests**

---

### 4.2 Get Employee Profile
```
GET /api/users/employee/profile
```

**Headers:**
```json
{
  "Authorization": "Bearer <EMPLOYEE_TOKEN>"
}
```

---

### 4.3 Update Employee Profile
```
PUT /api/users/employee/profile
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <EMPLOYEE_TOKEN>"
}
```

**Body:**
```json
{
  "email": "sarah.new@example.com",
  "dob": "1995-05-20"
}
```

---

### 4.4 Employee Check-in
```
POST /api/attendance/employee/check-in
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <EMPLOYEE_TOKEN>"
}
```

**Body:**
```json
{
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "Bangalore, Karnataka, India"
  }
}
```

---

### 4.5 Employee Check-out
```
POST /api/attendance/employee/check-out
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <EMPLOYEE_TOKEN>"
}
```

**Body:**
```json
{
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "Bangalore, Karnataka, India"
  },
  "remark": "Completed office work"
}
```

---

### 4.6 Get Employee's Own Attendance
```
GET /api/attendance/employee/my
```

**Headers:**
```json
{
  "Authorization": "Bearer <EMPLOYEE_TOKEN>"
}
```

**Query Parameters (Optional):**
- `month` - Month number (1-12)
- `year` - Year (2025)
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

---

### 4.7 Get Today's Attendance Status
```
GET /api/attendance/employee/today
```

**Headers:**
```json
{
  "Authorization": "Bearer <EMPLOYEE_TOKEN>"
}
```

---

### 4.8 Get Employee's Vendors
```
GET /api/users/employee/vendors
```

**Headers:**
```json
{
  "Authorization": "Bearer <EMPLOYEE_TOKEN>"
}
```

---

### 4.9 Request Vendor Edit
```
POST /api/users/employee/vendors/:vendorId/request-edit
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <EMPLOYEE_TOKEN>"
}
```

**Body:**
```json
{
  "remark": "Need to update menu items"
}
```

---

### 4.10 Update Vendor (After Admin Approval)
```
PUT /api/users/employee/vendors/:vendorId
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <EMPLOYEE_TOKEN>"
}
```

---

## 5. ADMIN ATTENDANCE APIs

### 5.1 Get All Attendance (Both Roles)
```
GET /api/attendance/admin/all
```

**Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_TOKEN>"
}
```

**Query Parameters (Optional):**
- `role` - Filter by role: `agent` or `employee`
- `userId` - Filter by specific user
- `status` - Filter by status: `Present`, `Absent`, `Half-Day`, `Leave`
- `month` - Month number (1-12)
- `year` - Year (2025)
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Examples:**
```
GET /api/attendance/admin/all
GET /api/attendance/admin/all?role=agent
GET /api/attendance/admin/all?role=employee
GET /api/attendance/admin/all?month=12&year=2025
GET /api/attendance/admin/all?status=Present
```

**Response:**
```json
{
  "success": true,
  "count": 30,
  "attendance": [
    {
      "userId": "...",
      "userName": "John Agent",
      "role": "agent",
      "date": "2025-12-29T00:00:00.000Z",
      "checkIn": "2025-12-29T10:30:00.000Z",
      "checkOut": "2025-12-29T18:30:00.000Z",
      "duration": 480,
      "status": "Present"
    },
    {
      "userId": "...",
      "userName": "Sarah Employee",
      "role": "employee",
      "date": "2025-12-29T00:00:00.000Z",
      "checkIn": "2025-12-29T09:00:00.000Z",
      "checkOut": null,
      "duration": 0,
      "status": "Present"
    }
  ]
}
```

---

### 5.2 Get Specific User's Attendance
```
GET /api/attendance/admin/:userId
```

**Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_TOKEN>"
}
```

**Query Parameters (Optional):**
- `month` - Month number (1-12)
- `year` - Year (2025)
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Example:**
```
GET /api/attendance/admin/676f8a1b2c3d4e5f6a7b8c9d
GET /api/attendance/admin/676f8a1b2c3d4e5f6a7b8c9d?month=12&year=2025
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Agent",
    "username": "john_agent",
    "email": "john@example.com",
    "role": "agent"
  },
  "statistics": {
    "totalDays": 15,
    "presentDays": 14,
    "halfDays": 1,
    "totalHours": 120
  },
  "count": 15,
  "attendance": [...]
}
```

---

## 6. POSTMAN TESTING WORKFLOW

### Step-by-Step Testing Order:

#### 1️⃣ **Admin Setup**
```
1. POST /api/admin/login
   → Save ADMIN_TOKEN
```

#### 2️⃣ **Create Users**
```
2. POST /api/users (Create Agent)
   → Body: { role: "agent", ... }
   
3. POST /api/users (Create Employee)
   → Body: { role: "employee", ... }
   
4. GET /api/users?role=agent
   → Verify agent created
   
5. GET /api/users?role=employee
   → Verify employee created
```

#### 3️⃣ **Agent Login & Actions**
```
6. POST /api/users/agent/login
   → Save AGENT_TOKEN
   
7. GET /api/users/agent/profile
   → Verify profile
   
8. POST /api/attendance/agent/check-in
   → Check-in agent
   
9. GET /api/attendance/agent/today
   → Verify check-in status
   
10. POST /api/attendance/agent/check-out
    → Check-out agent
    
11. GET /api/attendance/agent/my
    → View agent's attendance
```

#### 4️⃣ **Employee Login & Actions**
```
12. POST /api/users/employee/login
    → Save EMPLOYEE_TOKEN
    
13. GET /api/users/employee/profile
    → Verify profile
    
14. POST /api/attendance/employee/check-in
    → Check-in employee
    
15. GET /api/attendance/employee/today
    → Verify check-in status
    
16. POST /api/attendance/employee/check-out
    → Check-out employee
    
17. GET /api/attendance/employee/my
    → View employee's attendance
```

#### 5️⃣ **Admin View All**
```
18. GET /api/attendance/admin/all
    → View all attendance (both roles)
    
19. GET /api/attendance/admin/all?role=agent
    → Filter agents only
    
20. GET /api/attendance/admin/all?role=employee
    → Filter employees only
```

---

## 7. EXPECTED RESULTS

### ✅ What Should Work:

1. **Admin can create both agents and employees**
2. **Agent and employee login separately**
3. **Both can check-in/check-out**
4. **Both have separate attendance records**
5. **Admin can view all attendance with role filter**
6. **Both can manage their own profile**
7. **Both can create vendors** (via existing vendor routes)
8. **Admin sees both roles in user list**

### ❌ Common Errors to Check:

1. **401 Unauthorized** → Token expired or missing
2. **403 Forbidden** → Wrong role or inactive account
3. **400 Bad Request** → Missing required fields
4. **404 Not Found** → User/resource doesn't exist
5. **500 Server Error** → Check server logs

---

## 8. POSTMAN COLLECTION VARIABLES

Create these variables in Postman:

```
BASE_URL = http://localhost:5000
ADMIN_TOKEN = (set after admin login)
AGENT_TOKEN = (set after agent login)
EMPLOYEE_TOKEN = (set after employee login)
AGENT_ID = (set after creating agent)
EMPLOYEE_ID = (set after creating employee)
```

---

## 9. IMPORTANT NOTES

1. **Port**: Make sure backend is running on port 5000
2. **MongoDB**: Ensure MongoDB connection is active
3. **Tokens**: Save tokens from login responses for subsequent requests
4. **Role Field**: Must be exactly `"agent"` or `"employee"` (lowercase)
5. **Check-in**: Can only check-in once per day
6. **Check-out**: Must check-in before check-out
7. **Vendor Edit**: Requires admin approval before updating

---

## 10. TROUBLESHOOTING

### Server Not Running?
```bash
cd backend
node server.js
```

### Port 5000 Already in Use?
Check `.env` file or kill existing process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Error?
Verify MongoDB is running and connection string in `.env` is correct.

---

**Ready to test! Start with Step 1 (Admin Login) and work your way down.** 🚀
