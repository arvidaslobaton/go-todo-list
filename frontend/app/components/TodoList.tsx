import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import { todoDelete, todoGet } from "../api";
import TodoForm from "./TodoForm";

interface Todo {
  id: string; // Add an ID property
  title: string;
  description: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [action, setAction] = useState<"add" | "update" | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  // console.log("todos ==>", todos);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const fetchedTodos = await todoGet();
    setTodos(fetchedTodos);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  const handleDelete = (id: any) => {
    // Implement delete functionality
    console.log(`Deleting todo with ID: ${id}`);
    todoDelete(id);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleAddUpdateForm = (purpose: string, todo?: Todo) => {
    setAction(purpose === "add" ? "add" : "update");
    if (purpose === "update" && todo) {
      setSelectedTodo({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      });
    }
    setIsModalOpen(true);
  };

  const handleUpdate = (todo: Todo) => {
    // console.log("todo here ==>", todo);

    setAction("update");
    console.log(action);

    setSelectedTodo({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="container w-96 mx-auto p-4">
      <div className="flex justify-between">
        <h2 className="text-2xl text-blue-300 font-bold mb-6">Go-Todo List</h2>
        <button
          className="px-3 py-1 bg-green-500 text-white h-10 rounded-md text-xs font-semibold focus:outline-none"
          onClick={() => handleAddUpdateForm("add")}
        >
          add
        </button>
      </div>

      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          title={todo.title}
          description={todo.description}
          completed={todo.completed}
          setAction={setAction}
          setIsOpen={setIsModalOpen}
          onDelete={() => handleDelete(todo.id)}
          // onUpdate={() => handleUpdate(todo)}
          onUpdate={() => handleAddUpdateForm("update", todo)}
        />
      ))}
      {isModalOpen ? (
        <TodoForm
          onClose={handleCloseModal}
          action={action}
          fetchTodos={fetchTodos}
          selectedTodo={selectedTodo}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default TodoList;
