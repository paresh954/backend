import mongoose, { model } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    technologies: {
      type: [String],
      required: true,
    },
    github: {
      type: String,
    },
    demo: {
      type: String,
    },
    image: [String],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Project", projectSchema);
