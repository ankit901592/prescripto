import React, { useContext, useEffect } from "react";
import DoctorContext from "../../context/Doctor.Context";
import AppContext from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets";

const DoctorAppointments = () => {
  const {
    getAppointments,
    Appointments,
    setAppointments,
    dToken,
    CancelAppointment,
    CompleteAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, slotFormatDate, currency } = useContext(AppContext);
  useEffect(() => {
    if (dToken) {
      getAppointments();
      console.log(Appointments);
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">ALL APPOINTMENTS</p>
      <div className="bg-white border rounded text-sm max-h[80vh] min-h[50vh] overflow-y-scroll ">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6  border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {Appointments.reverse().map((item, index) => (
          <div
            className=" flex flex-wrap justify-between max-sm:gap-5 max:sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 "
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt=""
              />
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.payment ? "Online" : "Cash"}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotFormatDate(item.slotDate)},{item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 tex-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 tex-xs font-medium">Completed</p>
            ) : (
              <div className="flex">
                <img
                  onClick={() => CancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
                <img
                  onClick={() => CompleteAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
