import { useEffect, useState } from "react";
import "./App.css";
import { createTask, getPeople, getTasks, updateTask } from "./services/api";
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

  return (
    <main className="app">
      <section className="app-header">
        <p className="eyebrow">Technical Test</p>
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
                    <article className="task-card" key={task.id}>
                      <div>
                        <p className="task-status">{task.status}</p>
                        <h3>{task.title}</h3>
                        {task.description && <p>{task.description}</p>}
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