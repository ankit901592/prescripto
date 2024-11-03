import React from "react";
import Header from "../components/Header";
import Specialitymenu from "../components/Specialitymenu";
import TopDoctor from "../components/TopDoctor";
import Banner from "../components/Banner";
const Home = () => {
  return (
    <div>
      <Header />
      <Specialitymenu />
      <TopDoctor />
      <Banner />
    </div>
  );
};

export default Home;
