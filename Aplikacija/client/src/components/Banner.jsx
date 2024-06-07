import '../styles/Banner.css';
import '../styles/MainButton.css';

import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export const Banner = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
  
    const handleScroll = () => setScrollPosition(window.scrollY);
  
    useEffect(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
      <div className="page home-page">
        <section
          style={{
            backgroundSize: `${(window.outerHeight - scrollPosition) / 3}%`,
          }}
          className="banner bannerContainer"
        >
          <h2>ZakažiLab</h2>
          <Link to="/login">
            <button to="/login" className="main-button" onClick={() => console.log("useless button")}>Prijavi se</button>
          </Link>
          {/* <button className="main-button">Prijavi se</button> */}
        </section>
        {/* <section>
        <p>  
        {/* Ovde treba da se doda nesto ali makar da ne bude lorem ipsum }  
        </p>
        </section> */}
      </div>
    );
  };
export default Banner;

