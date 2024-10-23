import express from "express";
import {
  AppointmentComplete,
  AppointmentsDoctor,
  AppoitnmentCancel,
  doctorDashBoard,
  doctorList,
  doctorProfile,
  loginDoctor,
  updateDoctorProfile,
} from "../Controllers/doctorController.js";
import authDoctor from "../middelware/auth.Doctor.js";

const DoctorRoutes = express.Router();

DoctorRoutes.get("/list", doctorList);
DoctorRoutes.post("/loginDoctor", loginDoctor);
DoctorRoutes.get("/appointnments", authDoctor, AppointmentsDoctor);
DoctorRoutes.post("/completeAppointment", authDoctor, AppointmentComplete);
DoctorRoutes.post("/cancelAppointment", authDoctor, AppoitnmentCancel);
DoctorRoutes.get("/dashData", authDoctor, doctorDashBoard);
DoctorRoutes.get("/ProfileData", authDoctor, doctorProfile);
DoctorRoutes.post("/updateProfileData", authDoctor, updateDoctorProfile);

export default DoctorRoutes;
