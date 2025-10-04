# Database Setup Guide

This application uses Supabase for data persistence. Follow these steps to configure the database schema.

## Prerequisites

- A Supabase account
- Database connection details (available in `.env`)

## Database Schema

The application requires the following tables:

### 1. inventory
Stores product inventory information including manufacturing dates, expiry dates, and quantities.

### 2. customers
Stores customer contact information for receipt generation.

### 3. receipts
Records of customer transactions and sales.

### 4. receipt_items
Line items for each receipt with product details and quantities.

## Setup Instructions

### Option 1: Using the Supabase Dashboard

1. Log in to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration file located at `supabase/migrations/create_inventory_schema.sql`

### Option 2: Manual Setup

If you encounter issues with the automated migration, you can manually create the tables using the SQL provided in the migration file.

## Authentication Setup

The application uses Supabase Auth for employee login:

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable Email authentication
3. Disable email confirmations for internal use
4. Create test user accounts via Authentication > Users

### Creating Test Users

```sql
-- Example user creation (use Supabase Dashboard instead)
-- Go to Authentication > Users > Add User
-- Email: admin@company.com
-- Password: your-secure-password
```

## Sample Data

The application will automatically generate mock inventory data if the database is empty. For production use, populate the inventory table with real data.

## Troubleshooting

If you see "database persistence will be added later" message:
1. Verify Supabase connection details in `.env`
2. Check that tables are created in your Supabase project
3. Ensure Row Level Security policies are properly configured
4. Verify authentication is working

## Security Notes

- All tables have Row Level Security (RLS) enabled
- Only authenticated users can access data
- Policies restrict access based on user authentication
- Never commit `.env` file with real credentials
