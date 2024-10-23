import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Myappointments = () => {
  const navigate = useNavigate();
  const { backEndUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const slotFormatDate = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] +
      " " +
      months[Number(dateArray[1])] +
      " " +
      dateArray[2] +
      " "
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backEndUrl}/api/user/appointment-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Make sure token is valid and present
          },
        }
      );
      console.log(data);

      if (data.success) {
        setAppointments(data.appointment.reverse());
        console.log(appointments);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/user/cancel-appoitnment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        getUserAppointments();
        getDoctorsData();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Corrected Razorpay key ID
      amount: order.amount,
      currency: order.currency, // Corrected typo: cuurency to currency
      name: "Appointment payment",
      description: "Appointment payment", // Corrected typo: descprtion to description
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            `${backEndUrl}/api/user/verify-razorpay`,
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (data.success) {
            getUserAppointments(); // Correct function name typo from getUserAppointmens
            navigate("/my-appointments");
            toast.success(data.message);
          }
        } catch (err) {
          console.log(err);
          toast.error(err.message);
        }
      },
    };

    var rzp = new window.Razorpay(options); // Fixed reference to rzp
    rzp.open(); // Corrected rzp1.open() to rzp.open()
  };

  const appointmentRazorPay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/user/razorpaypayment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);

      if (data.success) {
        initPay(data.order);
        console.log(data.order);
      }
    } catch (err) {
      console.error(err); // Added error handling in catch block
      toast.error("Failed to initiate payment");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12  font-medium  text-zinc-700  border-b">
        MY APPOINTMENTS
      </p>
      <div>
        {appointments.map((dctr, i) => (
          <div
            className="  grid grid-cols-[1fr_2fr] gap-4 sm:flex  sm:gap-6 py-2 border-b"
            key={i}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={dctr.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1  text-sm text-zinc-700">
              <p className="text-neutral-800 font-semibold ">
                {dctr.docData.name}
              </p>
              <p>{dctr.docData.speciality}</p>
              <p className="text-zinc-700  font-medium  mt-1">Address:</p>
              <p className=" text-xs">{dctr.docData.address.line1}</p>
              <p className=" text-xs">{dctr.docData.address.line2}</p>
              <p className="text-sm  mt-1">
                <span className="text-sm  text-neutral-700 font-medium">
                  {" "}
                  Date & Time:
                </span>
                {slotFormatDate(dctr.slotDate)}| {dctr.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2  justify-end">
              {!dctr.cancelled && dctr.payment && !dctr.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50 ">
                  Paid
                </button>
              )}
              {!dctr.cancelled && !dctr.payment && !dctr.isCompleted && (
                <button
                  onClick={() => appointmentRazorPay(dctr._id)}
                  className="text-sm text-stone-500 text-center  sm:min-w-48 py-2  border rounded hover:bg-primary hover:text-white transition-all  duration-300"
                >
                  Pay Online
                </button>
              )}

              {!dctr.cancelled && !dctr.isCompleted && (
                <button
                  onClick={() => cancelAppointment(dctr._id)}
                  className="text-sm text-stone-500 text-center  sm:min-w-48 py-2  border rounded hover:bg-red-500 hover:text-white transition-all  duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {dctr.cancelled && !dctr.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded  text-red-500">
                  Appointment cancelled
                </button>
              )}
              {dctr.isCompleted && (
                <button className="sm:min-w-48 py-2 border border border-green-500 rounded text-green-500 ">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myappointments;
