import type { Person } from "../types/person";
import type { Task } from "../types/task";

const API_URL = "http://localhost:3000/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export async function getTasks(): Promise<Task[]> {
  return request<Task[]>("/tasks");
}

export async function getPeople(): Promise<Person[]> {
  return request<Person[]>("/people");
}