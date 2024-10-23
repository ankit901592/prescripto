import React from "react";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";
import DoctorContext from "../context/Doctor.Context";

function SideBar() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  
  return (
    <div className="max-h-screen bg-white border-r">
      {aToken && 
        <ul>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] boder-r-4 border-primary" : ""
              } `
            }
            to={"/admin-dashboard"}
          >
            <img src={assets.home_icon} alt="home icon" />
            <p className="hidden md:block">DashBoard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] boder-r-4 border-primary" : ""
              } `
            }
            to={"/all-appointments"}
          >
            <img src={assets.appointment_icon} alt="home icon" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] boder-r-4 border-primary" : ""
              } `
            }
            to={"/add-doctors"}
          >
            <img src={assets.add_icon} alt="home icon" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] boder-r-4 border-primary" : ""
              } `
            }
            to={"/doctors-list"}
          >
            <img src={assets.people_icon} alt="home icon" />
            <p className="hidden md:block">Doctor List</p>
          </NavLink>
        </ul>
}
      {dToken && 
        <ul>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] boder-r-4 border-primary" : ""
              } `
            }
            to={"/doctor-dashboard"}
          >
            <img src={assets.home_icon} alt="home icon" />
            <p className="hidden md:block">DashBoard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] boder-r-4 border-primary" : ""
              } `
            }
            to={"/doctor-Appointments"}
          >
            <img src={assets.appointment_icon} alt="home icon" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] boder-r-4 border-primary" : ""
              } `
            }
            to={"/doctor-profile"}
          >
            <img src={assets.people_icon} alt="home icon" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      }
    
    </div>
  );
}

export default SideBar;
