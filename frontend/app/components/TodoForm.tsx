import React, { ChangeEvent, useEffect, useState } from "react";
import { todoPost, todoUpdate } from "../api";
import { todo } from "node:test";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ModalProps {
  title?: string;
  description?: string;
  completed?: boolean;
  onClose: () => void;
  action: "add" | "update" | null;
  fetchTodos: () => void;
  selectedTodo: Todo | null;
}

const TodoForm: React.FC<ModalProps> = ({
  onClose,
  action,
  fetchTodos,
  selectedTodo,
}) => {
  const [formData, setFormData] = useState<Todo>({
    id: "",
    title: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    if (selectedTodo) {
      setFormData(selectedTodo);
    }
  }, [selectedTodo]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (action === "add") {
        await todoPost(formData);
      } else if (action === "update" && selectedTodo) {
        await todoUpdate(formData);
      }

      setFormData({
        id: "",
        title: "",
        description: "",
        completed: false,
      });

      onClose();
      await fetchTodos();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="completed"
              className="ml-2 block text-lg font-medium text-gray-700"
            >
              Completed
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-red-500 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
            {action === "add" ? (
              <button
                type="submit"
                className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Todo
              </button>
            ) : (
              <button
                type="submit"
                className="py-2 px-4 bg-orange-500 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Todo
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
