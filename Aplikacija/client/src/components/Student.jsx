//import { Link, NavLink } from 'react-router-dom';
import React from "react";
import '../styles/Student.css';
import { useState } from "react";



import NavigationBar from "./NavigationBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Route, Routes} from 'react-router-dom';
import StudentHome from "./StudentHome";
import LaboratorijskaVezba from "./LaboratorijskaVezba";
import OsvojeniPoeni from "./OsvojeniPoeni";
import KalendarAktivnosti from "./KalendarAktivnosti";

import { Button } from "react-bootstrap";

const Student = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
    return (
        <>
        <header className="StudentHeader">            
            <div>
            <Button
                    onClick={toggleSidebar} 
                    style={{ zIndex: 1000, backgroundColor:"grey", borderColor:"grey"}}>
                    <i className="fa-solid fa-bars"></i>
                    <span style={{paddingLeft:"10px"}}>
                        {showSidebar ? 'Hide' : 'Show'} Menu
                    </span>
                </Button>
            </div>
            <div style={{paddingLeft:"80px"}}>
                ZakažiLab
            </div>
        </header>
        <div className="studentContainer">            
            <aside className="StudentAside" style={{left: showSidebar ? '0' : '-250px', position:"fixed"}}> 
                {/* <NavigationBar /> */}
                <NavigationBar show={showSidebar} />
            </aside>
            <main style={{ marginLeft: showSidebar ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
                <Routes>
                    <Route path="home" element={<StudentHome />} />
                    <Route path="lab" element={<LaboratorijskaVezba />} />
                    <Route path="poeni" element={<OsvojeniPoeni />} />
                    <Route path="aktivnosti" element={<KalendarAktivnosti />} />
                </Routes>
            </main>
            
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