import React, { useState, useEffect } from 'react';
import { List, Input, Button, Popconfirm, message, Typography, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import styles from './index.less';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (!newTodo.trim()) {
      message.warning('Please enter a todo item');
      return;
    }

    const newItem = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false
    };

    setTodos([...todos, newItem]);
    setNewTodo('');
  };

  const handleEditTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
    setEditingId(null);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    message.success('Todo deleted successfully');
  };

  const handleToggleComplete = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Tính toán số lượng công việc đã hoàn thành
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className={styles.container}>
      <Typography.Title level={2} className={styles.title}>
        Todo List
        <Badge 
          count={`${completedCount}/${todos.length}`} 
          className={styles.badge}
          style={{ backgroundColor: '#52c41a' }}
        />
      </Typography.Title>
      
      <div className={styles.inputContainer}>
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onPressEnter={handleAddTodo}
          placeholder="Add a new todo"
          size="large"
        />
        <Button type="primary" onClick={handleAddTodo} size="large">
          Add
        </Button>
      </div>

      <List
        className={styles.list}
        itemLayout="horizontal"
        dataSource={todos}
        locale={{ emptyText: 'No todos yet' }}
        renderItem={(todo) => (
          <List.Item
            className={`${styles.listItem} ${todo.completed ? styles.completed : ''}`}
            actions={[
              <Button 
                type={todo.completed ? 'primary' : 'default'}
                icon={<CheckOutlined />}
                onClick={() => handleToggleComplete(todo.id)}
              />,
              <Button 
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingId(todo.id);
                  setEditText(todo.text);
                }}
                disabled={todo.completed}
              />,
              <Popconfirm
                title="Are you sure you want to delete this todo?"
                onConfirm={() => handleDeleteTodo(todo.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            ]}
          >
            {editingId === todo.id ? (
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onPressEnter={() => handleEditTodo(todo.id, editText)}
                onBlur={() => setEditingId(null)}
                autoFocus
              />
            ) : (
              <Typography.Text delete={todo.completed}>
                {todo.text}
              </Typography.Text>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default TodoList; 