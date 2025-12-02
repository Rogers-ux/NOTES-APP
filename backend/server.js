import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

dotenv.config();
connectDB();

const app = express();

// Convert requests to JSON
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// For ES Modules
const __dirname = path.resolve();

// ------------------------------------
// SERVE FRONTEND IN PRODUCTION
// ------------------------------------
if (process.env.NODE_ENV === "production") {
  // Serve static React files
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  // Catch-all route → send index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// ------------------------------------

app.get("/", (req, res) => {
  res.send("Hello world");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running successfully at ${PORT}`);
});
