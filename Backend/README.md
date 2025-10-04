# Inventory Management Backend API

A complete Express.js backend application in TypeScript for inventory ageing dashboard and customer receipt management system. This backend handles CSV data uploads, stores and queries inventory data in PostgreSQL, computes ageing and expiry metrics, provides API endpoints for the frontend dashboard, and includes JWT authentication.

## Features

- **Two-Tier Authentication**: Manager and Employee roles with role-based access control
- **Employee Management**: Managers can create, update, and delete employee accounts
- **CSV Data Upload**: Upload and process inventory data from CSV files
- **Inventory Management**: Store and query inventory with ageing and expiry calculations
- **Dashboard KPIs**: Get aggregated metrics for dashboard visualization
- **Receipt Generation**: Generate PDF receipts for customer transactions
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **TypeScript**: Full TypeScript implementation with strong typing
- **PostgreSQL**: Robust database with Sequelize ORM
- **Comprehensive Testing**: Unit tests with Jest
- **Error Handling**: Proper error handling and logging
- **Security**: CORS, rate limiting, input validation

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5+
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcryptjs
- **File Processing**: Multer, csv-parser
- **PDF Generation**: PDFKit
- **Testing**: Jest with ts-jest
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 12 or higher
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3001
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=inventory_db
   DB_USER=postgres
   DB_PASSWORD=password
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   
   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   
   # Logging Configuration
   LOG_LEVEL=info
   LOG_FILE=./logs/app.log
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb inventory_db
   
   # Run migrations
   npm run migrate
   
   # Run seeders (optional)
   npm run seed
   ```

5. **Build the application**
   ```bash
   npm run build
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with hot reload using ts-node-dev.

### Production Mode
```bash
npm start
```
This runs the compiled JavaScript from the `dist` folder.

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication Endpoints

#### POST /api/login
Login with username and password.
```json
{
  "username": "manager",
  "password": "manager123"
}
```

**Default Manager Account:**
- Username: `manager`
- Password: `manager123`
- Role: `manager`

#### POST /api/register
Register a new user (public endpoint for initial setup).
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com",
  "role": "employee"
}
```

### Employee Management Endpoints (Manager Only)

#### POST /api/employees
Create a new employee account.
```json
{
  "username": "employee1",
  "password": "password123",
  "email": "employee1@company.com"
}
```

#### GET /api/employees
Get all employee accounts.

#### PUT /api/employees/:id
Update an employee account.
```json
{
  "username": "updated_employee",
  "password": "newpassword123",
  "email": "updated@company.com"
}
```

#### DELETE /api/employees/:id
Delete an employee account.

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@inventory.com",
    "role": "admin"
  }
}
```

#### POST /api/register
Register a new user.
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com",
  "role": "user"
}
```

### Protected Endpoints (Require JWT Token)

#### GET /api/profile
Get current user profile.

#### PUT /api/profile
Update user profile.
```json
{
  "email": "newemail@example.com",
  "role": "admin"
}
```

#### PUT /api/change-password
Change user password.
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Inventory Endpoints

#### POST /api/upload-csv
Upload CSV file with inventory data.

**Request:** Multipart form with `file` field containing CSV.

**CSV Format:**
```csv
JWL Part,Customer Part,Description,UOM,Batch,MFG Date,EXP Date,QTY,Weight (Kg)
PART001,CUST001,Test Part 1,PCS,BATCH001,01-01-2024,31-12-2024,100,1.5
```

**Response:**
```json
{
  "message": "CSV file processed successfully",
  "insertedCount": 100,
  "totalRows": 100
}
```

#### GET /api/inventory
Get inventory with filters and pagination.

**Query Parameters:**
- `jwl_part`: Filter by JWL part number
- `customer_part`: Filter by customer part number
- `mfg_start`, `mfg_end`: Manufacturing date range (DD-MM-YYYY)
- `exp_start`, `exp_end`: Expiry date range (DD-MM-YYYY)
- `search`: Search in description, batch, part numbers
- `batch`: Filter by batch number
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "jwl_part": "PART001",
      "customer_part": "CUST001",
      "description": "Test Part 1",
      "uom": "PCS",
      "batch": "BATCH001",
      "mfg_date": "2024-01-01",
      "exp_date": "2024-12-31",
      "qty": 100,
      "weight": 1.5,
      "ageing_days": 30,
      "days_to_expiry": 300
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50,
  "totalPages": 2
}
```

#### GET /api/unique-parts
Get unique part numbers for dropdowns.

**Response:**
```json
{
  "jwl_parts": ["PART001", "PART002"],
  "customer_parts": ["CUST001", "CUST002"]
}
```

#### GET /api/dashboard-kpis
Get dashboard KPIs and metrics.

**Response:**
```json
{
  "total_stock": 1000,
  "percent_near_expiry": 15.5,
  "average_ageing": 45.2,
  "total_items": 50,
  "ageing_buckets": {
    "0-30": 20,
    "30-60": 15,
    "60+": 15
  },
  "expiry_risk": {
    "high": 5,
    "medium": 10,
    "low": 35
  }
}
```

#### GET /api/inventory-summary
Get inventory summary for receipt selection.

**Response:**
```json
[
  {
    "jwl_part": "PART001",
    "description": "Test Part 1",
    "available_qty": 100
  }
]
```

#### POST /api/receipt
Generate customer receipt.

**Request:**
```json
{
  "customer": {
    "name": "John Doe",
    "address": "123 Main St, City, State 12345",
    "email": "john@example.com",
    "phone": "555-1234"
  },
  "items": [
    {
      "jwl_part": "PART001",
      "qty": 5
    }
  ],
  "tax_rate": 10
}
```

**Response:**
```json
{
  "receipt_number": "RCP-1234567890-123",
  "pdf_base64": "base64-encoded-pdf-string",
  "totals": {
    "subtotal": 100,
    "tax_amount": 10,
    "grand_total": 110
  }
}
```

### Utility Endpoints

#### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-12-01T10:00:00.000Z",
  "uptime": 3600
}
```

## Data Models

### Inventory Model
```typescript
interface Inventory {
  id: number;
  jwl_part: string;
  customer_part: string;
  description: string;
  uom: string;
  batch: string;
  mfg_date: Date;
  exp_date: Date;
  qty: number;
  weight: number;
  ageing_days?: number;
  days_to_expiry?: number;
  created_at: Date;
  updated_at: Date;
}
```

### User Model
```typescript
interface User {
  id: number;
  username: string;
  hashed_password: string;
  email?: string;
  role?: string;
  created_at: Date;
  updated_at: Date;
}
```

## Calculations

### Ageing Days
Calculated as: `Math.floor((currentDate - mfgDate) / (1000 * 60 * 60 * 24))`

### Days to Expiry
Calculated as: `Math.floor((expDate - currentDate) / (1000 * 60 * 60 * 24))`

### Ageing Buckets
- **0-30 days**: Fresh inventory
- **30-60 days**: Moderate ageing
- **60+ days**: High ageing

### Expiry Risk
- **High**: <30 days to expiry
- **Medium**: 30-90 days to expiry
- **Low**: >90 days to expiry

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack (development only)"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Role-Based Access Control

### Manager Role
- ✅ Create, read, update, delete employee accounts
- ✅ Access all inventory features
- ✅ Upload CSV files
- ✅ Generate receipts
- ✅ View dashboard KPIs
- ✅ Manage own profile

### Employee Role
- ❌ Cannot manage other users
- ✅ Access inventory features
- ✅ View inventory data
- ✅ Generate receipts
- ✅ View dashboard KPIs
- ✅ Manage own profile

## Security Features

- **Two-Tier Authentication**: Manager and Employee roles with proper access control
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with 12 salt rounds
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse with request limits
- **Input Validation**: express-validator for request validation
- **Helmet**: Security headers
- **SQL Injection Protection**: Sequelize ORM prevents SQL injection

## Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- dateUtils.test.ts
```

Test files:
- `dateUtils.test.ts`: Date calculation utilities
- `pdfGenerator.test.ts`: PDF generation utilities
- `auth.middleware.test.ts`: Authentication middleware
- `api.test.ts`: API endpoint integration tests

## Database Migrations

```bash
# Run migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Run seeders
npm run seed
```

## Logging

The application uses Winston for logging:

- **Error logs**: Written to `logs/error.log`
- **Combined logs**: Written to `logs/combined.log`
- **Console output**: Development mode only

Log levels: `error`, `warn`, `info`, `debug`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `inventory_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration | `24h` |
| `CORS_ORIGIN` | CORS origin | `http://localhost:5174` |
| `MAX_FILE_SIZE` | Max upload size | `10485760` (10MB) |
| `UPLOAD_PATH` | Upload directory | `./uploads` |
| `LOG_LEVEL` | Log level | `info` |
| `LOG_FILE` | Log file path | `./logs/app.log` |

## Default Admin User

After running migrations and seeders, a default admin user is created:

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@inventory.com`
- **Role**: `admin`

**Important**: Change the default password in production!

## Production Deployment

1. **Set production environment variables**
2. **Use a production database**
3. **Set strong JWT secret**
4. **Enable SSL/TLS**
5. **Use PM2 or similar process manager**
6. **Set up monitoring and logging**

Example PM2 configuration:
```json
{
  "name": "inventory-backend",
  "script": "dist/index.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## Changelog

### v1.0.0
- Initial release
- Complete inventory management system
- JWT authentication
- CSV upload functionality
- PDF receipt generation
- Dashboard KPIs
- Comprehensive testing
- TypeScript implementation
