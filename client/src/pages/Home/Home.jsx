import React from "react";
import { Footer, Header, Navbar } from "../../components/import";
import WhyUs from "../../components/WhyUs/WhyUs";
import Chat from "../Chat/Chat";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      <Navbar loggedIn="yes"/>
      <Header/>
      <WhyUs/>
      <Footer/>
    </div>
  );
};

export default Home;
