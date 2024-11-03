import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctor.model.js";
import { AppointmentModel } from "../models/appointments.model.js";
import razorpay from "razorpay";

// api for register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password " });
    }
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name: name,
      email: email,
      password: hasedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
// api for login user
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user does not exisites" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// Api to get User Profile data
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// api to update userProfile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const ImageFile = req.file;
    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Details missing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });
    if (ImageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(ImageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.json({ success: true, message: "profile Updated" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//api to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.avaliable) {
      return res.json({ success: false, message: "Doctor not avaliable" });
    }
    let slots_booked = docData.slots_booked;
    //checking for slots avaliability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not avaliable" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      // slots_booked[slotDate] = [slotTime];
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      docData,
      userData,
      amount: docData.fees,
      date: Date.now(),
    };
    const newAppointment = new AppointmentModel(appointmentData);
    await newAppointment.save();

    //save new slots data in doctorData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//api to get appointment for frontend my appointment page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointment = await AppointmentModel.find({ userId });

    res.json({ success: true, appointment });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//api to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await AppointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // Cancel the appointment
    await AppointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

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

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// api for payment gatway
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await AppointmentModel.findById(appointmentId);
    // console.log(appointmentData);

    if (!appointmentData || appointmentData.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    //creating options for razorpay
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };
    //creation of an order

    const order = await razorpayInstance.orders.create(options);
    console.log(order);

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

//api to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    console.log(razorpay_order_id);

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    console.log(orderInfo);
    if (orderInfo.status === "paid") {
      await AppointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      return res
        .status(200)
        .json({ success: true, message: "Payment successful" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment failed" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export {
  registerUser,
  userLogin,
  getUserProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
