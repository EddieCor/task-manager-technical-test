import type { Person } from "./person";

export type TaskStatus = "NEW" | "STARTED" | "COMPLETED";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  completed: boolean;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  assignedPersonId: number | null;
  assignedPerson: Person | null;
};