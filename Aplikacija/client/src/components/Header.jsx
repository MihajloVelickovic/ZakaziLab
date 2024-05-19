import { Link, NavLink } from 'react-router-dom';
import '../styles/Header.css';
import { useState } from 'react';

const Header=()=>{
    const[menuOpen, setMenuOpen] = useState(false);
    return(
        <header className="header-container">
            <nav>
                <Link to='/' className="title">ZakaziLab <span className="version">alpha0.0</span></Link>
                <div className="menu" onClick={()=>{
                    setMenuOpen(!menuOpen);
                }}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={menuOpen? "open" : ""}>
                    <li><NavLink to="login">Prijavi se</NavLink></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;