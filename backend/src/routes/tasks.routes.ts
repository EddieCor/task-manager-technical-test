import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignedPerson: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required.",
      });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
      include: {
        assignedPerson: true,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        message: "Invalid task id.",
      });
    }

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    const { title, description, status, assignedPersonId } = req.body;

    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({
        message: "Title cannot be empty.",
      });
    }

    let parsedAssignedPersonId: number | null | undefined = undefined;

    if (assignedPersonId !== undefined) {
      if (assignedPersonId === null || assignedPersonId === "") {
        parsedAssignedPersonId = null;
      } else {
        parsedAssignedPersonId = Number(assignedPersonId);

        if (Number.isNaN(parsedAssignedPersonId)) {
          return res.status(400).json({
            message: "Invalid assigned person id.",
          });
        }

        const person = await prisma.person.findUnique({
          where: {
            id: parsedAssignedPersonId,
          },
        });

        if (!person) {
          return res.status(404).json({
            message: "Assigned person not found.",
          });
        }
      }
    }

    const finalAssignedPersonId =
      parsedAssignedPersonId !== undefined
        ? parsedAssignedPersonId
        : existingTask.assignedPersonId;

    if (status === "COMPLETED" && finalAssignedPersonId === null) {
      return res.status(400).json({
        message: "A task must be assigned to a person before it can be completed.",
      });
    }

    const updateData: {
      title?: string;
      description?: string | null;
      status?: "NEW" | "STARTED" | "COMPLETED";
      completed?: boolean;
      startedAt?: Date | null;
      completedAt?: Date | null;
      assignedPersonId?: number | null;
    } = {};

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (parsedAssignedPersonId !== undefined) {
      updateData.assignedPersonId = parsedAssignedPersonId;
    }

    if (status !== undefined) {
      if (!["NEW", "STARTED", "COMPLETED"].includes(status)) {
        return res.status(400).json({
          message: "Invalid task status.",
        });
      }

      updateData.status = status;

      if (status === "NEW") {
        updateData.completed = false;
        updateData.startedAt = null;
        updateData.completedAt = null;
      }

      if (status === "STARTED") {
        updateData.completed = false;
        updateData.startedAt = existingTask.startedAt ?? new Date();
        updateData.completedAt = null;
      }

      if (status === "COMPLETED") {
        updateData.completed = true;
        updateData.startedAt = existingTask.startedAt ?? new Date();
        updateData.completedAt = new Date();
      }
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: updateData,
      include: {
        assignedPerson: true,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        message: "Invalid task id.",
      });
    }

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    res.json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task." });
  }
});

export default router;