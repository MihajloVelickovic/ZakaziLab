import { Link, NavLink } from 'react-router-dom';
import '../styles/Header.css';
import '../styles/LoginButton.css';
import { useState } from 'react';
import Brand from "../images/logo.ico";
import React, {useContext} from 'react'
//import AuthContext from '../context/AuthContext'

const Header=()=>{
    const[menuOpen, setMenuOpen] = useState(false);
    //let {user, logoutUser} = useContext(AuthContext)

    return(
        <header className="header-container">
            <nav className="header-nav">
                <Link to='/' className="title"><img src={Brand} alt="" style={{width:"60px"}} className="rounded-pill"/> ZakažiLab </Link>
                <div className="menu" onClick={()=>{
                    setMenuOpen(!menuOpen);
                }}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={menuOpen? "open" : ""}>
                    <li><NavLink to="/login">
                        <button className="login-button" style={{marginTop:"15px"}}>
                            Prijavi se
                        <div class="arrow-wrapper">
                            <div class="arrow"></div>
                        </div>
                        </button>
                   </NavLink></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;