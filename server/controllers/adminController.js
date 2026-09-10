import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ success: true, token });
  } catch (error) {
    console.error("adminLogin error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("getAllBlogsAdmin error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    console.error("getAllComments error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });
    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs,
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("getDashboard error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.json({ success: false, message: "Invalid comment id" });
    }
    await Comment.findByIdAndDelete(id);
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("deleteCommentById error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.json({ success: false, message: "Invalid comment id" });
    }
    await Comment.findByIdAndUpdate(id, { isApproved: true });
    res.json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    console.error("approveCommentById error:", error);
    res.json({ success: false, message: "Something went wrong" });
  }
};
