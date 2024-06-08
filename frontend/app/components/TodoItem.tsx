import React, { Dispatch, SetStateAction } from "react";
import { handleAddUpdateForm } from "../helper/todoHelper";

interface TodoItemProps {
  title: string;
  description: string;
  completed: boolean;
  setAction: Dispatch<SetStateAction<"add" | "update" | null>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: () => void;
  onUpdate: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  title,
  description,
  completed,
  setAction,
  setIsOpen,
  onDelete,
  onUpdate,
}) => {
  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-700 mb-2">{description}</p>
      <p
        className={`text-xs font-semibold ${
          completed ? "text-green-600" : "text-red-600"
        }`}
      >
        Status: {completed ? "Completed" : "Not Completed"}
      </p>
      <div className="flex justify-start mt-2 gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs font-semibold focus:outline-none"
          // onClick={() => handleAddUpdateForm("update", setIsOpen, setAction)}
          onClick={() => onUpdate()}
        >
          Update
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded-md text-xs font-semibold focus:outline-none"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
