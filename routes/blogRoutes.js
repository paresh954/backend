import express from "express";
import multer from "multer";
import fs from "fs";
import Blog from "../models/Blog.js";
import authMiddleware from "../middleware/verifyToken.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * 📌 Create Blog (Protected)
 */
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, slug, content, tag } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blogs",
    });

    const newBlog = new Blog({
      title,
      slug,
      content,
      tag: tag.split(",").map((t) => t.trim()),
      image: result.secure_url,
      date: Date.now(),
    });

    await newBlog.save();
    fs.unlinkSync(req.file.path); // delete local file

    res.status(201).json({ message: "Blog created", blog: newBlog });
  } catch (err) {
    console.error("Blog upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 📌 Update Blog (Protected)
 */
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, slug, content, tag } = req.body;

    const updatedFields = {
      title,
      slug,
      content,
      tag: tag.split(",").map((t) => t.trim()),
    };

    // If image is uploaded, update it
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs",
      });
      updatedFields.image = result.secure_url;
      fs.unlinkSync(req.file.path); // remove local file
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedFields, {
      new: true,
    });

    res.json({ message: "Blog updated successfully", updatedBlog });
  } catch (error) {
    console.error("Blog update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 📌 Delete Blog (Protected)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const blogId = req.params.id;
    await Blog.findByIdAndDelete(blogId);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete blog error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * 📌 Get All Blogs (Public)
 */
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Fetch blog error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
