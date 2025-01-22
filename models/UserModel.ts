import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  dob: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("User", User);
