# Project Structure

```
client/src/
├── components/              # Reusable UI components
│   ├── Layout/             # Layout wrapper component
│   │   └── Layout.jsx
│   ├── UI/                # UI components
│   │   ├── Loading/       # Loading spinner component
│   │   │   └── Loading.jsx
│   │   ├── Navbar/        # Navigation component
│   │   └── Footer/        # Footer component
│   └── index.js           # Component exports
├── pages/                 # Page components
│   ├── Home/              # Home page
│   │   └── Home.jsx
│   └── index.js           # Page exports
├── hooks/                 # Custom React hooks
│   ├── useImageUpload.js  # Image upload hook
│   └── useTextExtraction.js # Text extraction hook
├── services/              # API services
│   └── api.js             # Axios configuration and API calls
├── utils/                 # Utility functions
│   └── colorUtils.js      # Color calculation utilities
├── constants/             # Application constants
│   └── index.js           # Constants file
├── assets/                # Static assets
├── App.jsx               # Main app component with routing
├── main.jsx              # Application entry point
└── index.css             # Global styles
```

## Key Improvements

### 1. **Separation of Concerns**
- **Components**: Reusable UI elements
- **Pages**: Route-specific components
- **Hooks**: Business logic and state management
- **Services**: API communication layer
- **Utils**: Pure utility functions
- **Constants**: Configuration and constants

### 2. **Custom Hooks**
- `useImageUpload`: Handles image upload logic with loading states
- `useTextExtraction`: Manages text extraction from images

### 3. **Service Layer**
- Centralized API configuration
- Reusable API methods
- Error handling built-in

### 4. **Utility Functions**
- Color calculations separated from components
- Reusable across the application
- Easy to test

### 5. **Environment Configuration**
- Separate configs for development and production
- Environment variables for API URLs and feature flags

### 6. **Better Imports**
- Index files for clean imports
- Barrel exports for better organization

## Development Workflow

1. **Adding New Pages**: Create in `pages/` directory
2. **Adding Components**: Create in `components/` directory
3. **Adding Hooks**: Create in `hooks/` directory
4. **API Calls**: Use service layer
5. **Utilities**: Add to `utils/` directory
6. **Constants**: Add to `constants/` directory

## Production Ready Features

- ✅ Environment configuration
- ✅ Error boundaries (can be added)
- ✅ Service layer for API calls
- ✅ Custom hooks for state management
- ✅ Utility functions for business logic
- ✅ Component organization
- ✅ Lazy loading with Suspense
- ✅ Clean import structure
