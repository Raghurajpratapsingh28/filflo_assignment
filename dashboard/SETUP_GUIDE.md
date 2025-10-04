# Inventory Management Dashboard - Setup Guide

A modern, professional web dashboard for monitoring inventory ageing and managing customer receipts.

## Features

- **Inventory Dashboard**: Real-time monitoring with KPIs, charts, and detailed tables
- **Ageing Analysis**: Visual charts showing inventory age distribution
- **Expiry Tracking**: Color-coded alerts for items near expiry
- **Advanced Filtering**: Search and filter by part numbers, dates, and more
- **Data Export**: Export to CSV and PDF formats
- **Customer Receipts**: Generate professional sales receipts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Simple Authentication**: Internal employee login with hardcoded credentials

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS (professional blue/gray palette)
- **Charts**: Recharts for interactive visualizations
- **Routing**: React Router for SPA navigation
- **Authentication**: Simple hardcoded authentication
- **Export**: jsPDF, PapaParse

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Login Credentials

Use these credentials to access the dashboard:

- **Email**: `admin@gmail.com`
- **Password**: `raghuraj`

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 6. Login

Use the credentials you created in step 4 to log in.

## Application Structure

```
src/
├── components/
│   ├── Layout/           # Header, Sidebar, Layout wrapper
│   ├── Dashboard/        # Dashboard-specific components
│   └── Receipts/         # Receipt generation components
├── context/
│   └── AuthContext.tsx   # Authentication state management
├── pages/
│   ├── LoginPage.tsx     # Login screen
│   ├── DashboardPage.tsx # Main inventory dashboard
│   └── ReceiptsPage.tsx  # Receipt generation page
├── lib/
│   └── (removed)         # Supabase configuration removed
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   ├── dateHelpers.ts    # Date calculation utilities
│   ├── exportHelpers.ts  # CSV/PDF export functions
│   └── receiptGenerator.ts # Receipt PDF generation
└── App.tsx               # Main app with routing
```

## Key Features Explained

### Dashboard Page

- **KPI Cards**: Display total stock, near-expiry percentage, average ageing, and item count
- **Filter Bar**: Multi-field filtering with date ranges and search
- **Charts**:
  - Ageing Distribution (bar chart)
  - Expiry Risk Breakdown (pie chart)
  - Quantity Trends (line chart)
- **Data Table**: Sortable, paginated inventory list with export options

### Receipts Page

- **Customer Form**: Capture customer details (name, email, phone, address)
- **Product Selection**: Searchable autocomplete for inventory items
- **Real-time Calculation**: Automatic subtotal, tax, and total computation
- **Receipt Preview**: Modal preview with print and download options
- **PDF Generation**: Professional invoice-style receipts

## Design System

### Color Palette

- **Primary**: `#1976D2` (Blue) - Buttons, accents, headers
- **Success**: `#008000` (Green) - Safe/good status
- **Warning**: `#FFD700` (Yellow) - Medium risk
- **Error**: `#FF0000` (Red) - High risk/expired items
- **Neutral**: Grays for backgrounds, text, borders

### Typography

- Font: Roboto (fallback to system fonts)
- Headings: Bold, 120% line height
- Body: Regular, 150% line height
- Maximum 3 font weights

### Spacing

- Based on 8px grid system
- Consistent padding and margins
- Responsive breakpoints

## Authentication Flow

1. User visits app → Redirected to `/login`
2. User enters credentials
3. Simple authentication validates credentials
4. On success: Redirect to `/dashboard`
5. All routes protected with `ProtectedRoute` wrapper
6. Logout clears token and redirects to `/login`

## Data Flow

### Inventory Dashboard

1. Load mock inventory data on mount
2. Apply filters (client-side for performance)
3. Calculate KPIs and chart data
4. Render visualizations
5. Export functionality uses filtered data

### Receipt Generation

1. User selects customer details
2. Search and add inventory items
3. Calculate totals (10% tax)
4. Submit → Create customer record
5. Create receipt record
6. Update inventory quantities
7. Generate and display PDF

## Mock Data

If database connection fails, the app automatically generates mock data for demonstration:

- 8 product types (oils, ghee, honey)
- 24 inventory items with realistic dates
- Varied quantities and batch numbers

## Export Features

### CSV Export

- All visible columns
- Formatted dates (DD-MM-YYYY)
- Calculated ageing and expiry days
- Downloads instantly

### PDF Export

- Professional table format
- Blue header styling
- Auto-pagination
- Timestamp and branding

## Performance Considerations

- Memoized calculations for KPIs and charts
- Client-side filtering (fast for <10k rows)
- Lazy loading for charts
- Optimized re-renders with React best practices

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Accessibility

- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- ARIA labels on interactive elements
- High contrast colors
- Screen reader friendly

## Future Enhancements

- Real-time notifications for expiring items
- Advanced analytics and reporting
- Bulk import/export functionality
- Multi-warehouse support
- Mobile app (React Native)
- Email receipt delivery
- Barcode scanning integration

## Troubleshooting

### App shows mock data instead of database data

- Check `.env` configuration
- Verify mock data is loading correctly
- Ensure authentication is working

### Login fails

- Verify credentials are correct: `admin@gmail.com` / `raghuraj`
- Check browser console for errors

### Charts not rendering

- Check browser console for errors
- Verify data is loading correctly
- Try refreshing the page

### PDF export not working

- Ensure jsPDF is installed
- Check browser console for errors
- Try with smaller datasets first

## Support

For issues or questions:
1. Check the documentation files
2. Review browser console for errors
3. Verify authentication is working
4. Check mock data loading

## License

Internal use only - Proprietary software
