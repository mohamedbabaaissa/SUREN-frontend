import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../header/Header";
import Hero from "../home/HERO/Hero";
import Collection from "../collection/Collection";
import Footer from "../footer/Footer";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollToCollection) {
      setTimeout(() => {
        document.getElementById("collection")?.scrollIntoView({
          behavior: "smooth",
        });

        // Clear the state so refresh doesn't scroll again
        navigate("/", { replace: true, state: {} });
      }, 100);
    }
  }, [location, navigate]);

  return (
    <>
      <Header />
      <Hero />
      <Collection />
      <Footer />
    </>
  );
}

export default Home;