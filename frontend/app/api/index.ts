import axios from "axios";
import { NextResponse } from "next/server";

export const todoPost = async (data: any) => {
  try {
    const response = await axios.post("http://localhost:8080/todos", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);
    return response;
  } catch (error) {
    return new NextResponse("BAD_REQUEST", { status: 400 });
  }
};

export const todoGet = async () => {
  try {
    const response = await axios.get("http://localhost:8080/todos");
    // console.log(response);
    return response.data.map((todo: any) => ({
      id: todo.ID,
      title: todo.Title,
      description: todo.Description,
      completed: todo.Completed,
    }));
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const todoDelete = async (id: string) => {
  try {
    const response = await axios.delete(`http://localhost:8080/todos/${id}`);
    return response.data;
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const todoUpdate = async (data: any) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/todos/${data.id}`,
      data
    );
    return response;
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};
