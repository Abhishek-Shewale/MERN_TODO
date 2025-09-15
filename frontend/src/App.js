import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper axios instance (so we don't repeat baseURL)
  const api = axios.create({
    baseURL: API_BASE,
    // withCredentials: true, // uncomment if using cookies/auth
    timeout: 10000
  });

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/todos'); // <-- fixed path
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await api.post('/api/todos', {
        text: newTodo.trim()
      });
      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add todo');
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id, completed) => {
    try {
      const response = await api.put(`/api/todos/${id}`, {
        completed: !completed
      });
      setTodos(todos.map(todo =>
        todo._id === id ? response.data : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await api.delete(`/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Simple Todo List</h1>
          <p>Keep track of your tasks</p>
        </header>

        <form onSubmit={addTodo} className="todo-form">
          <div className="input-group">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="todo-input"
            />
            <button type="submit" className="add-button">
              Add Todo
            </button>
          </div>
        </form>

        <div className="todos-container">
          {loading ? (
            <div className="loading">Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <p>No todos yet. Add one above!</p>
            </div>
          ) : (
            <ul className="todo-list">
              {todos.map(todo => (
                <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo._id, todo.completed)}
                      className="todo-checkbox"
                    />
                    <span className="todo-text">{todo.text}</span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="delete-button"
                    title="Delete todo"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {todos.length > 0 && (
          <div className="stats">
            <p>
              Total: {todos.length} |
              Completed: {todos.filter(todo => todo.completed).length} |
              Remaining: {todos.filter(todo => !todo.completed).length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
