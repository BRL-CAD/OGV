**OGV Frontend**

This is the frontend application for the Online Geometry Viewer (OGV) project. It provides a modern web interface for uploading, viewing, and managing 3D CAD models with real-time 3D visualization.

> 📖 **For complete setup instructions, API documentation, and project overview, see the [main README](../README.md)**

## Table of Contents
- [Project Setup Guide](#project-setup-guide)
- [Key Features](#key-features)
- [Pages & Routes](#pages--routes)
- [Key Components](#key-components)
- [Development Rules & Guidelines](#development-rules--guidelines)
- [Getting Started](#getting-started)

## Project Setup Guide

### Prerequisites
- Node.js (LTS recommended)
- Yarn package manager

### Install Dependencies
```bash
yarn install
```

### Sample Environment File
```bash
cp .env.sample .env
```

Required keys in `frontend/.env`:
- `NEXT_PUBLIC_BACKEND_URL` - Backend converter endpoint (e.g. `http://localhost:3000/converter/upload`)
- `NEXT_PUBLIC_UPLOAD_URL` - Upload API endpoint (e.g. `http://localhost:3000/upload/model/`)
- `NEXT_PUBLIC_GET_ALL_MODELS_URL` - Models listing endpoint (e.g. `http://localhost:3000/model/`)

### Environment Configuration
- Create a `.env` file in `frontend/` if your local setup requires it.
- Add any required frontend environment variables (see the main README for full configuration).

### Run the App
```bash
# development
yarn dev --port 3001
```

### Build and Start (Production)
```bash
yarn build
yarn start --port 3001
```

### Key Features:
- **3D Model Viewer**: Interactive 3D model visualization using Three.js
- **File Upload Interface**: Drag-and-drop file upload with progress tracking
- **Model Gallery**: Browse and explore uploaded 3D models
- **Responsive Design**: Modern UI with mobile-friendly interface
- **Real-time Updates**: Live model loading and conversion status

## Pages & Routes

- **`/`** - Home page (redirects to dashboard)
- **`/dashboard`** - Main dashboard (redirects to upload)
- **`/dashboard/upload`** - File upload interface
- **`/dashboard/explore`** - Browse uploaded models
- **`/dashboard/modelviewer/[id]`** - 3D model viewer page

## Key Components

- **FileUpload** - Drag-and-drop file upload component
- **ModelCard** - Model preview card component
- **ModelPreviewModal** - Modal for model preview
- **SearchBar** - Model search functionality
- **Navbar** - Navigation component
- **Sidebar** - Dashboard sidebar navigation

## Development Rules & Guidelines

### Code Standards:
- **TypeScript**: Use TypeScript for all components and functions
- **Component Structure**: Use functional components with hooks
- **Styling**: Use SCSS modules for component-specific styles
- **SCSS Variables**: Use common variables from `/src/styles/_Variables.scss`
- **SCSS Mixins**: Use common mixins from `/src/styles/_Mixins.scss`
- **Naming**: Use PascalCase for components, camelCase for functions
- **Props**: Define proper TypeScript interfaces for all props

### TypeScript Best Practices:
- **Interface Definition**: Always define interfaces for component props
- **Optional Props**: Use `?` for optional props with default values
- **Union Types**: Use union types for variant props (e.g., `'primary' | 'secondary'`)
- **Generic Types**: Use generics for reusable components
- **Event Handlers**: Type event handlers properly (e.g., `React.MouseEvent<HTMLButtonElement>`)
- **Ref Types**: Use proper ref types for DOM elements
- **Children Props**: Use `React.ReactNode` for children props

### File Organization:
- **Components**: Place in `/src/components/` directory
- **Reusable Components**: Place common/reusable components in `/src/components/common/`
- **Icons**: SVG icons in `/src/icons/` directory with `.icon.tsx` suffix
- **Pages**: Use Next.js App Router structure in `/src/app/`
- **Hooks**: Custom hooks in `/src/hooks/` directory
- **Utils**: Utility functions in `/src/utils/` directory
- **Types**: TypeScript interfaces in `/src/types/` directory
- **Styles**: SCSS files in `/src/styles/`

### SCSS Guidelines:
- **Variables**: Use common variables from `/src/styles/_Variables.scss`
- **Mixins**: Use common mixins from `/src/styles/_Mixins.scss` (e.g., `minmax`, `flexbox`, `grid`)
- **Component Styles**: Create component-specific SCSS files
- **Import Order**: Import variables and mixins first, then component styles
- **Naming Convention**: Use kebab-case for SCSS class names
- **Responsive Design**: Use mixins for consistent breakpoints

#### Available SCSS Variables:
```scss
// Colors
$primary-color: #your-primary-color;
$secondary-color: #your-secondary-color;
$background-color: #your-bg-color;

// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

// Typography
$font-family-primary: 'Your-Font', sans-serif;
$font-size-sm: 0.875rem;
$font-size-md: 1rem;
$font-size-lg: 1.125rem;

// Border radius
$border-radius: 0.375rem;
$border-radius-lg: 0.5rem;
```

#### Available SCSS Mixins:
```scss
// Layout mixins
@include minmax(320px, 1200px);        // Container with min/max width
@include flexbox(center, center);       // Flexbox with justify/align
@include grid(3, 1fr, 1rem);           // CSS Grid with columns, gap

// Responsive mixins
@include mobile { /* mobile styles */ }
@include tablet { /* tablet styles */ }
@include desktop { /* desktop styles */ }

// Utility mixins
@include button-reset;                   // Reset button styles
@include visually-hidden;               // Hide element visually
@include focus-visible;                 // Focus styles for accessibility
```

#### SCSS Usage Example:
```scss
// Component SCSS file
@import '../styles/Variables';
@import '../styles/Mixins';

.my-component {
  // Use common variables
  color: $primary-color;
  background: $secondary-bg;
  
  // Use common mixins
  @include minmax(320px, 1200px);
  @include flexbox(center, center);
  
  // Component-specific styles
  padding: $spacing-md;
  border-radius: $border-radius;
  
  // Responsive design
  @include mobile {
    padding: $spacing-sm;
  }
}
```

### Icon Guidelines:
- **SVG Icons**: Use SVG format for all icons for scalability and performance
- **File Naming**: Name icon files with `.icon.tsx` suffix (e.g., `home.icon.tsx`)
- **Icon Directory**: Place all icons in `/src/icons/` directory
- **Props Interface**: Define consistent props interface for all icons
- **Default Props**: Provide sensible defaults for size, color, and other properties
- **Export Pattern**: Use named exports and add to `/src/icons/index.ts`

#### Icon Component Structure:
```typescript
import IconProps from "./"

export const HomeIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  className = '',
  onClick
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      onClick={onClick}
    >
      {/* SVG path data */}
    </svg>
  );
};
```

#### Using Icons in Components:
```typescript
// Import from icons directory
import { HomeIcon, SearchIcon } from '@/icons';

// Use in component
const MyComponent = () => {
  return (
    <div>
      <HomeIcon width={32} height={32} color="#333" />
      <SearchIcon 
        width={20} 
        height={20} 
        color="blue" 
        onClick={() => console.log('Search clicked')}
      />
    </div>
  );
};
```

### Reusable Components Guidelines:
- **Identify Reusability**: If a component is used in multiple places, move it to `/src/components/common/`
- **Props Interface**: Always define proper TypeScript interfaces for component props
- **Generic Components**: Create generic, configurable components that can be reused
- **Documentation**: Document props and usage examples for reusable components
- **Export Pattern**: Use proper export patterns for common components

#### Example Reusable Component Structure:
```typescript
// /src/components/common/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = ''
}) => {
  // Component implementation
};
```

### SCSS Development Guidelines:
- **Use Common Variables**: Always use variables from `_Variables.scss` for colors, spacing, fonts
- **Use Common Mixins**: Leverage mixins from `_Mixins.scss` for consistent patterns
- **Available Mixins**: `minmax`, `flexbox`, `grid`, `mobile`, `tablet`, `desktop`
- **Component Styles**: Create separate SCSS files for each component
- **Import Structure**: Import variables and mixins at the top of each SCSS file
- **Responsive Design**: Use breakpoint mixins for consistent responsive behavior
- **Nesting**: Keep nesting levels shallow (max 3 levels)
- **BEM Methodology**: Use BEM naming convention for complex components

### Utilities Guidelines:
- **Utility Functions**: Create reusable utility functions in `/src/utils/`
- **Pure Functions**: Keep utilities pure (no side effects)
- **TypeScript**: Use proper TypeScript typing for all utilities
- **Documentation**: Document utility functions with JSDoc
- **Naming**: Use descriptive names for utility functions

### Types Guidelines:
- **Interface Definition**: Define clear interfaces for all data structures
- **Type Exports**: Export types from `/src/types/index.ts`
- **Generic Types**: Use generics for reusable type definitions
- **Union Types**: Use union types for variant data
- **Type Guards**: Create type guard functions for runtime type checking

### Custom Hooks Guidelines:
- **Hook Naming**: Use `use` prefix for all custom hooks
- **Single Responsibility**: Each hook should have a single responsibility
- **TypeScript**: Use proper TypeScript typing for hooks
- **Return Types**: Define clear return types for hooks
- **Dependencies**: Use proper dependency arrays in useEffect

### Icon Development Workflow:
1. **Create SVG File**: Design or obtain SVG icon
2. **Create Icon Component**: Convert SVG to React component in `/src/icons/`
3. **Add Props Interface**: Define consistent `IconProps` interface
4. **Implement Component**: Use proper TypeScript typing
5. **Add to Index**: Export from `/src/icons/index.ts`
6. **Document**: Add usage examples if complex

### Component Development Workflow:
1. **Identify Reusability**: Before creating a component, check if it will be used in multiple places
2. **Create Interface**: Define TypeScript interface for props first
3. **Implement Component**: Build the component with proper typing
4. **Props**: Ensure all props work correctly with different configurations
5. **Move to Common**: If reusable, move to `/src/components/common/`
6. **Export Properly**: Use named exports and add to index file
7. **Document Usage**: Add JSDoc comments for complex props

### 3D Rendering Guidelines:
- **Three.js**: Use React Three Fiber for 3D components
- **Performance**: Implement proper cleanup for Three.js objects
- **Loading**: Show loading states for model conversion
- **Error Handling**: Graceful fallbacks for failed model loads
- **Reusable 3D Components**: Create reusable 3D components in `/src/components/common/` for consistent 3D interactions

## Getting Started

First, run the development server:

```bash
yarn dev --port 3001
```

> 📖 **For complete setup instructions, environment configuration, and database setup, see the [main README](../README.md)**
