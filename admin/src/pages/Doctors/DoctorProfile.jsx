import React, { useContext, useEffect, useState } from "react";
import DoctorContext from "../../context/Doctor.Context";
import AppContext from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { getprofileData, profileData, dToken, setProfileData,backendUrl } =
    useContext(DoctorContext);
  const { currency} = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        avaliable: profileData.avaliable,
      };
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/updateProfileData`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getprofileData()
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);

      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getprofileData();
      console.log(profileData);
    }
  }, [dToken]);
  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5 ">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg "
              src={profileData.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white ">
            {/* doc info */}
            <p className="flex  items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1  text-gray-600">
              {profileData.degree}-{profileData.speciality}
              <button className="py-0.5 px-2 border  text-xs rounded-full">
                {profileData.experience}
              </button>
            </div>
            {/* doc about  */}

            <div>
              <p className="flex items-center  gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:
              </p>
              <p className="text-sm  text-gray-600 max-w-[700px] mt-1">
                {profileData.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium  mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {currency}
                {isEdit ? (
                  <input
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                    type="number"
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>
            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm ">
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                    type="text"
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    avaliable: !prev.avaliable,
                  }))
                }
                checked={profileData.avaliable}
                type="checkbox"
                name=""
                id=""
              />
              <label htmlFor="">Avaliable</label>
            </div>

            {isEdit ? (
              <button
                onClick={() => {
                  setIsEdit(false), updateProfile();
                }}
                className="px-4 py-1 border border-primary text-sm rounded-full  mt-5 hover:bg-primary hover:text-white  transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-primary text-sm rounded-full  mt-5 hover:bg-primary hover:text-white  transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;