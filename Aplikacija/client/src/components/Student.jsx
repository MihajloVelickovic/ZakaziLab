import { Link} from 'react-router-dom';
import React from "react";
import '../styles/Student.css';
import { useState } from "react";
import "../styles/LoginButton.css";

import Brand from "../images/favicon.ico";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Route, Routes} from 'react-router-dom';
import PageHome from './PageHome';
import LaboratorijskaVezba from "./LaboratorijskaVezba";
import OsvojeniPoeni from "./OsvojeniPoeni";
import KalendarAktivnosti from "./KalendarAktivnosti";

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';


import { redirect } from 'react-router-dom';



import Sidebar from "./Sidebar";
import Footer from './Footer';

const Student = () => {

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
             <Link to='/' className="title"><img src={Brand} alt="" style={{width:"40px"}} className="rounded-pill"/> ZakažiLab <span className="version">alpha0.0</span></Link>
            </div>
            <button onClick={logoutUser} className="login-button" style={{position: "absolute", right: "40px"}} >Log Out
            {/* <i className="bi bi-box-arrow-right"></i> */}
            <i className = "fa-solid fa-right-from-bracket"></i>
            </button>
        </header>
        <div className="studentContainer">            
            <aside className="StudentAside" style={{left: showSidebar ? '0' : '-250px', position:"fixed"}}> 
                {/* <NavigationBar /> */}
                <Sidebar show={showSidebar} role="student" />
            </aside>
            <main style={{ marginLeft: showSidebar ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
                <Routes>
                    <Route path="home" element={<PageHome role="student"/>} />
                    <Route path="lab" element={<LaboratorijskaVezba role="student"/>} />
                    <Route path="poeni" element={<OsvojeniPoeni/>} />
                    <Route path="aktivnosti" element={<KalendarAktivnosti role="student"/>} />
                </Routes>
            </main>
            <Footer/>
        </div>
        </>
    )
}

export default Student;

//position: 'fixed', top: '10px', left: '10px', 
//id="collapseClass" className="collapse"



/*
<aside>
                <h2>Working on this</h2>
                <Router>
                    <NavigationBar />
                    <Switch>
                        <Route exact path='/' component={StudentHome}/>
                        <Route path='/lab' component={LaboratorijskaVezba}/>
                        <Route path='/poeni' component={OsvojeniPoeni}/>
                        <Route path='/aktivnosti' component={KalendarAktivnosti}/>
                    </Switch>
                </Router>
            </aside>
            <main>
                <h2>Something in main</h2>
                <br></br>
                <h3>Work in progress bro</h3>
                <Button>Useless bootstrap button</Button>
                <p>I should maybe reduce the width of main</p>
            </main>
*/