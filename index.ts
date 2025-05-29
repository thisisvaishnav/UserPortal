import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const SECRET_KEY = "your-secret-key";

// MongoDB connection
mongoose.connect("mongodb+srv://vaishnavverma0:hr6CPmVq8VYhinCX@cluster0.la6e8nl.mongodb.net/courses").then(() => {
  console.log("Connected to MongoDB");
}).catch((err: Error) => {
  console.error("MongoDB connection error:", err);
});

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  coursePurchased: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

const User = mongoose.model("User", userSchema);

// Admin schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);

// Course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  instructor: { type: String, required: true },
});

const Course = mongoose.model("Course", courseSchema);

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: {
    username: string;
    role: string;
  };
}

// JWT middleware
const authenticateJwt = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err: jwt.VerifyErrors | null, user: any) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Admin signup
app.post("/admin/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = jwt.sign({ username, role: "admin" }, SECRET_KEY);
    res.json({ message: "Admin created successfully", token });
  }
});

// Admin login
app.post("/admin/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: "admin" }, SECRET_KEY);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

// Create course
app.post("/admin/courses", authenticateJwt, async (req: AuthRequest, res: Response) => {
  const { title, description, price, image, instructor } = req.body;
  const course = new Course({ title, description, price, image, instructor });
  await course.save();
  res.json({ message: "Course created successfully", courseId: course._id });
});

// Get all courses
app.get("/admin/courses", authenticateJwt, async (req: AuthRequest, res: Response) => {
  const courses = await Course.find({published: true});
  res.json({ courses });
});

// User signup
app.post("/users/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, SECRET_KEY);
    res.json({ message: "User created successfully", token });
  }
});

// User login
app.post("/users/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: "user" }, SECRET_KEY);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

// Get all courses for users
app.get("/courses", async (req: Request, res: Response) => {
  const courses = await Course.find({});
  res.json({ courses });
});

// Course purchase
app.post("/users/courses/:courseId", authenticateJwt, async (req: AuthRequest, res: Response) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({ username: req.user.username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.coursePurchased = course._id;
  await user.save();
  res.json({ message: "Course purchased successfully" });
});

// Get purchased courses
app.get("/users/courses", authenticateJwt, async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({ username: req.user.username }).populate("coursePurchased");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ purchasedCourse: user.coursePurchased });
});

app.get('/users/purchasedCourses', authenticateJwt, async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({ username: req.user.username }).populate("coursePurchased");
})
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
