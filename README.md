# NestJS TODO Application

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A modern TODO application built with <a href="http://nestjs.com/" target="_blank">NestJS</a>, <a href="https://www.mongodb.com/" target="_blank">MongoDB</a>, and <a href="https://www.docker.com/" target="_blank">Docker</a>.</p>

## 🚀 Features

- ✅ Create, read, update, and delete TODO items
- 🔍 Filter TODOs by completion status (complete/incomplete)
- 🐳 Docker containerization for easy deployment
- 🗄️ MongoDB database integration
- 🧪 Comprehensive testing suite
- 📝 Input validation and error handling
- 🔧 Environment-based configuration

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest
- **Validation**: Class Validator

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (optional, for cloud database)

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd NestJS-todo-app
   ```

2. **Configure Environment Variables**
   
   Update the `MONGO_URI` in `docker-compose.yml` with your MongoDB Atlas connection string:
   ```yaml
   environment:
     - MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**
   - API: http://localhost:3000
   - MongoDB: localhost:27017 (if using local MongoDB)

### Option 2: Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/todo-app
   PORT=3000
   ```

3. **Start MongoDB**
   
   **Option A: Using Docker**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```
   
   **Option B: Local Installation**
   ```bash
   # macOS
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb/brew/mongodb-community
   ```

4. **Run the Application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Create a TODO
```http
POST /todos
Content-Type: application/json

{
  "title": "Learn NestJS",
  "completed": false
}
```

**Response:**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "title": "Learn NestJS",
  "completed": false,
  "__v": 0
}
```

#### 2. Get All TODOs
```http
GET /todos
```

**Query Parameters:**
- `status` (optional): Filter by completion status
  - `complete`: Returns only completed TODOs
  - `incomplete`: Returns only incomplete TODOs

**Examples:**
```http
GET /todos                    # Get all TODOs
GET /todos?status=complete    # Get only completed TODOs
GET /todos?status=incomplete  # Get only incomplete TODOs
```

**Response:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Learn NestJS",
    "completed": false,
    "__v": 0
  }
]
```

#### 3. Get TODO by ID
```http
GET /todos/:id
```

**Response:**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "title": "Learn NestJS",
  "completed": false,
  "__v": 0
}
```

#### 4. Update TODO
```http
PUT /todos/:id
Content-Type: application/json

{
  "title": "Learn NestJS Advanced",
  "completed": true
}
```

**Response:**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "title": "Learn NestJS Advanced",
  "completed": true,
  "__v": 0
}
```

#### 5. Delete TODO
```http
DELETE /todos/:id
```

**Response:**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "title": "Learn NestJS Advanced",
  "completed": true,
  "__v": 0
}
```

### Error Responses

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Todo with id 64f1a2b3c4d5e6f7g8h9i0j1 not found",
  "error": "Not Found"
}
```

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty"
  ],
  "error": "Bad Request"
}
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Debug tests
npm run test:debug
```

### Test Structure
- **Unit Tests**: `*.spec.ts` files
- **E2E Tests**: `test/` directory
- **Integration Tests**: Service integration tests

## 🏗️ Project Structure

```
src/
├── config/
│   └── env.config.ts          # Environment configuration
├── todo/
│   ├── controller/
│   │   ├── todo.controller.ts  # TODO endpoints
│   │   └── todo.controller.spec.ts
│   ├── dto/
│   │   ├── create-todo.dto.ts   # Create TODO validation
│   │   └── update-todo.dto.ts   # Update TODO validation
│   ├── module/
│   │   └── todo.module.ts       # TODO module configuration
│   ├── schema/
│   │   └── todo.schema.ts       # MongoDB schema
│   ├── service/
│   │   ├── todo.service.ts      # Business logic
│   │   └── todo.service.spec.ts
│   └── test/
│       └── todo.integration.spec.ts
├── app.controller.ts            # App controller
├── app.module.ts               # Root module
├── app.service.ts              # App service
└── main.ts                     # Application entry point
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/todo-app` |
| `PORT` | Application port | `3000` |

### Docker Configuration

The application uses Docker Compose with two services:

- **app**: NestJS application
- **mongo**: MongoDB database

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Production Considerations
- Set up proper MongoDB Atlas cluster
- Configure environment variables securely
- Enable HTTPS in production
- Set up monitoring and logging
- Configure backup strategies

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode with watch
npm run start:debug        # Start in debug mode

# Building
npm run build              # Build the application
npm run start:prod         # Start production build

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Run tests with coverage
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
MongoParseError: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"
```

**Solution**: Ensure your `MONGO_URI` environment variable is properly set with a valid MongoDB connection string.

#### 2. Docker Connection Refused
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: When using Docker, make sure to use the service name (`mongo:27017`) instead of `localhost:27017`.

#### 3. Dependency Injection Error
```
UnknownDependenciesException: Nest can't resolve dependencies of the TodoService (?)
```

**Solution**: Ensure that `TodoModule` is properly imported in `AppModule` and that services are not duplicated.

### Debug Commands

```bash
# Check Docker containers
docker ps

# View application logs
docker-compose logs -f app

# View MongoDB logs
docker-compose logs -f mongo

# Check environment variables
docker-compose exec app env | grep MONGO
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Docker](https://www.docker.com/) - Containerization platform
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [Issues](https://github.com/your-username/NestJS-todo-app/issues)
3. Create a new issue with detailed information
4. Join the [NestJS Discord](https://discord.gg/G7Qnnhy) community

---

<p align="center">
  Made with ❤️ using NestJS
</p>
