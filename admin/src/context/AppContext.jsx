import { createContext } from "react";

const AppContext = createContext();


 export const  AppContextProvider = (props) => {

  const currency='$'

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

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(Date.parse(dob));
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Check if the birthday hasn't occurred yet this year
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  
  const value = {
    calculateAge,
    slotFormatDate,
    currency
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContext;
