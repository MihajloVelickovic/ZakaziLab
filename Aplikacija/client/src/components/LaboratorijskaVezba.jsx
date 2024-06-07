import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance'
import '../styles/LaboratorijskaVezba.css'

const LaboratorijskaVezba = ({ role }) => {
    const [labs, setLabs] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [computers, setComputers] = useState([]);

    useEffect(() => {
        // Fetch all labs when the component mounts
        axiosInstance.get('/lab/findAll').then(response => {
            setLabs(response.data);
        }).catch(error => {
            console.error('There was an error fetching the labs!', error);
        });
    }, []);

    const handleLabClick = async (labName) => {
        // Fetch subjects when a lab is clicked
        var lab = labName;
        console.log(lab);
        await axiosInstance.post(`/subject/filteredFind`, {lab}).then(response => {
            setSelectedLab(labName);
            setSubjects(response.data);
        }).catch(error => {
            console.error('There was an error fetching the subjects!', error);
        });
        // axiosInstance.get(`/subject/findAll`).then(response => {
        //     setSelectedLab(labName);
        //     setSubjects(response.data);
        // }).catch(error => {
        //     console.error('There was an error fetching the subjects!', error);
        // });
    };

    const handleSubjectClick = (subject) => {
        // Fetch sessions when a subject is clicked
        // axiosInstance.get(`/api/subject/${subjectId}/sessions`).then(response => {
        //     setSelectedSubject(subjectId);
        //     setSessions(response.data);
        // }).catch(error => {
        //     console.error('There was an error fetching the sessions!', error);
        // });
        console.log(subject);
        setSelectedSubject(subject);
        setSessions(subject.sessions);
    };

    const handleSessionClick = (session) => {
        // Fetch computers when a session is clicked
        // axiosInstance.get(`/api/session/${sessionId}/computers`).then(response => {
        //     setSelectedSession(sessionId);
        //     setComputers(response.data);
        // }).catch(error => {
        //     console.error('There was an error fetching the computers!', error);
        // });
        setSelectedSession(session);
        console.log("selected session: ", session);
        setComputers(session.classroom.computers);
        console.log("computers: ", session.classroom.computers);
    };

    const handleComputerClick = (computer) => {
        //you should show that form here
    }

    const renderStudentLab = () => (
        <>
            <h2>Student: Uraditi neki zadatak inspirisan DnD-em</h2>
        </>
    );

    const renderProfessorLab = () => (
        <>
            <h2>Professor: Uraditi neki zadatak inspirisan DnD-em</h2>
        </>
    );

    const renderAdminLab = () => (
        <>
            <h2>Admin: Uraditi neki zadatak inspirisan DnD-em</h2>
        </>
    );

    const renderLabs = () => (
        <div>
            <h3>Labs</h3>
            {labs.map(lab => (
                <button key={lab._id} onClick={() => handleLabClick(lab.name)}>{lab.name}</button>
            ))}
        </div>
    );

    const renderSubjects = () => (
        <div>
            <h3>Subjects</h3>
            {subjects.map(subject => (
                <button key={subject._id} onClick={() => handleSubjectClick(subject)}>{subject.desc}</button>
            ))}
        </div>
    );

    const renderSessions = () => (
        <div>
            <h3>Sessions</h3>
            {sessions.map(session => (
                <button 
                    key={session._id} 
                    onClick={() => handleSessionClick(session)}
                    disabled={new Date(session.date) < new Date()}
                >
                    {session.time}
                </button>
            ))}
        </div>
    );

    const renderComputers = () => (
        <div>
            <h3>Computers</h3>
            {computers.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((computer, colIndex) => (
                        <button 
                            key={colIndex} 
                            style={{
                                backgroundColor: computer.malfunctioned ? 'red' : computer.taken ? 'yellow' : 'green'
                            }}
                            onClick={() => handleComputerClick(computer)}
                            disabled={computer.malfunctioned}
                        >
                            {computer.name}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );

    let renderContext;
    switch (role) {
        case 'admin':
            renderContext = renderAdminLab();
            break;
        case 'professor':
            renderContext = renderProfessorLab();
            break;
        case 'student':
        default:
            renderContext = renderStudentLab();
            break;
    }

    return (
        <>
            <div>
                <h2>This is the laboratories section</h2>
                {renderContext}
                {renderLabs()}
                {selectedLab && renderSubjects()}
                {selectedSubject && renderSessions()}
                {selectedSession && renderComputers()}
            </div>
        </>
    )
}

export default LaboratorijskaVezba;
