import { Link} from 'react-router-dom';
import React from "react";
import '../styles/Admin.css';
import { useState } from "react";
import "../styles/LoginButton.css";
import '../styles/Student.css';

import Brand from "../images/logo.ico";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Route, Routes} from 'react-router-dom';

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

import PageHome from "./PageHome";
import UpravljanjeStudentima from "./UpravljanjeStudentima";
import UpravljanjeProfesorima from "./UpravljanjeProfesorima";
import UpravljanjeAsistentima from "./UpravljanjeAsistentima"
import AdminRequests from './AdminRequests';


import { redirect } from 'react-router-dom';

import Sidebar from "./Sidebar";
import Footer from './Footer';

const Admin = () => {

    const [showSidebar, setShowSidebar] = useState(false);
    let {authToken, logoutUser} = useContext(AuthContext);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);

    };
    return (
        <>
        <header className="StudentHeader">            
            <div>
            <button onClick={toggleSidebar} className='toggleButton' >
                <i className="fa-solid fa-bars"></i>
            </button>
            </div>
            <div>
             <Link to='/' className="title"><img src={Brand} alt="" style={{width:"60px"}} className="rounded-pill"/> ZakažiLab </Link>
            </div>
            <button onClick={logoutUser} className="login-button" style={{position: "absolute", right: "40px"}} >Odjavi se
            {/* <i className="bi bi-box-arrow-right"></i> */}
            <i className = "fa-solid fa-right-from-bracket"></i>
            </button>
        </header>
        <div className="studentContainer">            
            <aside className="StudentAside" style={{left: showSidebar ? '0' : '-200px', position:"fixed", transition: 'left 0.3s ease'}}> 
                {/* <NavigationBar /> */}
                <Sidebar show={showSidebar} role="admin" />
            </aside>
            <main style={{ marginLeft: showSidebar ? '150px' : '0', width: "80%", transition: 'margin-left 0.3s ease' }}>
                <Routes>
                    <Route path="home" element={<PageHome role="admin"/>} />
                    <Route path="studenti" element={<UpravljanjeStudentima role="admin"/>}/>
                    <Route path="profesori" element={<UpravljanjeProfesorima role="admin"/>} />
                    <Route path="asistenti" element={<UpravljanjeAsistentima role="admin"/>}/>
                    <Route path="AdminRequests" element={<AdminRequests role="admin"/>}/>
                </Routes>
            </main>
            <Footer/>
        </div>
        </>
    )
}

export default Admin;
