import express from "express";
import {
  addDoctor,
  adminDashboard,
  adminLogin,
  allDoctors,
  appointmentAdmin,
  AppointmentCancel,
} from "../Controllers/adminController.js";
import upload from "../middelware/multer.js";
import authAdmin from "../middelware/auth.admin.js";
import { changeAvaliablity } from "../Controllers/doctorController.js";

const adminRoutes = express.Router();
adminRoutes.post("/addDoctor", authAdmin, upload.single("image"), addDoctor);
adminRoutes.post("/login", adminLogin);
adminRoutes.post("/all-doctors", allDoctors);
adminRoutes.post("/change-avaliability", changeAvaliablity);
adminRoutes.get("/appointments", authAdmin, appointmentAdmin);
adminRoutes.post("/AppointmentCancel", authAdmin, AppointmentCancel);
adminRoutes.get("/dashboard", authAdmin, adminDashboard);
export default adminRoutes;
