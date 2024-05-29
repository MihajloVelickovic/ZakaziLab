import { Link, NavLink } from 'react-router-dom';
import '../styles/Header.css';
import '../styles/LoginButton.css';
import { useState } from 'react';
import Brand from "../images/favicon.ico";

const Header=()=>{
    const[menuOpen, setMenuOpen] = useState(false);

    return(
        <header className="header-container">
            <nav className="header-nav">
                <Link to='/' className="title"><img src={Brand} alt="" style={{width:"40px"}} className="rounded-pill"/> ZakažiLab <span className="version">alpha0.0</span></Link>
                <div className="menu" onClick={()=>{
                    setMenuOpen(!menuOpen);
                }}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={menuOpen? "open" : ""}>
                    <li>
                        <p style={{fontSize: "12px", paddingTop: "20px", color: "whitesmoke"}}>Privremeno cu ovde da stavim linkove za stranice</p>
                    </li>
                    <li><NavLink to="/login">
                        <button className="login-button">
                            Prijavi se
                        <div class="arrow-wrapper">
                            <div class="arrow"></div>
                        </div>
                        </button>
                    </NavLink></li>
                    <li><NavLink to="/student">
                        <button className="login-button">
                            Student page
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