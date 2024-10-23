import express from "express";
import cors from "cors";
import "dotenv/config";
import { connetDB } from "./config/mongoConfig.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRoutes from "./routes/admin.routes.js";
import DoctorRoutes from "./routes/doctor.routes.js";
import userRoutes from "./routes/user.routes.js";

const App = express();
const port = process.env.PORT || 4000;

App.use(express.json());
App.use(cors());

//api end point

App.get("/", (req, res) => {
  res.send("app is working");
});
App.use("/api/admin", adminRoutes);
App.use("/api/doctor", DoctorRoutes);
App.use("/api/user", userRoutes);
App.listen(port, () => {
  console.log("server is running on port num ", port);
  connetDB();
  connectCloudinary();
});
