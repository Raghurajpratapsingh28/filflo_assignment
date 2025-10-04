# Authentication API Documentation

## Overview
The authentication system now supports two-tier access: **Manager** and **Employee** roles.

- **Manager**: Can create, read, update, and delete employee accounts. Has full access to all inventory features.
- **Employee**: Can only access inventory features. Cannot manage other user accounts.

## Default Manager Account
- **Username**: `manager`
- **Password**: `manager123`
- **Email**: `manager@inventory.com`

## Authentication Endpoints

### 1. Login
**POST** `/api/login`

**Request Body:**
```json
{
  "username": "manager",
  "password": "manager123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "manager",
    "email": "manager@inventory.com",
    "role": "manager"
  }
}
```

### 2. Register (Public - for initial setup)
**POST** `/api/register`

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com",
  "role": "employee"
}
```

## Employee Management APIs (Manager Only)

### 3. Create Employee
**POST** `/api/employees`

**Headers:** `Authorization: Bearer <manager_token>`

**Request Body:**
```json
{
  "username": "employee1",
  "password": "password123",
  "email": "employee1@company.com"
}
```

**Response:**
```json
{
  "message": "Employee created successfully",
  "employee": {
    "id": 2,
    "username": "employee1",
    "email": "employee1@company.com",
    "role": "employee",
    "created_at": "2024-12-01T10:00:00.000Z"
  }
}
```

### 4. Get All Employees
**GET** `/api/employees`

**Headers:** `Authorization: Bearer <manager_token>`

**Response:**
```json
{
  "employees": [
    {
      "id": 2,
      "username": "employee1",
      "email": "employee1@company.com",
      "role": "employee",
      "created_at": "2024-12-01T10:00:00.000Z",
      "updated_at": "2024-12-01T10:00:00.000Z"
    }
  ]
}
```

### 5. Update Employee
**PUT** `/api/employees/:id`

**Headers:** `Authorization: Bearer <manager_token>`

**Request Body:**
```json
{
  "username": "updated_employee1",
  "password": "newpassword123",
  "email": "updated@company.com"
}
```

**Response:**
```json
{
  "message": "Employee updated successfully",
  "employee": {
    "id": 2,
    "username": "updated_employee1",
    "email": "updated@company.com",
    "role": "employee",
    "updated_at": "2024-12-01T11:00:00.000Z"
  }
}
```

### 6. Delete Employee
**DELETE** `/api/employees/:id`

**Headers:** `Authorization: Bearer <manager_token>`

**Response:**
```json
{
  "message": "Employee deleted successfully"
}
```

## User Profile APIs

### 7. Get Profile
**GET** `/api/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "manager",
    "email": "manager@inventory.com",
    "role": "manager",
    "created_at": "2024-12-01T09:00:00.000Z"
  }
}
```

### 8. Update Profile
**PUT** `/api/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "email": "newemail@company.com"
}
```

### 9. Change Password
**PUT** `/api/change-password`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Only managers can create employees"
}
```

### 400 Bad Request
```json
{
  "error": "Username already exists"
}
```

## Role-Based Access Control

### Manager Permissions
- ✅ Create, read, update, delete employees
- ✅ Access all inventory features
- ✅ Upload CSV files
- ✅ Generate receipts
- ✅ View dashboard KPIs
- ✅ Manage own profile

### Employee Permissions
- ❌ Cannot manage other users
- ✅ Access inventory features
- ✅ View inventory data
- ✅ Generate receipts
- ✅ View dashboard KPIs
- ✅ Manage own profile

## Security Notes

1. **Password Requirements**: Minimum 6 characters
2. **Username Requirements**: Minimum 3 characters, must be unique
3. **Email Validation**: Must be valid email format if provided
4. **Token Expiration**: JWT tokens expire after 24 hours
5. **Password Hashing**: Uses bcrypt with 12 salt rounds
6. **Role Validation**: Only 'manager' and 'employee' roles are allowed

## Database Setup

Run the following commands to set up the database:

```bash
# Run migrations
npm run migrate

# Run seeders to create initial manager account
npm run seed
```

The seeder will create a default manager account:
- Username: `manager`
- Password: `manager123`
- Role: `manager`
