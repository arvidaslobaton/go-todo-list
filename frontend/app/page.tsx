"use client";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-slate-600 flex-col items-center justify-between p-24">
      <TodoList />
    </main>
  );
}
