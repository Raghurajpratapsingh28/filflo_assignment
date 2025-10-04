# Inventory Management Dashboard - Frontend

This is the frontend React application for the Inventory Management System. It provides a modern, responsive interface for managing inventory, generating receipts, and uploading CSV data.

## Features

- **Authentication**: Secure login with JWT tokens
- **Dashboard**: Real-time inventory KPIs and analytics
- **Inventory Management**: View and filter inventory data
- **Receipt Generation**: Create customer receipts with PDF generation
- **CSV Upload**: Bulk import inventory data from CSV files
- **User Profile**: Manage user settings and change passwords
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## API Integration

The frontend is fully integrated with the backend API and includes:

### Authentication APIs
- Login with username/password
- JWT token management
- Automatic token refresh
- Profile management
- Password change functionality

### Inventory APIs
- Real-time inventory data fetching
- Advanced filtering and search
- Dashboard KPIs and analytics
- Inventory summary for receipts
- Unique parts for dropdowns

### Receipt APIs
- Generate receipts with customer details
- PDF generation and download
- Inventory quantity updates
- Tax calculations

### File Upload APIs
- CSV file upload with validation
- Progress tracking
- Error handling and reporting

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 3000

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

### Default Login Credentials

The application uses the backend authentication system. You can use the default admin user created by the seeder:

- **Username**: `admin`
- **Password**: `admin123`

Or create a new user through the backend API.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard/       # Dashboard-specific components
│   ├── Layout/          # Layout components (Header, Sidebar)
│   ├── Receipts/        # Receipt-related components
│   └── CSVUpload.tsx    # CSV upload component
├── context/             # React context providers
│   └── AuthContext.tsx  # Authentication context
├── lib/                 # Utility libraries
│   └── api.ts          # API service layer
├── pages/               # Page components
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── ProfilePage.tsx
│   ├── ReceiptsPage.tsx
│   └── UploadPage.tsx
├── types/               # TypeScript type definitions
│   └── index.ts
└── utils/               # Utility functions
    ├── dateHelpers.ts
    ├── exportHelpers.ts
    └── receiptGenerator.ts
```

## API Service Layer

The `lib/api.ts` file contains a comprehensive API service layer that:

- Handles HTTP requests with axios
- Manages JWT tokens automatically
- Provides type-safe interfaces
- Includes error handling and retry logic
- Supports file uploads

## Key Components

### DashboardPage
- Fetches real-time KPIs from backend
- Displays inventory analytics and charts
- Supports filtering and search
- Shows ageing and expiry risk data

### ReceiptsPage
- Uses inventory summary API for product selection
- Generates receipts with backend validation
- Handles PDF generation and download
- Updates inventory quantities automatically

### UploadPage
- Drag-and-drop CSV file upload
- Real-time upload progress
- Error handling and validation
- Success/failure reporting

### ProfilePage
- User profile management
- Password change functionality
- Role management (admin/user)
- Form validation and error handling

## Error Handling

The application includes comprehensive error handling:

- API error responses with user-friendly messages
- Network error handling with retry options
- Form validation with real-time feedback
- Loading states and progress indicators
- Graceful fallbacks for failed requests

## Security Features

- JWT token-based authentication
- Automatic token refresh
- Secure password handling
- Protected routes
- Input validation and sanitization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Tailwind CSS for styling

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend is running on port 3000
   - Check VITE_API_URL in .env file
   - Verify CORS settings in backend

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check if JWT token is expired
   - Verify backend authentication is working

3. **CSV Upload Issues**
   - Ensure CSV format matches expected columns
   - Check file size limits
   - Verify backend upload endpoint is working

### Debug Mode

Enable debug mode by setting `VITE_DEBUG=true` in your `.env` file to see detailed API logs in the browser console.

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Include error handling for API calls
4. Test on multiple browsers
5. Update documentation for new features

## License

This project is part of the Inventory Management System and is for internal use only.
