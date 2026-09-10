import fs from "fs";
import mongoose from "mongoose";
import imagekit from "../configs/imageKit.js";
import { sanitizeBlogHtml } from "../configs/sanitize.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;
    //
    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    // upload image to imagekit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/quickBlogs",
    });
    // optimize image
    const optimizedImageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" }, // compress
        { format: "webp" },
        { width: "1280" }, // size
      ],
    });

    const image = optimizedImageURL;

    await Blog.create({
      title,
      subTitle,
      description: sanitizeBlogHtml(description),
      category,
      image,
      isPublished,
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    console.error("addBlog error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("getAllBlogs error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!mongoose.isValidObjectId(blogId)) {
      return res.json({ success: false, message: "Invalid blog id" });
    }
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error("getBlogById error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.json({ success: false, message: "Invalid blog id" });
    }
    await Blog.findByIdAndDelete(id);

    // delete comments also
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("deleteBlogById error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.json({ success: false, message: "Invalid blog id" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog status updated" });
  } catch (error) {
    console.error("togglePublish error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    if (!mongoose.isValidObjectId(blog)) {
      return res.json({ success: false, message: "Invalid blog id" });
    }
    const trimmedName = (name || "").trim();
    const trimmedContent = (content || "").trim();
    if (!trimmedName || !trimmedContent) {
      return res.json({ success: false, message: "Name and comment are required" });
    }
    if (trimmedName.length > 80 || trimmedContent.length > 1000) {
      return res.json({ success: false, message: "Comment is too long" });
    }

    const target = await Blog.findOne({ _id: blog, isPublished: true });
    if (!target) {
      return res.json({ success: false, message: "Blog not found" });
    }

    await Comment.create({ blog, name: trimmedName, content: trimmedContent });
    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    console.error("addComment error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    if (!mongoose.isValidObjectId(blogId)) {
      return res.json({ success: false, message: "Invalid blog id" });
    }
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    console.error("getBlogComments error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// Gemini
export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.json({ success: false, message: "Prompt is required" });
    }
    if (prompt.length > 300) {
      return res.json({ success: false, message: "Prompt is too long" });
    }
    const content = await main(prompt.trim());
    res.json({ success: true, content });
  } catch (error) {
    console.error("generateContent error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};
