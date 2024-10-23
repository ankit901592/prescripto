import { useContext, useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const DoctorContext = createContext();

export const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [Appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState([]);
  const [profileData, setProfileData] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointnments`,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.log(err);
      toast.error(data.message);
    }
  };

  const CompleteAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/completeAppointment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(data.message);
    }
  };
  const CancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancelAppointment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(data.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashData`, {
        headers: {
          Authorization: `Bearer ${dToken}`,
        },
      });
      if (data.success) {
        setDashData(data.dashData);
        toast.success(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(data.message);
    }
  };

  const getprofileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/ProfileData`, {
        headers: {
          Authorization: `Bearer ${dToken}`,
        },
      });
      if (data.success) {
        setProfileData(data.doctorProfile);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    getAppointments,
    Appointments,
    setAppointments,
    CancelAppointment,
    CompleteAppointment,
    getDashData,
    dashData,
    getprofileData,
    profileData,
    setProfileData,
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContext;
