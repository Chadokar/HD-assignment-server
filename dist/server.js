"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import authRoutes from './routes/authRoutes';
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(errorHandler_1.default);
app.use(routes_1.default);
const PORT = process.env.PORT || 8000;
console.log("PORT", PORT);
app.get("/", (req, res) => {
    res.send("Hello World");
});
// check if the database is connected
mongoose_1.default
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
exports.default = app;
