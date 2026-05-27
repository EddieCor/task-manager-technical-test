import { useEffect, useState } from "react";
import "./App.css";
import {
  createTask,
  deleteTask,
  getPeople,
  getTasks,
  updateTask,
} from "./services/api";
import type { Person } from "./types/person";
import type { Task } from "./types/task";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");

    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [tasksData, peopleData] = await Promise.all([
          getTasks(),
          getPeople(),
        ]);

        setTasks(tasksData);
        setPeople(peopleData);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error loading data.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (title.trim() === "") {
      setError("Title is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const newTask = await createTask({
        title: title.trim(),
        description: description.trim(),
      });

      setTasks((currentTasks) => [newTask, ...currentTasks]);
      setTitle("");
      setDescription("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error creating task.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAssignPerson(taskId: number, value: string) {
    setError(null);

    const assignedPersonId = value === "" ? null : Number(value);

    try {
      const updatedTask = await updateTask(taskId, {
        assignedPersonId,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error assigning person.";
      setError(message);
    }
  }

  async function handleUpdateStatus(
    taskId: number,
    status: "NEW" | "STARTED" | "COMPLETED"
  ) {
    setError(null);

    try {
      const updatedTask = await updateTask(taskId, {
        status,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error updating task status.";
      setError(message);
    }
  }

  async function handleDeleteTask(taskId: number) {
    setError(null);

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error deleting task.";
      setError(message);
    }
  }

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  }

  return (
    <main className="app">
      <section className="app-header">
        <div className="header-top">
          <p className="eyebrow">Technical Test</p>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        </div>

        <h1>Task Manager</h1>
        <p className="subtitle">
          A simple To-Do List application for creating, assigning, updating, and deleting tasks.
        </p>
      </section>

      <section className="dashboard">
        {error && <p className="error-message">{error}</p>}

        <form className="task-form" onSubmit={handleCreateTask}>
          <div className="form-header">
            <div>
              <h2>Create task</h2>
              <p>Add a new task with the initial status NEW.</p>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Title
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Create homepage"
              />
            </label>

            <label>
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional task details"
                rows={3}
              />
            </label>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create task"}
          </button>
        </form>

        {isLoading ? (
          <p className="empty-state">Loading tasks...</p>
        ) : (
          <>
            <div className="summary-grid">
              <article className="summary-card">
                <span>Tasks</span>
                <strong>{tasks.length}</strong>
              </article>

              <article className="summary-card">
                <span>People</span>
                <strong>{people.length}</strong>
              </article>
            </div>

            <section className="task-section">
              <h2>Tasks</h2>

              {tasks.length === 0 ? (
                <p className="empty-state">No tasks have been created yet.</p>
              ) : (
                <div className="task-list">
                  {tasks.map((task) => (
                    <article
                      className={`task-card task-card--${task.status.toLowerCase()}`}
                      key={task.id}
                    >
                      <div className="task-content">
                        <div className="task-title-row">
                          <p className="task-status">{task.status}</p>
                        </div>

                        <h3>{task.title}</h3>

                        {task.description && (
                          <p className="task-description">{task.description}</p>
                        )}

                        <div className="task-meta">
                          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                          {task.startedAt && (
                            <span>Started: {new Date(task.startedAt).toLocaleDateString()}</span>
                          )}
                          {task.completedAt && (
                            <span>
                              Completed: {new Date(task.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <label className="task-assignee">
                        Assigned to
                        <select
                          value={task.assignedPersonId ?? ""}
                          onChange={(event) => handleAssignPerson(task.id, event.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {people.map((person) => (
                            <option key={person.id} value={person.id}>
                              {person.name} — {person.role}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="task-actions">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(task.id, "STARTED")}
                          disabled={task.status === "STARTED" || task.status === "COMPLETED"}
                        >
                          Start
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(task.id, "COMPLETED")}
                          disabled={task.status === "COMPLETED"}
                        >
                          Complete
                        </button>

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => handleUpdateStatus(task.id, "NEW")}
                          disabled={task.status === "NEW"}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default App;