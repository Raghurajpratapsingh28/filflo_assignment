# 🎨 FilFlo Dashboard - Frontend Application

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Modern React dashboard for inventory management and receipt generation**

</div>

---

## 🎯 Overview

The FilFlo Dashboard is a modern, responsive React application built with TypeScript that provides an intuitive interface for managing inventory, generating receipts, and monitoring business metrics. It features a clean, professional design with real-time data visualization and role-based access control.

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure Login System** - JWT-based authentication
- **Role-based Access** - Manager and Employee roles with different permissions
- **Protected Routes** - Automatic redirection for unauthorized access
- **Session Management** - Persistent login state with token refresh

### 📊 Interactive Dashboard
- **Real-time KPIs** - Live inventory metrics and ageing statistics
- **Interactive Charts** - Ageing distribution and expiry risk visualization using Recharts
- **Advanced Filtering** - Multi-criteria filtering with real-time updates
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### 📦 Inventory Management
- **Data Visualization** - Comprehensive inventory tables with sorting and pagination
- **CSV Upload Interface** - Drag-and-drop file upload with progress indicators
- **Search & Filter** - Advanced search across all inventory fields
- **Export Functionality** - Download inventory data as CSV files

### 📄 Receipt Generation
- **Professional Receipts** - Generate PDF receipts with company branding
- **Customer Management** - Store and manage customer information
- **Tax Calculations** - Automatic tax computation with customizable rates
- **Receipt Preview** - Real-time preview before generation

### 👥 Employee Management (Manager Only)
- **User Creation** - Create new employee accounts with role assignment
- **Account Management** - Update and delete employee profiles
- **Role Assignment** - Assign appropriate roles and permissions

### 🎨 User Interface
- **Modern Design** - Clean, professional interface with Tailwind CSS
- **Responsive Layout** - Adaptive design for all screen sizes
- **Interactive Components** - Smooth animations and transitions
- **Accessibility** - WCAG compliant with keyboard navigation support

## 🛠️ Tech Stack

### Core Technologies
- **React 18** - Modern React with hooks and functional components
- **TypeScript 5** - Type-safe development with strict typing
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing and navigation

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Custom Components** - Reusable, accessible UI components

### Data Visualization
- **Recharts** - Composable charting library for React
- **Interactive Charts** - Bar charts, pie charts, and line graphs
- **Real-time Updates** - Live data visualization

### PDF Generation
- **jsPDF** - Client-side PDF generation
- **jsPDF AutoTable** - Table generation for PDFs
- **Custom Templates** - Professional receipt layouts

### HTTP & State Management
- **Axios** - HTTP client for API communication
- **React Context** - Global state management for auth and UI
- **Custom Hooks** - Reusable logic for data fetching and state

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript Compiler** - Type checking and compilation
- **Vite Dev Server** - Hot module replacement and fast builds

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Modern Browser** - Chrome, Firefox, Safari, or Edge

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/filflo.git
cd filflo/dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the dashboard directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=FilFlo Dashboard
VITE_APP_VERSION=1.0.0
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## 🏃‍♂️ Available Scripts

### Development
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Type checking
npm run typecheck
```

## 📁 Project Structure

```
dashboard/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Dashboard/     # Dashboard-specific components
│   │   ├── EmployeeManagement/ # Employee management components
│   │   ├── Layout/        # Layout components (Header, Sidebar)
│   │   └── Receipts/      # Receipt generation components
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── SidebarContext.tsx # UI state management
│   ├── lib/               # Utility libraries
│   │   └── api.ts         # API service layer
│   ├── pages/             # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ReceiptsPage.tsx
│   │   └── UploadPage.tsx
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── dateHelpers.ts
│   │   ├── exportHelpers.ts
│   │   └── receiptGenerator.ts
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── dist/                  # Production build output
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🎨 Component Architecture

### Layout Components
- **Layout.tsx** - Main application layout wrapper
- **Header.tsx** - Top navigation bar with user menu
- **Sidebar.tsx** - Collapsible navigation sidebar

### Dashboard Components
- **KPICard.tsx** - Metric display cards
- **FilterBar.tsx** - Advanced filtering interface
- **Charts.tsx** - Data visualization components
- **InventoryTable.tsx** - Inventory data table

### Authentication Components
- **ProtectedRoute.tsx** - Route protection wrapper
- **RoleProtectedRoute.tsx** - Role-based route protection
- **LoginPage.tsx** - User authentication interface

### Receipt Components
- **ReceiptForm.tsx** - Receipt generation form
- **ReceiptPreview.tsx** - Receipt preview component

## 🔧 Configuration

### Tailwind CSS Configuration

The project uses Tailwind CSS with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',
        secondary: '#424242',
      },
    },
  },
  plugins: [],
}
```

### TypeScript Configuration

Strict TypeScript configuration for type safety:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 🎯 Key Features Implementation

### Authentication Flow

```typescript
// AuthContext.tsx
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (username: string, password: string) => {
    const response = await apiService.login(username, password);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Data Fetching with Custom Hooks

```typescript
// Custom hook for inventory data
const useInventory = (filters: InventoryFilters) => {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await apiService.getInventory(filters);
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return { data, loading, error };
};
```

### PDF Generation

```typescript
// receiptGenerator.ts
export const generateReceiptPDF = (receiptData: ReceiptData): string => {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.text('FilFlo Inventory Management', 20, 30);
  
  // Add customer information
  doc.setFontSize(12);
  doc.text(`Customer: ${receiptData.customer.name}`, 20, 50);
  
  // Add items table
  const tableData = receiptData.items.map(item => [
    item.jwl_part,
    item.description,
    item.qty.toString(),
    `$${item.price.toFixed(2)}`
  ]);
  
  autoTable(doc, {
    head: [['Part Number', 'Description', 'Quantity', 'Price']],
    body: tableData,
    startY: 70,
  });
  
  return doc.output('datauristring');
};
```

## 🧪 Testing

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Manual Testing Checklist
- [ ] Login/logout functionality
- [ ] Role-based access control
- [ ] Dashboard data loading
- [ ] Inventory filtering and search
- [ ] CSV file upload
- [ ] Receipt generation
- [ ] Employee management (Manager role)
- [ ] Responsive design on different screen sizes

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=FilFlo Dashboard
VITE_APP_VERSION=1.0.0
```

### Deployment Options

1. **Static Hosting** (Vercel, Netlify, GitHub Pages)
2. **CDN Deployment** (AWS CloudFront, Cloudflare)
3. **Server Deployment** (Nginx, Apache)

### Vercel Deployment

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all components
- Follow React functional component patterns
- Use custom hooks for reusable logic
- Implement proper error handling
- Write meaningful component and function names

### Component Structure
```typescript
// Component template
interface ComponentProps {
  // Define props interface
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // State and hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Event handlers
  const handleEvent = () => {
    // Event logic
  };
  
  // Render
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default Component;
```

### State Management
- Use React Context for global state
- Use local state for component-specific data
- Implement proper loading and error states
- Use custom hooks for complex state logic

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript errors: `npm run typecheck`
   - Verify all imports are correct
   - Ensure all dependencies are installed

2. **API Connection Issues**
   - Verify backend server is running
   - Check CORS configuration
   - Validate API base URL in environment variables

3. **Authentication Problems**
   - Check JWT token validity
   - Verify token storage in localStorage
   - Ensure proper logout on token expiry

### Debug Mode

Enable debug logging by setting:
```env
VITE_DEBUG=true
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Recharts Documentation](https://recharts.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

</div>