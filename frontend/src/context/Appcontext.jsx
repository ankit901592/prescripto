import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backEndUrl = import.meta.env.VITE_BACKEND_UL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/doctor/list`, {
      });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/user/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`, // Make sure token is valid and present
        },
      });
  
      if (data.success) {
        setUserData(data.userData); // Update state with user profile data
      } else {
        toast.error(data.message || "Failed to load user profile.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An error occurred while fetching the profile.";
      toast.error(errorMessage);
      console.error("Error fetching profile:", err);
    }
  };
  

  const value = {
    getDoctorsData,
    doctors,
    currencySymbol,
    token,
    setToken,
    backEndUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;