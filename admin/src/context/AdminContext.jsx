import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;
  const [appointements, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/admin/all-doctors`,
        {},
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const changeAvalibility = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/admin/change-avaliability`,
        { docId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/admin/appointments`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
      if (data.success) {
        setAppointments(data.appointements);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/admin/AppointmentCancel`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/admin/dashboard`, {
        headers:{
          Authorization: `Bearer ${aToken}`,
        },
      });
      if (data.success) {
        setDashData(data.dashData);
        
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  const value = {
    aToken,
    setAToken,
    backEndUrl,
    doctors,
    getAllDoctors,
    changeAvalibility,
    appointements,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    getDashData,
    dashData
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
