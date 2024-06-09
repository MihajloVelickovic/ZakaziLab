import { Link } from 'react-router-dom';
import React from "react";
import '../styles/Professor.css';
import '../styles/Page.css';
import { useState } from "react";


import Brand from "../images/favicon.ico";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Route, Routes} from 'react-router-dom';

import PageHome from "./PageHome";
import LaboratorijskaVezba from "./LaboratorijskaVezba";
import IzvestajOPoenima from "./IzvestajOPoenima";
import KalendarAktivnosti from "./KalendarAktivnosti";
import Kabinet from './Kabinet';

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

import Sidebar from "./Sidebar";
import Footer from './Footer';

const Professor = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    let {authToken, logoutUser} = useContext(AuthContext);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
    return (
        <>
        <header className="pageHeader">            
            <div>
            <button onClick={toggleSidebar} className='toggleButton' >
                <i className="fa-solid fa-bars"></i>
            </button>
            </div>
            <div>
             <Link to='/' className="title"><img src={Brand} alt="" style={{width:"40px"}} className="rounded-pill"/> ZakažiLab </Link>
            </div>
            <button onClick={logoutUser} className="login-button" style={{position: "absolute", right: "40px"}} >Odjavi se
            {/* <i className="bi bi-box-arrow-right"></i> */}
            <i className = "fa-solid fa-right-from-bracket"></i>
            </button>
        </header>
        <div className="pageContainer">            
            <aside className="pageAside" style={{left: showSidebar ? '0' : '-250px', position:"fixed"}}> 
                {/* <NavigationBar /> */}
                <Sidebar show={showSidebar} role="professor" />
            </aside>
            <main style={{ marginLeft: showSidebar ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
                <Routes>
                    <Route path="home" element={<PageHome role="assistant"/>} />
                    <Route path="lab" element={<LaboratorijskaVezba role="assistant"/>} />
                    <Route path="IzvestajOPoenima" element={<IzvestajOPoenima />} />
                    <Route path="aktivnosti" element={<KalendarAktivnosti role="assistant"/>} />
                    <Route path="Kabinet" element={<Kabinet role="assistant" />} />
                </Routes>
            </main>
        <Footer/>
        </div>
        </>
    )
}

export default Professor;
