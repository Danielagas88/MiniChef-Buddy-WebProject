# Express TypeScript API

A fully configured Express.js REST API with TypeScript, Mongoose, CORS, and environment variable support.

## Project Structure

```
src/
├── server.ts      # Express server setup
├── config.ts      # Environment configuration
├── db.ts          # MongoDB connection
└── routes/        # API routes (to be added)
```

## Features

- ✅ Express.js with TypeScript
- ✅ MongoDB integration with Mongoose
- ✅ CORS support
- ✅ Environment variables with dotenv
- ✅ Hot reload with nodemon
- ✅ Type safety with TypeScript strict mode

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory (already provided with defaults):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/api
NODE_ENV=development
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run type-check` - Check TypeScript types

## Getting Started

1. Ensure MongoDB is running locally or update `MONGODB_URI` in `.env`
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Server will be available at `http://localhost:3000`

## API Endpoints

- `GET /health` - Health check
- `GET /api` - Welcome message

## Adding Routes

Create route files in `src/routes/` and import them in `src/server.ts`.
