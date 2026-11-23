import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    registerNumber: { type: String, required: true, trim: true, unique: true },
    department: { type: String, required: true, trim: true },
    technicalSkills: { type: [String], default: [] },
    aptitudeScore: { type: Number, required: true, min: 0, max: 100 },
    communicationSkills: { type: Number, required: true, min: 0, max: 100 },
    placementStatus: {
      type: String,
      enum: ["Ready", "In Progress", "Not Ready"],
      default: "In Progress"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
