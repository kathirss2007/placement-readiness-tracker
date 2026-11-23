import express from "express";
import mongoose from "mongoose";
import Student from "../models/Student.js";

const router = express.Router();

function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET all student skill records
router.get("/", async (_req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch students", error: error.message });
  }
});

// GET one student record
router.get("/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid student ID" });
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch student", error: error.message });
  }
});

// POST create a student record
router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    const status = error.code === 11000 ? 409 : 400;
    res.status(status).json({ message: error.code === 11000 ? "Register number already exists" : error.message });
  }
});

// PUT update a student record
router.put("/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid student ID" });
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    const status = error.code === 11000 ? 409 : 400;
    res.status(status).json({ message: error.code === 11000 ? "Register number already exists" : error.message });
  }
});

// DELETE remove a student record
router.delete("/:id", async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid student ID" });
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete student", error: error.message });
  }
});

export default router;
