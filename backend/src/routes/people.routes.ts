import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const people = await prisma.person.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(people);
  } catch (error) {
    console.error("Error fetching people:", error);
    res.status(500).json({ message: "Error fetching people." });
  }
});

export default router;