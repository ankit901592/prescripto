import doctorModel from "../models/doctor.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppointmentModel } from "../models/appointments.model.js";

const changeAvaliablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      avaliable: !docData.avaliable,
    });
    res.json({ success: true, message: "avaliability changed" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    if (doctors) {
      res.json({ success: true, doctors });
    } else {
      res.json({ success: false, message: "no Doctors avaliable" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//Api for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "invalid credentials" });
    }
    const isMatched = bcrypt.compare(password, doctor.password);
    if (isMatched) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.status(200).json({ success: true, token });
    } else {
      res.status(404).json({ success: true, message: "invalid credenitals" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//api to get specfic doctorAppointments
const AppointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await AppointmentModel.find({ docId });
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
//api to mark the Appointment completed for doctor pannel
const AppointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    console.log(docId, appointmentId);

    const appointmentData = await AppointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await AppointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res
        .status(200)
        .json({ success: true, message: "Appointment Completed" });
    } else {
      return res.status(200).json({ success: false, message: "Mark failed" });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const AppoitnmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await AppointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await AppointmentModel.findByIdAndUpdate(appointmentId, {
        cacancelled: true,
      });
      return res
        .status(200)
        .json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Cancellation failed" });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

//api to get dash board data for doctor pannel
const doctorDashBoard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await AppointmentModel.find({ docId });
    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    let patience = [];
    appointments.map((item) => {
      if (!patience.includes(item.userId)) patience.push(item.userId);
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patience: patience.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
//api to get doctor profile
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctorProfile = await doctorModel.findById(docId).select("-password");
    res.status(200).json({ success: true, doctorProfile });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, avaliable } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, avaliable });
    res.json({ success: true, message: "profile updated" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export {
  changeAvaliablity,
  doctorList,
  loginDoctor,
  AppointmentsDoctor,
  AppointmentComplete,
  AppoitnmentCancel,
  doctorDashBoard,
  doctorProfile,
  updateDoctorProfile,
};
