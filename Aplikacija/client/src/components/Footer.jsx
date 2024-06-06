import React from "react";
import '../styles/Footer.css';

const Footer = () => { 
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <p>&copy; 2024 ZakažiLab</p>
                <p><span className="version">Verzija alpha0.0</span></p>
            </div>
        </footer>
    )
}

export default Footer;