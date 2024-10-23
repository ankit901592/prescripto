import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctor.model.js";
import jwt from "jsonwebtoken";
import { AppointmentModel } from "../models/appointments.model.js";
import userModel from "../models/userModel.js";

const addDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    console.log(req.body);

    // console.log(
    //   {
    //     name,
    //     email,
    //     password,
    //     speciality,
    //     degree,
    //     experience,
    //     about,
    //     fees,
    //     address,
    //   },
    //   req.file
    // );

    const image = req.file;

    // Check for missing details
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !image
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Enter a strong password of at least 8 characters",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Add await here

    // Upload image to Cloudinary
    const uploadImage = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });
    const image_url = uploadImage.secure_url;

    // Prepare doctor data
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: image_url,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    // Save doctor to the database
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res
      .status(201)
      .json({ success: true, message: "Doctor added successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: "false", message: err.message });
  }
};

//admin login
const adminLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL ||
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      }); // Sign with the email and set expiration
      if (token) return res.status(200).json({ success: true, token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" }); // Change status to 401 for unauthorized
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message }); // Change status to 500 for server error
  }
};
//get All Doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
//api to get All appointment list

const appointmentAdmin = async (req, res) => {
  try {
    const appointements = await AppointmentModel.find({});
    console.log(appointements);

    res.status(200).json({ success: true, appointements });
  } catch (err) {
    console.log(err);
    res.status(200).json({ success: false, message: err.message });
  }
};
//api for cancell appointment
const AppointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await AppointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Cancel the appointment
    await AppointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    console.log(appointmentData);

    // Releasing doctor's slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData) {
      let slots_booked = doctorData.slots_booked;
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );

      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    }

    res.json({ success: true, message: "Appointment canceled successfully" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//Api to get dashboard data for admin pannel
const adminDashboard = async (req, res) => {
  try {
    const doctor = await doctorModel.find({});
    const user = await userModel.find({});
    const appointments = await AppointmentModel.find({});
    const dashData = {
      doctors: doctor.length,
      appointments: appointments.length,
      patience: user.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
     res.status(200).json({ success: true, dashData });
  } catch (err) {
    console.log(err);
     res.status(404).json({ success: false, message: err.message });
  }
};

export {
  addDoctor,
  adminLogin,
  allDoctors,
  appointmentAdmin,
  AppointmentCancel,
  adminDashboard,
};
