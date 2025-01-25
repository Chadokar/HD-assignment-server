import express from "express";
// import authRoutes from './routes/authRoutes';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import errorHandler from "./middlewares/errorHandler";
import router from "./routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use(errorHandler);
app.use(router);
const PORT = process.env.PORT || 8000;
console.log("PORT", PORT);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// check if the database is connected
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/highway-delite")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
