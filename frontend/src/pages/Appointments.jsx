import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctor from "../components/RelatedDoctor";
import { toast } from "react-toastify";
import axios from "axios";

const Appointments = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backEndUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysofWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docDetails, setdocDetails] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const Navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setdocDetails(docInfo);
    console.log(docInfo);
  };
  const getAvailableSlots = () => {
    setDocSlots([]); // Reset the slots

    const today = new Date(); // Get today's date
    const slotDuration = 30; // 30 minutes per slot

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today); // Create a new date object for each day
      currentDate.setDate(today.getDate() + i); // Set to current day + i (for the next 7 days)

      // End time is 9 PM for each day
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // Set to 9:00 PM

      // Set initial hours and minutes for each day
      if (i === 0) {
        // For today, start from the next available slot (current time + 1 hour or 10:00 AM)
        currentDate.setHours(Math.max(10, currentDate.getHours() + 1));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        // For future days, start from 10 AM
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];

      // Loop to create slots between start time (10 AM) and end time (9 PM)
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;
        const isSlotAvailable =
          !docDetails?.slots_booked?.[slotDate] ||
          !docDetails.slots_booked[slotDate].includes(slotTime);

        // Add the slot to the array
        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment the time by 30 minutes for the next slot
        currentDate.setMinutes(currentDate.getMinutes() + slotDuration);
      }

      // Update the state with the time slots for each day
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book Appointment");
      return Navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        `${backEndUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Make sure token is valid and present
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        Navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docDetails]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    docDetails && (
      // doctor details
      <div>
        <div className="flex flex-col  sm:flex-row gap-4 ">
          <div>
            <img
              className="bg-primary w-full  sm:max-w-72 rounded-lg "
              src={docDetails.image}
              alt="image"
            />
          </div>
          {/* doc full details  */}
          <div className=" flex-1  border border-gray-400  rounded-lg p-8 py-7  bg-white mx-2  sm:mx-0  mt-[-80px]  sm:mt-0">
            <p className=" flex items-center gap-2  text-2xl font-medium  text-gray-900 ">
              {docDetails.name}
              <img className="w-5 " src={assets.verified_icon} alt="icon" />
            </p>
            <div className="flex-items-center gap-2 text-sm mt-1  text-gray-600">
              <p>
                {docDetails.degree}-{docDetails.speciality}
              </p>
              <button className=" py-0.5 px-2  border  text-xs  rounded-full ">
                {docDetails.experience}
              </button>
            </div>
            {/* about section  */}
            <div>
              <p className=" flex items-center gap-1  text-sm  font-medium text-gray-900 mt-3 ">
                About
                <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm  text-gray-500 max-w-[700px] mt-1 ">
                {docDetails.about}
              </p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Appointment Fees:
              <span className="text-gray-600">
                {currencySymbol}
                {docDetails.fees}
              </span>
            </p>
          </div>
        </div>
        {/* BOOKING SLOTS  */}
        <div className=" sm:ml-72 sm:pl-4 mt-4 font-medium  text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, idx) => (
                <div
                  onClick={() => setSlotIndex(idx)}
                  className={`text-center py-5 min-w-16  rounded-full  cursor-pointer ${
                    slotIndex === idx
                      ? "bg-primary text-white"
                      : "border border-gray-200 "
                  }`}
                  key={idx}
                >
                  <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full  overflow-x-scroll mt-4  ">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white "
                      : "text-gray-400  border border-gray-300"
                  }   `}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button
            onClick={bookAppointment}
            className="bg-primary text-white rounded-full p-3 text-sm font-light px-14 my-6"
          >
            Book an Appointment
          </button>
        </div>

        {/* listing Related  doctors  */}
        <RelatedDoctor docid={docId} speciality={docDetails.speciality} />
      </div>
    )
  );
};

export default Appointments;
