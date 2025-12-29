# Backend Refactoring Complete ✅

## What Was Changed

### 1. **New Models Created**

#### ✅ User Model (`backend/models/User.js`)
- Replaces Agent model with unified User model
- Added `role` field: `'agent'` or `'employee'`
- Keeps all existing fields (name, username, password, email, phone, dob, age, profileImage, isActive)
- Password hashing and comparison methods preserved

#### ✅ UserAttendance Model (`backend/models/UserAttendance.js`)
- Replaces AgentAttendance model
- Added `role` field to track if attendance is for agent or employee
- Changed `agentId` → `userId` (references User model)
- Changed `agentName` → `userName`
- All attendance logic preserved (check-in, check-out, duration calculation)

### 2. **Updated Models**

#### ✅ Vendor Model (`backend/models/Vendor.js`)
**Old fields:**
- `agentId` → **Changed to** `createdById`
- `agentName` → **Changed to** `createdByName`
- `agentUsername` → **Changed to** `createdByUsername`
- **Added:** `createdByRole` ('agent' | 'employee')

### 3. **New Controllers**

#### ✅ User Controller (`backend/controllers/user.controller.js`)
Unified controller for both agents and employees:
- `userLogin` - Login for both roles
- `getAllUsers` - Admin: Get all users (filter by role)
- `createUser` - Admin: Create agent or employee
- `updateUser` - Admin: Update user
- `deleteUser` - Admin: Delete user
- `getUserById` - Admin: Get single user
- `getMyProfile` - User: Get own profile
- `updateMyProfile` - User: Update own profile
- `getMyVendors` - User: Get own vendors
- `requestVendorEdit` - User: Request vendor edit
- `updateMyVendor` - User: Update vendor (if approved)

#### ✅ UserAttendance Controller (`backend/controllers/userAttendance.controller.js`)
Unified attendance for both roles:
- `checkIn` - Check-in for agent/employee
- `checkOut` - Check-out for agent/employee
- `getMyAttendance` - Get own attendance records
- `getTodayAttendance` - Get today's attendance status
- `getAllAttendance` - Admin: Get all attendance (filter by role)
- `getUserAttendance` - Admin: Get specific user's attendance

### 4. **New Middleware**

#### ✅ UserAuth Middleware (`backend/middleware/userAuth.js`)
- Validates JWT tokens
- Attaches `req.user` with: `userId`, `name`, `username`, `role`
- Works for both agents and employees

### 5. **New Routes**

#### ✅ User Routes (`backend/routes/user.routes.js`)
```
POST   /api/users/agent/login              - Agent login
POST   /api/users/employee/login           - Employee login
GET    /api/users/agent/profile            - Agent: Get own profile
PUT    /api/users/agent/profile            - Agent: Update own profile
GET    /api/users/agent/vendors            - Agent: Get own vendors
POST   /api/users/agent/vendors/:id/request-edit - Agent: Request vendor edit
PUT    /api/users/agent/vendors/:id        - Agent: Update vendor

GET    /api/users/employee/profile         - Employee: Get own profile
PUT    /api/users/employee/profile         - Employee: Update own profile
GET    /api/users/employee/vendors         - Employee: Get own vendors
POST   /api/users/employee/vendors/:id/request-edit - Employee: Request vendor edit
PUT    /api/users/employee/vendors/:id     - Employee: Update vendor

GET    /api/users?role=agent               - Admin: Get all agents
GET    /api/users?role=employee            - Admin: Get all employees
POST   /api/users                          - Admin: Create user
GET    /api/users/:id                      - Admin: Get user by ID
PUT    /api/users/:id                      - Admin: Update user
DELETE /api/users/:id                      - Admin: Delete user
```

#### ✅ UserAttendance Routes (`backend/routes/userAttendance.routes.js`)
```
POST   /api/attendance/agent/check-in      - Agent: Check-in
POST   /api/attendance/agent/check-out     - Agent: Check-out
GET    /api/attendance/agent/my            - Agent: Get own attendance
GET    /api/attendance/agent/today         - Agent: Get today's attendance

POST   /api/attendance/employee/check-in   - Employee: Check-in
POST   /api/attendance/employee/check-out  - Employee: Check-out
GET    /api/attendance/employee/my         - Employee: Get own attendance
GET    /api/attendance/employee/today      - Employee: Get today's attendance

GET    /api/attendance/admin/all?role=agent     - Admin: Get all attendance
GET    /api/attendance/admin/all?role=employee  - Admin: Filter by role
GET    /api/attendance/admin/:userId            - Admin: Get user attendance
```

### 6. **Updated Files**

#### ✅ Server.js (`backend/server.js`)
Added new routes:
```javascript
app.use('/api/users', userRoutes);
app.use('/api/attendance', userAttendanceRoutes);
```

Old routes still work for backward compatibility:
```javascript
app.use('/api/agents', agentRoutes);
app.use('/api/agent/attendance', attendanceRoutes);
```

#### ✅ Vendor Controller (`backend/controllers/vendor.controller.js`)
Updated to support both old `req.agent` and new `req.user`:
- Now saves `createdById`, `createdByName`, `createdByUsername`, `createdByRole`
- Works with both old agent auth and new user auth

---

## How to Test

### Prerequisites
1. Make sure MongoDB is running
2. Install dependencies: `npm install`
3. Make sure `.env` file has correct values

### Test Steps

#### 1. **Admin Creates Users**

**Create Agent:**
```bash
POST http://localhost:5000/api/users
Headers: {
  "Authorization": "Bearer <ADMIN_TOKEN>",
  "Content-Type": "application/json"
}
Body: {
  "name": "John Agent",
  "username": "john_agent",
  "password": "password123",
  "role": "agent"
}
```

**Create Employee:**
```bash
POST http://localhost:5000/api/users
Headers: {
  "Authorization": "Bearer <ADMIN_TOKEN>",
  "Content-Type": "application/json"
}
Body: {
  "name": "Sarah Employee",
  "username": "sarah_employee",
  "password": "password123",
  "role": "employee"
}
```

#### 2. **Agent Login**
```bash
POST http://localhost:5000/api/users/agent/login
Body: {
  "username": "john_agent",
  "password": "password123"
}
```

#### 3. **Employee Login**
```bash
POST http://localhost:5000/api/users/employee/login
Body: {
  "username": "sarah_employee",
  "password": "password123"
}
```

#### 4. **Agent Check-in**
```bash
POST http://localhost:5000/api/attendance/agent/check-in
Headers: {
  "Authorization": "Bearer <AGENT_TOKEN>"
}
Body: {
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "Bangalore, India"
  }
}
```

#### 5. **Employee Check-in**
```bash
POST http://localhost:5000/api/attendance/employee/check-in
Headers: {
  "Authorization": "Bearer <EMPLOYEE_TOKEN>"
}
Body: {
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "Bangalore, India"
  }
}
```

#### 6. **Admin Views All Users**
```bash
# Get all agents
GET http://localhost:5000/api/users?role=agent
Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }

# Get all employees
GET http://localhost:5000/api/users?role=employee
Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }

# Get all users (both)
GET http://localhost:5000/api/users
Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }
```

#### 7. **Admin Views Attendance**
```bash
# Get all attendance (both roles)
GET http://localhost:5000/api/attendance/admin/all
Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }

# Filter by agent
GET http://localhost:5000/api/attendance/admin/all?role=agent
Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }

# Filter by employee
GET http://localhost:5000/api/attendance/admin/all?role=employee
Headers: { "Authorization": "Bearer <ADMIN_TOKEN>" }
```

---

## Migration Guide

### Database Migration (Run Once)

**Option 1: Keep Old Data (Recommended)**
- Old Agent collection stays as is
- Old AgentAttendance stays as is
- New registrations go to User and UserAttendance
- You'll have both systems running in parallel

**Option 2: Migrate Existing Data**
Run this in MongoDB shell:

```javascript
// Migrate agents to users
db.agents.find().forEach(agent => {
  db.users.insertOne({
    ...agent,
    role: "agent",
    _id: agent._id
  });
});

// Migrate attendance
db.agentattendances.find().forEach(att => {
  db.userattendances.insertOne({
    userId: att.agentId,
    userName: att.agentName,
    role: "agent",
    date: att.date,
    checkIn: att.checkIn,
    checkOut: att.checkOut,
    duration: att.duration,
    status: att.status,
    remark: att.remark,
    location: att.location,
    createdAt: att.createdAt,
    updatedAt: att.updatedAt
  });
});

// Update vendor references
db.vendors.updateMany({}, [{
  $set: {
    createdById: "$agentId",
    createdByName: "$agentName",
    createdByUsername: "$agentUsername",
    createdByRole: "agent"
  }
}]);
```

---

## What's Next?

### ✅ Backend Complete
- ✅ User model with role
- ✅ UserAttendance model with role
- ✅ Vendor model updated
- ✅ Controllers created
- ✅ Routes configured
- ✅ Middleware created

### 🚀 Next Steps:

1. **Frontend Changes** (Next Phase)
   - Add role selection in multi-step form
   - Update login to support agent/employee
   - Update dashboard to work with both roles
   - Update API calls to new endpoints

2. **Admin Panel Changes** (After Frontend)
   - Add "Employees" sidebar menu
   - Create employee management pages
   - Update attendance views for both roles
   - Add role filters in tables

---

## Backward Compatibility

### ✅ Old routes still work:
- `/api/agents/*` → Still functional
- `/api/agent/attendance/*` → Still functional
- Old Agent model → Still exists
- Old AgentAttendance model → Still exists

### ⚠️ Recommendation:
- Use new routes for new development
- Migrate old routes gradually
- Keep both systems during transition period

---

## Important Notes

1. **JWT Token Structure Changed:**
   - Old: `{ agentId, agentName }`
   - New: `{ userId, userName, role }`

2. **Vendor Field Names Changed:**
   - Old: `agentId`, `agentName`, `agentUsername`
   - New: `createdById`, `createdByName`, `createdByUsername`, `createdByRole`

3. **Attendance Field Names Changed:**
   - Old: `agentId`, `agentName`
   - New: `userId`, `userName`, `role`

4. **Both systems can coexist** during migration period

---

## Questions?

If you encounter any issues:
1. Check MongoDB connection
2. Verify JWT tokens are being passed correctly
3. Check console logs for detailed error messages
4. Verify role values are exactly 'agent' or 'employee' (lowercase)
