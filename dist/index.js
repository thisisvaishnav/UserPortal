"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const SECRET_KEY = "your-secret-key";
// MongoDB connection
mongoose_1.default.connect("mongodb+srv://vaishnavverma0:hr6CPmVq8VYhinCX@cluster0.la6e8nl.mongodb.net/courses").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});
// User schema
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coursePurchased: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Course" },
});
const User = mongoose_1.default.model("User", userSchema);
// Admin schema
const adminSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const Admin = mongoose_1.default.model("Admin", adminSchema);
// Course schema
const courseSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    instructor: { type: String, required: true },
});
const Course = mongoose_1.default.model("Course", courseSchema);
// JWT middleware
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            req.user = user;
            next();
        });
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
// Admin signup
app.post("/admin/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingAdmin = yield Admin.findOne({ username });
    if (existingAdmin) {
        res.status(403).json({ message: "Admin already exists" });
    }
    else {
        const newAdmin = new Admin({ username, password });
        yield newAdmin.save();
        const token = jsonwebtoken_1.default.sign({ username, role: "admin" }, SECRET_KEY);
        res.json({ message: "Admin created successfully", token });
    }
}));
// Admin login
app.post("/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const admin = yield Admin.findOne({ username, password });
    if (admin) {
        const token = jsonwebtoken_1.default.sign({ username, role: "admin" }, SECRET_KEY);
        res.json({ message: "Logged in successfully", token });
    }
    else {
        res.status(403).json({ message: "Invalid username or password" });
    }
}));
// Create course
app.post("/admin/courses", authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, image, instructor } = req.body;
    const course = new Course({ title, description, price, image, instructor });
    yield course.save();
    res.json({ message: "Course created successfully", courseId: course._id });
}));
// Get all courses
app.get("/admin/courses", authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Course.find({ published: true });
    res.json({ courses });
}));
// User signup
app.post("/users/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingUser = yield User.findOne({ username });
    if (existingUser) {
        res.status(403).json({ message: "User already exists" });
    }
    else {
        const newUser = new User({ username, password });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ username, role: "user" }, SECRET_KEY);
        res.json({ message: "User created successfully", token });
    }
}));
// User login
app.post("/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ username, role: "user" }, SECRET_KEY);
        res.json({ message: "Logged in successfully", token });
    }
    else {
        res.status(403).json({ message: "Invalid username or password" });
    }
}));
// Get all courses for users
app.get("/courses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Course.find({});
    res.json({ courses });
}));
// Course purchase
app.post("/users/courses/:courseId", authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Course.findById(req.params.courseId);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = yield User.findOne({ username: req.user.username });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    user.coursePurchased = course._id;
    yield user.save();
    res.json({ message: "Course purchased successfully" });
}));
// Get purchased courses
app.get("/users/courses", authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = yield User.findOne({ username: req.user.username }).populate("coursePurchased");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ purchasedCourse: user.coursePurchased });
}));
app.get('/users/purchasedCourses', authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = yield User.findOne({ username: req.user.username }).populate("coursePurchased");
}));
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
