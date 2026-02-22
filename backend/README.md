**OGV Backend**

This is the backend service for the Online Geometry Viewer (OGV) project. It handles file uploads, 3D model conversion using BRL-CAD, and provides REST API endpoints for the frontend application.

## Table of Contents
  - [Install dependencies](#install-dependencies)
  - [Environment variables](#environment-variables)
  - [Database (Prisma + Postgres)](#database-prisma--postgres)
  - [Run the backend](#run-the-backend)
- [API Endpoints](#api-endpoints)
- [Development Rules & Guidelines](#development-rules--guidelines)
- [Project setup (existing)](#project-setup)
- [Compile and run the project](#compile-and-run-the-project)

### Install dependencies

```bash
cd backend
yarn install
```

### Environment variables

```bash
cd backend
cp .env.sample .env
```

At minimum, set:

- `DATABASE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Sample `.env` keys (from `.env.sample`):
- `DATABASE_URL` - Postgres connection string
- `CLOUDINARY_CLOUD_NAME` - Cloudinary account name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `UPLOAD_BASE_PATH` - Base storage directory for uploads
- `UPLOAD_API_PATH` - Public API path for uploaded files
- `RAW_FILES_PATH` - Local path for raw uploaded files
- `CONVERTED_TO_OBJ_PATH` - Local path for converted OBJ files
- `THUMBNAIL_PATH` - Local path for generated thumbnails
- `CONVERSION_API_PATH` - Public API path for converted files
- `CONVERTER_INPUT_PATH` - Local path used as converter input
- `CONVERTER_OUTPUT_PATH` - Local path used as converter output
- `TEMP_FILES_PATH` - Local path for temporary files

### Database (Prisma + Postgres)

With Postgres running and `DATABASE_URL` configured:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Run the backend

```bash
cd backend
yarn start:dev
```

> 📖 **For complete setup instructions, environment configuration, and database setup, see the [main README](../README.md)**

### Key Features:
- **File Upload & Storage**: Handles 3D model file uploads with Cloudinary integration
- **Geometry Conversion**: Converts CAD files to web-compatible formats using BRL-CAD
- **Database Management**: PostgreSQL database with Prisma ORM
- **API Endpoints**: RESTful API for model management and conversion
- **File Expiration**: Automatic cleanup of expired files

## API Endpoints

### Model Management
- `GET /model/` - Get all uploaded models
- `GET /model/:id` - Get specific model by ID

### File Upload & Conversion
- `POST /upload/model/` - Upload 3D model files
- `POST /converter/upload` - Convert uploaded files



## Development Rules & Guidelines

### Code Standards:
- **TypeScript**: Use TypeScript for all services, controllers, and DTOs
- **NestJS Patterns**: Follow NestJS decorators and dependency injection
- **Error Handling**: Use proper HTTP exceptions and status codes
- **Validation**: Use class-validator for DTO validation
- **Naming**: Use camelCase for methods, PascalCase for classes
- **File Organization**: Follow NestJS module structure and naming conventions
- **Environment Variables**: Use proper environment configuration with validation
- **Utilities**: Create reusable utility functions in `/src/utils/`
- **Types**: Define proper TypeScript interfaces and types
- **Constants**: Use constants for magic numbers and strings

### API Design:
- **RESTful**: Follow REST conventions for endpoints
- **Response Format**: Consistent JSON response structure
- **Error Responses**: Standardized error response format
- **Status Codes**: Use appropriate HTTP status codes
- **Documentation**: Document all endpoints and DTOs

### Database Guidelines:
- **Prisma**: Use Prisma for all database operations
- **Migrations**: Create migrations for schema changes
- **Relations**: Define proper model relationships
- **Validation**: Validate data before database operations

### File Handling:
- **Upload Validation**: Validate file types and sizes
- **Storage**: Use Cloudinary for file storage
- **Cleanup**: Implement proper file cleanup for expired files
- **Security**: Validate and sanitize uploaded files

### NestJS Development Guidelines:
- **Module Structure**: Organize code into logical modules (controllers, services, DTOs)
- **Dependency Injection**: Use constructor injection for services
- **Decorators**: Use appropriate decorators (@Controller, @Service, @Injectable)
- **Guards**: Implement authentication and authorization guards
- **Interceptors**: Use interceptors for logging, transformation, and caching
- **Pipes**: Use pipes for validation and transformation
- **Filters**: Implement exception filters for error handling

### Database Development Guidelines:
- **Prisma Schema**: Keep schema organized and well-documented
- **Migrations**: Create migrations for all schema changes
- **Relations**: Define proper model relationships
- **Queries**: Use Prisma client for all database operations
- **Transactions**: Use transactions for complex operations
- **Indexing**: Add proper database indexes for performance

### API Response Standards:
- **Success Response**: Consistent structure for successful responses
- **Error Response**: Standardized error response format
- **Status Codes**: Use appropriate HTTP status codes
- **Pagination**: Implement pagination for list endpoints
- **Filtering**: Add filtering and sorting capabilities
- **Documentation**: Document all endpoints with Swagger/OpenAPI

#### Example API Response Structure:
```typescript
// Success Response
{
  success: true,
  data: T,
  message?: string,
  meta?: {
    pagination?: PaginationMeta,
    timestamp: string
  }
}

// Error Response
{
  success: false,
  error: string,
  statusCode: number,
  timestamp: string,
  path: string
}
```

#### Example Service Structure:
```typescript
// service.ts
@Injectable()
export class ModelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService
  ) {}

  async getAllUploads(): Promise<ApiResponse<UploadModel[]>> {
    try {
      const models = await this.prisma.uploadModel.findMany({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' }
      });
      
      return {
        success: true,
        data: models
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch models'
      };
    }
  }
}
```

#### Example Controller Structure:
```typescript
// controller.ts
@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUploads() {
    const result = await this.modelService.getAllUploads();
    
    if (!result.success) {
      throw new HttpException(
        { success: false, error: result.error },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    
    return result;
  }
}
```

#### Example DTO Structure:
```typescript
// dto.ts
export class CreateModelDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['active', 'inactive'])
  status: string;

  @IsInt()
  @Min(1)
  @Max(365)
  expiresIn: number;
}
```

### Backend Development Workflow:
1. **Create Module**: Start with module structure (controller, service, DTOs)
2. **Define DTOs**: Create Data Transfer Objects with validation
3. **Implement Service**: Add business logic in service layer
4. **Create Controller**: Implement API endpoints in controller
5. **Add Validation**: Use class-validator for input validation
6. **Error Handling**: Implement proper error handling and HTTP exceptions
7. **Documentation**: Document endpoints and add Swagger decorators

### Environment Configuration:
- **Environment Variables**: Use proper environment configuration
- **Validation**: Validate environment variables on startup
- **Secrets**: Never commit secrets to version control
- **Configuration**: Use configuration service

### Utilities Guidelines:
- **Utility Functions**: Create reusable utility functions in `/src/utils/`
- **Pure Functions**: Keep utilities pure (no side effects)
- **TypeScript**: Use proper TypeScript typing for all utilities
- **Documentation**: Document utility functions with JSDoc if the function is too complex
- **Naming**: Use descriptive names for utility functions

### Types Guidelines:
- **Interface Definition**: Define clear interfaces for all data structures
- **Type Exports**: Export types from `/src/types/index.ts`
- **Generic Types**: Use generics for reusable type definitions
- **Union Types**: Use union types for variant data
- **Type Guards**: Create type guard functions for runtime type checking

### Constants Guidelines:
- **Magic Numbers**: Replace magic numbers with named constants
- **String Constants**: Use constants for repeated strings
- **Configuration**: Use constants for configuration values
- **Enums**: Use enums for related constants
- **Export**: Export constants from `/src/constants/index.ts`

## Project setup

```bash
$ yarn install
```

> 📖 **For complete setup instructions, environment configuration, and database setup, see the [main README](../README.md)**

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```