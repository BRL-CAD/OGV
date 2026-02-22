# Online Geometry Viewer (OGV)

**A Google Summer of Code (GSoC) Project**

Online Geometry Viewer is an online web application where users can upload, view, and share 3D CAD models. Users can host these models online.

## Table of Content
  - [🚀 Features](#-features)
  - [🏗️ Architecture](#️-architecture)
    - [1. Conversion Module (Backend)](#1-conversion-module-backend)
    - [2. Viewer Module (Frontend)](#2-viewer-module-frontend)
  - [📋 Prerequisites](#-prerequisites)
    - [For macOS Users](#for-macos-users)
    - [BRL-CAD Package](#brl-cad-package)
  - [🛠️ Installation \& Setup](#️-installation--setup)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Backend Setup (Conversion Module)](#2-backend-setup-conversion-module)
    - [3. Frontend Setup (Viewer Module)](#3-frontend-setup-viewer-module)
    - [4. Environment Configuration](#4-environment-configuration)
      - [Backend Environment Variables](#backend-environment-variables)
      - [Frontend Environment Variables](#frontend-environment-variables)
  - [🚀 Running the Application](#-running-the-application)
    - [Development Mode](#development-mode)
      - [Backend (Conversion Module)](#backend-conversion-module)
      - [Frontend (Viewer Module)](#frontend-viewer-module)
    - [Production Mode](#production-mode)
      - [Using Docker (Recommended for macOS)](#using-docker-recommended-for-macos)
  - [🗄️ Database](#️-database)
    - [Database Schema](#database-schema)
  - [📦 Dependencies](#-dependencies)
    - [Backend Dependencies](#backend-dependencies)
    - [Frontend Dependencies](#frontend-dependencies)
  - [🔧 Development Scripts](#-development-scripts)
    - [Backend Scripts](#backend-scripts)
    - [Frontend Scripts](#frontend-scripts)
  - [🐳 Docker Configuration](#-docker-configuration)
    - [Docker Compose Setup](#docker-compose-setup)
      - [Create docker-compose.yml](#create-docker-composeyml)
    - [Docker Commands](#docker-commands)
  - [📁 Project Structure](#-project-structure)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)
  - [🔗 Related Repositories](#-related-repositories)
  - [🆘 Troubleshooting](#-troubleshooting)
    - [Common Issues](#common-issues)
    - [Getting Help](#getting-help)

<a id="-features"></a>

## 🚀 Features

- **3D Model Upload**: Support for various CAD file formats
- **Real-time 3D Viewer**: Interactive 3D model visualization using Three.js
- **File Conversion**: Automatic conversion of CAD files to web-compatible formats
- **File Management**: Organized storage with expiration policies
- **Supported Formats**: Various CAD file formats (converted to web-compatible formats)
- **Automatic Conversion**: BRL-CAD powered geometry conversion
- **Thumbnail Generation**: Automatic preview generation for uploaded models

<a id="-architecture"></a>

## 🏗️ Architecture

This project consists of two main modules:

### 1. Conversion Module (Backend)

- **Repository**: [ogv-conversation-module](https://github.com/BRL-CAD/ogv-conversion-module)
- **Technology**: NestJS, TypeScript, Prisma, PostgreSQL
- **Purpose**: Handles file uploads, conversion, and API endpoints

### 2. Viewer Module (Frontend)

- **Repository**: [ogv-viewer-package](https://github.com/BRL-CAD/ogv-viewer)
- **Technology**: Next.js, React, Three.js, TypeScript
- **Purpose**: Provides 3D model visualization and user interface

<a id="-prerequisites"></a>

## 📋 Prerequisites

- **Node.js** (v20 or higher)
- **Yarn** package manager
- **Docker** and **Docker Compose**
- **Git**

### For macOS Users

⚠️ **Important**: On macOS, you must use Docker for the GCV (Geometry Conversion) module as BRL-CAD is not natively available for macOS.

### BRL-CAD Package

The project uses BRL-CAD for geometry conversion. For more information about BRL-CAD and installation, see the [BRL-CAD repository](https://github.com/BRL-CAD/brlcad).

<a id="-installation--setup"></a>

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd OGV
```

### 2. Backend Setup (Conversion Module)

```bash
cd backend

# Install dependencies
yarn install

# Set up environment variables
cp .env.sample .env
# Edit .env with your configuration

# Create Docker Compose configuration (since it's in .gitignore)
# ⚠️ IMPORTANT: Change the database credentials for security!
cat > docker-compose.yml << 'EOF'
services:
  OGV_DB:
    image: postgres:16
    ports:
      - 5434:5432
    environment:
      POSTGRES_USER: your_db_user        # Change this!
      POSTGRES_PASSWORD: your_secure_password  # Change this!
      POSTGRES_DB: your_db_name          # Change this!
    networks:
      - brlcad
networks:
  brlcad:
EOF

# Start PostgreSQL database using Docker
docker-compose up -d OGV_DB

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 3. Frontend Setup (Viewer Module)

```bash
cd frontend

# Install dependencies
yarn install
```

### 4. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the backend directory:

```bash
# Copy the sample environment file
cp .env.sample .env

# Edit the .env file with your actual values
nano .env  # or use your preferred editor
```

**Important**: Update the following variables in your `.env` file:

1. **Database URL** - Match your database credentials:

```env
DATABASE_URL="postgresql://your_db_user:your_secure_password@localhost:5434/your_db_name"
```

2. **Cloudinary Configuration** - Get these from your [Cloudinary Dashboard](https://cloudinary.com/console):

```env
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

**How to get Cloudinary credentials:**

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to your [Dashboard](https://cloudinary.com/console)
3. Copy the Cloud Name, API Key, and API Secret
4. Paste them in your `.env` file

#### Frontend Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
cd frontend

# Copy the sample environment file
cp .env.sample .env.local

# Edit the .env.local file with your actual values
nano .env.local  # or use your preferred editor
```

**Note**: Check the `.env.sample` files in both backend and frontend directories to see all required environment variables and their descriptions.

<a id="-running-the-application"></a>

## 🚀 Running the Application

### Development Mode

#### Backend (Conversion Module)

```bash
cd backend
yarn start:dev
```

The backend will be available at `http://localhost:3000`

#### Frontend (Viewer Module)

```bash
cd frontend
yarn dev --port 3001
```

The frontend will be available at `http://localhost:3001`

### Production Mode

#### Using Docker (Recommended for macOS)

```bash
# Build and run the entire application
docker-compose up --build
```

<a id="-database"></a>

## 🗄️ Database

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Connection**: The database runs in a Docker container
- **Port**: 5434 (mapped from container port 5432)
- **Credentials**:
  - Username: `your_db_user` (customize in docker-compose.yml)
  - Password: `your_secure_password` (customize in docker-compose.yml)
  - Database: `your_db_name` (customize in docker-compose.yml)

⚠️ **Security Note**: Always change the default database credentials in your `docker-compose.yml` file for production use!

### Database Schema

The application uses `UploadModel` table that stores:

- File metadata (title, description, category, license)
- File information (original and converted URLs, format, size)
- User data (IP address, upload timestamp)
- Status and expiration settings

<a id="-dependencies"></a>

## 📦 Dependencies

### Backend Dependencies

- **Framework**: NestJS
- **Database**: Prisma + PostgreSQL
- **File Processing**: BRL-CAD (via Docker)
- **Storage**: Cloudinary integration
- **Validation**: Class-validator, Class-transformer

### Frontend Dependencies

- **Framework**: Next.js 15
- **3D Rendering**: Three.js, React Three Fiber
- **UI**: Framer Motion, React Dropzone
- **Styling**: Sass

<a id="-development-scripts"></a>

## 🔧 Development Scripts

### Backend Scripts

```bash
yarn start:dev    # Start development server
yarn build        # Build for production
yarn test         # Run tests
yarn lint         # Run linter
yarn format       # Format code
```

### Frontend Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run linter
```

<a id="-docker-configuration"></a>

## 🐳 Docker Configuration

The project includes Docker configuration for:

- **PostgreSQL Database**: Runs on port 5434
- **Backend Application**: Includes BRL-CAD installation
- **File Storage**: Organized upload directories

### Docker Compose Setup

⚠️ **Note**: The `docker-compose.yml` file is in `.gitignore` for security reasons (contains database credentials). You need to create it manually.

#### Create docker-compose.yml

```bash
cd backend
# ⚠️ IMPORTANT: Change the database credentials for security!
cat > docker-compose.yml << 'EOF'
services:
  OGV_DB:
    image: postgres:16
    ports:
      - 5434:5432
    environment:
      POSTGRES_USER: your_db_user        # Change this!
      POSTGRES_PASSWORD: your_secure_password  # Change this!
      POSTGRES_DB: your_db_name          # Change this!
    networks:
      - brlcad
networks:
  brlcad:
EOF
```

### Docker Commands

```bash
# Start only the database
docker-compose up -d OGV_DB

# Start the entire application
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs OGV_DB
```

<a id="-project-structure"></a>

## 📁 Project Structure

```
OGV/
├── backend/                 # Conversion Module
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── services/        # Business logic
│   │   ├── upload/         # File upload handling
│   │   ├── converter/      # File conversion logic
│   │   └── prisma/         # Database configuration
│   ├── prisma/             # Database schema and migrations
│   ├── uploads/            # File storage directories
│   └── docker-compose.yml  # Database configuration
├── frontend/               # Viewer Module
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # SCSS stylesheets
│   └── public/            # Static assets
└── README.md
```

<a id="-contributing"></a>

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

<a id="-license"></a>

## 📄 License

This project is part of the Google Summer of Code program. Please refer to the LICENSE file for more information.

<a id="-related-repositories"></a>

## 🔗 Related Repositories

- [Conversion Module](https://github.com/simarjot0032/ogv-conversation-package)
- [Viewer Module](https://github.com/simarjot0032/ogv-viewer-package)

<a id="-troubleshooting"></a>

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Ensure Docker is running
   - Check if PostgreSQL container is up: `docker-compose ps`
   - Verify database credentials in `.env`

2. **File Conversion Issues (macOS)**

   - Use Docker for the backend as BRL-CAD is not available natively
   - Ensure Docker has sufficient resources allocated

3. **Port Conflicts**
   - Backend: 3000
   - Frontend: 3001 (Next.js default)
   - Database: 5434

### Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify all services are running: `docker-compose ps`
3. Ensure all dependencies are installed: `yarn install`
4. Check environment variables are properly set

---
