import { Navbar, NavLink } from 'react-bootstrap';
import { Link } from "react-router-dom"
import React from "react";

const Sidebar = ({ show, role }) => {
    const renderStudentLinks = () => (
        <>
        <NavLink className="sidebar-buttons nav-item bi bi-house" eventKey="1" as={Link} to="home"> Početna</NavLink>
        <NavLink className="sidebar-buttons" eventKey="2" as={Link} to="lab"><i className="fa fa-flask" ></i> Laboratorijske vežbe</NavLink>
        <NavLink className="sidebar-buttons bi bi-card-checklist" eventKey="3" as={Link} to="poeni" > Osvojeni poeni</NavLink>
        <NavLink className="sidebar-buttons bi bi-calendar3" eventKey="4" as={Link} to="aktivnosti" > Kalendar aktivnosti</NavLink>
        </>
    );

    const renderAdminLinks = () => (
        <>
            <NavLink className="bi bi-person" eventKey="1" as={Link} to="studenti"> Studenti</NavLink>
            <NavLink className="bi bi-person" eventKey="2" as={Link} to="profesori"> Profesori</NavLink>
            <NavLink className="bi bi-person" eventKey="3" as={Link} to="asistenti"> Asistenti</NavLink>
        </>
    );

    const renderProfessorLinks = () => (
        <>
        <NavLink className="sidebar-buttons" eventKey="2" as={Link} to="lab"><i className="fa fa-flask" ></i> Laboratorijske vežbe</NavLink>
        <NavLink className="sidebar-buttons bi bi-card-checklist" eventKey="3" as={Link} to="IzvestajOPoenima" > Izveštaj o poenima</NavLink>
        <NavLink className="sidebar-buttons bi bi-calendar3" eventKey="4" as={Link} to="aktivnosti" > Kalendar aktivnosti</NavLink>
        <NavLink className="sidebar-buttons" eventKey="5" as={Link} to="kabinet" ><i class="fa-solid fa-display"></i> Kabineti</NavLink>
        </>
    );

    const renderAssistantLinks = () => (
        <>
        <NavLink className="sidebar-buttons" eventKey="2" as={Link} to="lab"><i className="fa fa-flask" ></i> Laboratorijske vežbe</NavLink>
        <NavLink className="sidebar-buttons bi bi-card-checklist" eventKey="3" as={Link} to="IzvestajOPoenima" > Izveštaj o poenima</NavLink>
        <NavLink className="sidebar-buttons bi bi-calendar3" eventKey="4" as={Link} to="aktivnosti" > Kalendar aktivnosti</NavLink>
        <NavLink className="sidebar-buttons" eventKey="5" as={Link} to="kabinet" ><i class="fa-solid fa-display"></i> Kabineti</NavLink>
        <NavLink className="sidebar-buttons" eventKey="6" as={Link} to="graf prisustva" ><i class="bi bi-bar-chart-line"></i> Graf prisustva</NavLink>
        </>
    );

    let navLinks;
    switch (role) {
        case 'admin':
            navLinks = renderAdminLinks();
            break;
        case 'professor':
            navLinks = renderProfessorLinks();
            break;
        case 'professor':
            navLinks = renderAssistantLinks();
            break;
        case 'student':
        default:
            navLinks = renderStudentLinks();
            break;
    }

    return (
        <Navbar variant='black' Navbar='black'>
            <Navbar.Toggle aria-controls='navbarScroll' data-bs-target="#navbarScroll" />
            <Navbar.Collapse id='navbarScroll'>
                <div className="sidebar-buttons-wrapper">
                    {navLinks}
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Sidebar;


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