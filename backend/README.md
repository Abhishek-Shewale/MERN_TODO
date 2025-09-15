# Todo Backend

Simple Todo List Backend with Express and MongoDB

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your system

3. Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp?retryWrites=true&w=majority
```

4. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

- GET `/api/todos` - Get all todos
- POST `/api/todos` - Create a new todo
- PUT `/api/todos/:id` - Update a todo
- DELETE `/api/todos/:id` - Delete a todo
- GET `/api/health` - Health check
