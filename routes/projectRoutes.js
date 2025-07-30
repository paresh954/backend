import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/", authMiddleware, upload.array("image", 5), async (req, res) => {
  try {
    const { title, description, features, technologies, github, demo, date } =
      req.body;

    //conver features and technologies to array
    const featureArray =
      typeof features === "string" ? features.split(",") : features;
    const techArray =
      typeof technologies === "string" ? technologies.split(",") : technologies;

    const imageUrls = req.files.map((file) => file.path);

    const newProject = new Project({
      title,
      description,
      features: featureArray,
      technologies: techArray,
      github,
      demo,
      date,
      image: imageUrls,
    });
    await newProject.save();
    res
      .status(201)
      .json({ message: "Project created successfully", newProject });
  } catch (error) {
    console.error("🔥 Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/projects/:id
router.put(
  "/:id",
  authMiddleware,
  upload.array("image", 5),
  async (req, res) => {
    try {
      const projectId = req.params.id;
      const { title, description, features, technologies, github, demo, date } =
        req.body;

      const featureArray =
        typeof features === "string" ? features.split(",") : features;
      const techArray =
        typeof technologies === "string"
          ? technologies.split(",")
          : technologies;

      const imageUrls = req.files?.length
        ? req.files.map((file) => file.path)
        : undefined; // Keep old images if not uploaded

      const updatedFields = {
        title,
        description,
        features: featureArray,
        technologies: techArray,
        github,
        demo,
        date,
      };

      if (imageUrls) {
        updatedFields.image = imageUrls;
      }

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        updatedFields,
        { new: true }
      );

      res.json({ message: "Project updated successfully", updatedProject });
    } catch (error) {
      console.error("❌ Update Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE /api/projects/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    await Project.findByIdAndDelete(projectId);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
