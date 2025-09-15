# Simple Todo List App

A simple todo list application built with React, Express, and MongoDB.

## Project Structure

```
simple-todo-list/
├── backend/          # Express.js API server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── README.md     # Backend setup instructions
├── frontend/         # React.js frontend
│   ├── public/       # Public assets
│   ├── src/          # React source code
│   └── package.json  # Frontend dependencies
└── README.md         # This file
```

## Features

- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ View todo statistics
- ✅ Responsive design
- ✅ Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp?retryWrites=true&w=majority
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

### 3. MongoDB Setup

Make sure MongoDB is running on your system:

**Local MongoDB:**
- Install MongoDB Community Edition
- Start MongoDB service
- The app will connect to `mongodb://localhost:27017/todoapp`

**MongoDB Atlas (Cloud):**
- Create a free account at https://www.mongodb.com/atlas
- Create a cluster and get your connection string
- Update the `MONGODB_URI` in your `.env` file

## Usage

1. Open your browser and go to http://localhost:3000
2. Add new todos using the input field
3. Click the checkbox to mark todos as complete
4. Click the × button to delete todos
5. View statistics at the bottom

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/health` - Health check

## Technologies Used

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS

**Frontend:**
- React.js
- Axios
- CSS3

## Development

To run both frontend and backend in development mode:

1. Start the backend:
```bash
cd backend && npm run dev
```

2. Start the frontend (in a new terminal):
```bash
cd frontend && npm start
```

## License

MIT
