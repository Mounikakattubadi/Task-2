import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import folderRoutes from "./routes/folder.routes";
import fileRoutes from "./routes/file.routes";
import publicRoutes from "./routes/public.routes";

const app = express();

app.use(cors());
app.use(express.json()); // IMPORTANT

app.get("/", (_req, res) => {
  res.json({ message: "Storage Platform API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/public", publicRoutes);

export default app;
