import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import peopleRoutes from "./routes/people.routes";
import tasksRoutes from "./routes/tasks.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/people", peopleRoutes);
app.use("/api/tasks", tasksRoutes);

app.get("/", (_req, res) => {
  res.send("Todo API is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});