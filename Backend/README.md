# SkillSurge Backend API

This is the backend API for SkillSurge, a learning platform that manages courses, user authentication, and course purchases. The API is built with Express and TypeScript, using MongoDB as the database.

## Technologies Used

- **Express**: Web framework for Node.js
- **TypeScript**: For type-safe code
- **MongoDB & Mongoose**: For database storage and modeling
- **JWT**: For authentication and authorization
- **Cors**: For handling cross-origin requests

## API Endpoints

### Authentication

- **POST /users/signup**: Register a new user
- **POST /users/login**: Authenticate a user
- **POST /admin/signup**: Register a new admin
- **POST /admin/login**: Authenticate an admin

### Courses

- **GET /courses**: Get all available courses
- **POST /admin/courses**: Create a new course (admin only)
- **GET /admin/courses**: Get all courses (admin only)

### User Course Management

- **POST /users/courses/:courseId**: Purchase a course
- **GET /users/courses**: Get user's purchased courses

## Database Models

- **User**: Stores user information and purchased courses
- **Admin**: Stores admin credentials
- **Course**: Stores course details

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up MongoDB:
   - Ensure MongoDB is installed and running
   - Update the connection string in index.ts if needed

3. Start the server:
   ```bash
   npm start
   ```

The server will run on http://localhost:3000 by default.

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
```

## Development

```bash
# Start in development mode with auto-reloading
npm run dev
```

## Production

```bash
# Build for production
npm run build

# Start the production server
npm start
``` 
