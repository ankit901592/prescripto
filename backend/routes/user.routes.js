import express from "express";
import {
  getUserProfile,
  registerUser,
  userLogin,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
} from "../Controllers/user.controller.js";
import authUser from "../middelware/Auth.user.js";
import upload from "../middelware/multer.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/userLogin", userLogin);
userRoutes.get("/get-profile", authUser, getUserProfile);
userRoutes.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRoutes.post("/book-appointment", authUser, bookAppointment);
userRoutes.get("/appointment-list", authUser, listAppointment);
userRoutes.post("/cancel-appoitnment", authUser, cancelAppointment);
userRoutes.post("/razorpaypayment", authUser, paymentRazorpay);
userRoutes.post("/verify-razorpay", authUser, verifyRazorpay);
export default userRoutes;
