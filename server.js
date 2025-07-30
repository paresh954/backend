import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import contactRoutes from "./routes/contactRoute.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

console.log("Initializing Express app");
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow frontend origin
    credentials: true,
  })
);
app.use(express.json());

const mountRoute = (path, routes) => {
  console.log(`Mounting routes at ${path}`);
  try {
    app.use(path, routes);
    console.log(`Successfully mounted ${path}`);
  } catch (err) {
    console.error(`Error mounting ${path}:`, err.message);
    throw err;
  }
};

mountRoute("/api/auth", authRoutes);
mountRoute("/api/projects", projectRoutes);
mountRoute("/api/blogs", blogRoutes);
mountRoute("/api/contact", contactRoutes);

// Debug route to list routes
app.get("/debug/routes", (req, res) => {
  console.log("Accessing /debug/routes");
  const routes = [];
  if (app._router && app._router.stack) {
    app._router.stack.forEach((layer) => {
      if (layer.route) {
        routes.push({
          path: layer.route.path,
          methods: Object.keys(layer.route.methods).join(", "),
        });
      } else if (layer.handle && layer.handle.stack) {
        const basePath =
          layer.regexp.toString().replace(/\/\^\\\/(.*?)\\\/.*$/, "$1") || "";
        layer.handle.stack.forEach((subLayer) => {
          if (subLayer.route) {
            routes.push({
              path: `/${basePath}${subLayer.route.path}`,
              methods: Object.keys(subLayer.route.methods).join(", "),
            });
          }
        });
      }
    });
    res.json({ routes });
  } else {
    res.status(500).json({ error: "Router not initialized" });
  }
});

// Debug database entries
app.get("/debug/db", async (req, res) => {
  try {
    const blogs = await Blog.find();
    const projects = await Project.find();
    res.json({
      blogs: blogs.map((b) => ({ slug: b.slug, title: b.title })),
      projects: projects.map((p) => ({
        github: p.github,
        demo: p.demo,
        title: p.title,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
