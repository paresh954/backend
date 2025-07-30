import mongoose, { model } from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

export default model("Contact", contactSchema);
