import { Nav, Navbar, NavLink } from 'react-bootstrap';
import { Link } from "react-router-dom"
import React from "react";
import Brand from "../images/favicon.ico";

const NavigationBar = (show) => {
    return (
        <Navbar variant='black' Navbar='black'>
            
            <Navbar.Toggle aria-controls='navbarScroll' data-bs-target="#navbarScroll" style={{backgroundColor:"lightgrey"}}/>
            <Navbar.Collapse id='navbarScroll'>
                <nav className="flex-column" style={{alignItems:"start"}}>
                    <Navbar.Brand as={Link} to="/">
                        <img src={Brand} alt="" style={{width:"40px"}} className="rounded-pill"/>
                        <span style={{paddingLeft:"20px"}}>ZakažiLab</span>
                    </Navbar.Brand>
                    <NavLink className="nav-item bi bi-house" eventKey="1" as={Link} to="home"> Home</NavLink>
                    <NavLink eventKey="2" as={Link} to="lab"><i className="fa fa-flask" ></i> Laboratorijske vezbe</NavLink>
                    <NavLink className="bi bi-card-checklist" eventKey="3" as={Link} to="poeni" > Osvojeni poeni</NavLink>
                    <NavLink className="bi bi-calendar3" eventKey="4" as={Link} to="aktivnosti" > Kalendar aktivnosti</NavLink>
                </nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationBar;


/* <Navbar collapseOnSelect expand="sm" bg="dark" variant='dark'>
            <Navbar.Toggle aria-controls='navbarScroll' data-bs-target="#navbarScroll" />
            <Navbar.Collapse id='navbarScroll'>
                <Nav>
                    <NavLink eventKey="1" as={Link} to="home">Home</NavLink>
                    <NavLink eventKey="2" as={Link} to="lab">Laboratorijske vezbe</NavLink>
                    <NavLink eventKey="3" as={Link} to="poeni">Osvojeni poeni</NavLink>
                    <NavLink eventKey="4" as={Link} to="aktivnosti">Kalendar aktivnosti</NavLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar> */


/*
const [expanded, setExpanded] = useState(false);

    const toggleNavbar = () => {
        setExpanded(!expanded);
    };

    return (
        <Navbar expand="xl" bg="dark" variant="dark">
            <Navbar.Brand as={Link} to="/">ZakažiLab</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" onClick={toggleNavbar} />
            <Navbar.Collapse id="navbarScroll" className={`${expanded ? 'show' : ''}`}>
                <Nav className="mr-auto flex-column">
                    <NavLink eventKey="1" as={Link} to="home" style={{display:"block"}}>Home</NavLink>
                    <NavLink eventKey="2" as={Link} to="lab"style={{display:"block"}}>Laboratorijske vezbe</NavLink>
                    <NavLink eventKey="3" as={Link} to="poeni" style={{display:"block"}}>Osvojeni poeni</NavLink>
                    <NavLink eventKey="4" as={Link} to="aktivnosti" style={{display:"block"}}>Kalendar aktivnosti</NavLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
*/