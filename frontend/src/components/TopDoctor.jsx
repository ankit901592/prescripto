import React, { useContext } from "react";
// import {doctors} from '../assets/assets_frontend/assets'
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";

const TopDoctor = () => {
  const { doctors } = useContext(AppContext);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 my-16  text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className=" w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((dctr, i) => (
          <div
            onClick={() => navigate(`/appointment/${dctr._id}`)}
            className="border border-blue-200  rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={i}
          >
            <img className="bg-blue-50" src={dctr.image} alt="doctor image" />
            <div className="p-4">
              <div
                className={`flex item-center gap-2 text-sm text-center${
                  dctr.avaliable ? " text-green-500" : "text-gray-500"
                }`}
              >
                <p
                  className={`w-2 h-2 ${
                    dctr.avaliable ? "bg-green-500" : "bg-gray-500"
                  }  rounded-full`}
                ></p>{" "}
                <p className="px-[-5]">
                  {dctr.avaliable ? "Avaliable" : " Not available"}
                </p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{dctr.name}</p>
              <p className="text-gray-600 text-sm">{dctr.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        more
      </button>
    </div>
  );
};

export default TopDoctor;
