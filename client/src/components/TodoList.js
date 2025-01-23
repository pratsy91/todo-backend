import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/api';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await createTodo({ text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditText(todo.text);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await updateTodo(id, { text: editText });
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
      setEditingTodo(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const response = await updateTodo(todo._id, { completed: !todo.completed });
      setTodos(todos.map(t => 
        t._id === todo._id ? response.data : t
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleCreate} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary">
            Add Todo
          </button>
        </div>
      </form>

      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div
            key={todo._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white p-4 rounded-lg shadow mb-4 flex items-center justify-between"
          >
            {editingTodo === todo._id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleUpdate(todo._id)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdate(todo._id);
                    }
                  }}
                  className="input-field flex-1"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  className="h-5 w-5"
                />
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.text}
                </span>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => startEditing(todo)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 