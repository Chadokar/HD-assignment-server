import mongoose from "mongoose";

const Notes = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Note", Notes);
