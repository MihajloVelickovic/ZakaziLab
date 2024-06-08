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
    const [gradeModal, setGradeModal] = useState({ visible: false, computer: null, grade: '' });

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
        setSelectedSession(session);
        console.log("selected session: ", session);
        setComputers(session.classroom.computers);
        console.log("computers: ", session.classroom.computers);
    };

    const handleComputerClick = (computer) => {
        if (role === 'student') {
            handleStudentComputerClick(computer);
        } else {
            handleNonStudentComputerClick(computer);
        }
    }

    const handleStudentComputerClick = (computer) => {
        var user = null;
        if (localStorage.getItem('user')){
            user = JSON.parse(localStorage.getItem('user'));
        }
        var Index = user? user.index : -1;
        // Check if the student is already occupying a computer
        const userIsOccupying = sessions.flatMap(session => session.classroom.computers)
            .find(comp => comp.student && comp.student.student === user);
        const occupiedComputer = computer.student?true:false;
        if (occupiedComputer) {
            console.log("that computer is taken >:3");
            alert("that computer is taken >:3");
        }
        else if (userIsOccupying) {
            // Ask if they want to switch computers or sessions
            const confirmSwitch = window.confirm('You are already using a computer. Do you want to switch?');
            if (confirmSwitch) {
                // Update backend to switch computers
                switchComputer(occupiedComputer, computer);
            }
        } else {
            // Occupy the new computer
            console.log("prazno je ovde, mozes ti!");
            occupyComputer(computer);
        }
    };

    const handleNonStudentComputerClick = (computer) => {
        const options = [];
        if (computer.taken) {
            options.push('Free Computer');
            options.push('Grade Student');
        }
        options.push('Set Malfunctioned');

        const selectedOption = window.prompt(`Choose an option:\n${options.join('\n')}`);
        
        switch (selectedOption) {
            case 'Free Computer':
                freeComputer(computer);
                break;
            case 'Grade Student':
                gradeStudent(computer);
                break;
            case 'Set Malfunctioned':
                setMalfunctioned(computer);
                break;
            default:
                console.log('Invalid option selected');
        }
    };

    const occupyComputer = async (computer) => {
        // try {
        //     await axiosInstance.post(`/computer/occupy`, { computerId: computer._id, studentId: currentStudentId });
        //     setComputers(computers.map(row => row.map(comp => 
        //         comp._id === computer._id ? { ...comp, taken: true, student: { id: currentStudentId } } : comp
        //     )));
        // } catch (error) {
        //     console.error('There was an error occupying the computer!', error);
        // }
    };

    const switchComputer = async (oldComputer, newComputer) => {
        // try {
        //     await axiosInstance.post(`/computer/switch`, { oldComputerId: oldComputer._id, newComputerId: newComputer._id, studentId: currentStudentId });
        //     setComputers(computers.map(row => row.map(comp => {
        //         if (comp._id === oldComputer._id) {
        //             return { ...comp, taken: false, student: null };
        //         } else if (comp._id === newComputer._id) {
        //             return { ...comp, taken: true, student: { id: currentStudentId } };
        //         } else {
        //             return comp;
        //         }
        //     })));
        // } catch (error) {
        //     console.error('There was an error switching computers!', error);
        // }
    };

    const freeComputer = async (computer) => {
        // try {
        //     await axiosInstance.post(`/computer/free`, { computerId: computer._id });
        //     setComputers(computers.map(row => row.map(comp => 
        //         comp._id === computer._id ? { ...comp, taken: false, student: null } : comp
        //     )));
        // } catch (error) {
        //     console.error('There was an error freeing the computer!', error);
        // }
    };

    const gradeStudent = async (computer, grade) => {
        // const ordNum = selectedSubject.ordNum;
        // try {
        //     await axiosInstance.post(`/student/grade`, { studentId: computer.student.id, ordNum, grade });
        //     setGradeModal({ visible: false, computer: null, grade: '' });
        // } catch (error) {
        //     console.error('There was an error grading the student!', error);
        // }
    };

    const setMalfunctioned = async (computer) => {
        // try {
        //     await axiosInstance.post(`/computer/malfunction`, { computerId: computer._id });
        //     setComputers(computers.map(row => row.map(comp => 
        //         comp._id === computer._id ? { ...comp, malfunctioned: true } : comp
        //     )));
        // } catch (error) {
        //     console.error('There was an error setting the computer as malfunctioned!', error);
        // }
    };




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
            {sessions.map(session => {
                const extractTime = (datetime) => {
                    const timePart = datetime.split('T')[1];
                    const [hours, minutes] = timePart.split(':');
                    return `${hours}:${minutes}`;
                };
                const formattedTime = extractTime(session.time);
                return (
                    <button 
                        key={session._id} 
                        onClick={() => handleSessionClick(session)}
                        disabled={new Date(session.date) < new Date()}
                    >
                        {formattedTime}
                    </button>
            )})}
        </div>
    );

    const renderComputers = () => (
        <div>
            <h3>Computers</h3>
            {computers.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex', padding: '10px' }} >
                    {row.map((computer, colIndex) => (
                        <button 
                            key={colIndex} 
                            className='laboratoryGridItem'
                            style={{
                                padding: '10px',backgroundColor: computer.malfunctioned ? 'red' : computer.free ? 'green' : 'yellow'
                            }}
                            onClick={() => handleComputerClick(computer)}
                            disabled={computer.malfunctioned}
                        >
                            {/* {computer.taken == true && computer.student.index} */}
                            {computer.malfunctioned? "malfunctioned": computer.free? "free" : "taken"}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );

    const renderGradeModal = () => (
        <div className="modal">
            <h3>Grade Student</h3>
            <input 
                type="number" 
                value={gradeModal.grade} 
                onChange={e => setGradeModal({ ...gradeModal, grade: e.target.value })} 
                min="0" 
                max={selectedSubject.maxPoints}
            />
            <button onClick={() => gradeStudent(gradeModal.computer, gradeModal.grade)}>Submit</button>
            <button onClick={() => setGradeModal({ visible: false, computer: null, grade: '' })}>Cancel</button>
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
                {gradeModal.visible && renderGradeModal()}
            </div>
        </>
    )
}

export default LaboratorijskaVezba;
