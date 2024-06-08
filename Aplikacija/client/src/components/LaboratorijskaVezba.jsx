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
    const [actionModal, setActionModal] = useState({ visible: false, computer: null, action: '', grade: '' });

    useEffect(() => {
        axiosInstance.get('/lab/findAll').then(response => {
            setLabs(response.data);
            console.log(response.data);
        }).catch(error => {
            console.error('There was an error fetching the labs!', error);
        });
        
        console.log("not student clicked", actionModal);
    }, [actionModal]);

    useEffect(() => {
        if (actionModal.action === 'grade' && actionModal.computer && actionModal.computer.student) {
            const ordNum = selectedSubject.ordNum;
            const initialGrade = actionModal.computer.student.points[ordNum-1];
            setActionModal(prevModal => ({ ...prevModal, grade: initialGrade }));
        }
    }, [actionModal.action]);

    const handleLabClick = async (labName) => {
        setActionModal({ visible: false, computer: null, action: '', grade: '' });
        if (selectedLab){
            setComputers(null);
            setSelectedSession(null);
            setSessions(null);
            setSelectedSubject(null);
            setSubjects(null);
        }
        if (selectedLab && selectedLab == labName) {
            setSelectedLab(null);
        }
        else {
            setSelectedLab(null);
            var lab = labName;
            console.log(lab);
            await axiosInstance.post(`/subject/filteredFind`, {lab}).then(response => {
                setSelectedLab(labName);
                setSubjects(response.data);
                console.log("vracene teme: ", response.data)
            }).catch(error => {
                console.error('There was an error fetching the subjects!', error);
            });
        }
        
    };

    const handleSubjectClick = (subject) => {
        setActionModal({ visible: false, computer: null, action: '', grade: '' });

        if (selectedSubject){
            setSessions(null);
            setSelectedSession(null);
            setComputers(null);
        }
        if (selectedSubject && subject == selectedSubject){
            setSelectedSubject(null);
        }
        else {
            setSelectedSubject(subject);
            setSessions(subject.sessions);
        }
    };

    const handleSessionClick = (session) => {
        setActionModal({ visible: false, computer: null, action: '', grade: '' });
        if (session == selectedSession){
            setSelectedSession(null);
            setComputers(null);
        }
        else {
            setSelectedSession(session);
            console.log("selected session: ", session);
            setComputers(session.classroom.computers);
            console.log("computers: ", session.classroom.computers);
        }
        
    };

    const handleComputerClick = (computer) => {
        setActionModal({ visible: false, computer: null, action: '', grade: '' });
        if (role === 'student') {
            handleStudentComputerClick(computer);
        } else {
            setActionModal({ visible: true, computer, action: '', grade: '' });
            console.log("not student clicked", actionModal);
        }
    }

    const handleStudentComputerClick = (computer) => {
        var user = null;
        if (localStorage.getItem('user')){
            user = JSON.parse(localStorage.getItem('user'));
        }
        var Index = user? user.index : -1;
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

    const rerenderSubject = () => {
        var savedComputers = computers;
        var savedSelectedSession = selectedSession;
        var savedSelectedSubject = selectedSubject;        

        setSelectedSubject(null);
        handleSubjectClick(savedSelectedSubject);
        handleSessionClick(savedSelectedSession);
        handleComputerClick(savedComputers);
        console.log('rerendered');

    }

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

        var subjectId = selectedSubject._id;
        var sessionId = selectedSession._id;
        var updatedComputer = computer;
        updatedComputer.student = null;
        updatedComputer.free = true;
        try {
            const response = await axiosInstance.patch(`/subject/updateComputer`, {subjectId, sessionId, computer: updatedComputer});
            setActionModal({ visible: false, computer: null, action: '', grade: '' });
            // setComputers(computers.map(row => row.map(comp => 
            //     comp._id === computer._id ? { ...comp, taken: false, student: null } : comp
            // )));
        } catch (error) {
            console.error('There was an error freeing the computer!', error);
        }
    };

    const gradeStudent = async (computer, grade) => {
        const ordNum = selectedSubject.ordNum - 1;
        const studentEntryId = computer.student._id;
        const modifiedStudentEntry = computer.student;
        modifiedStudentEntry.points[ordNum] = grade;
        modifiedStudentEntry.attendance[ordNum] = true;
        try {
            const response = await axiosInstance.patch(`/studentEntry/update/${studentEntryId}`, modifiedStudentEntry);
            setActionModal({ visible: false, computer: null, action: '', grade: '' });
        } catch (error) {
            console.error('There was an error grading the student!', error);
        }
    };

    const setMalfunctioned = async (computer, malfunctionedStatus) => {

        var parsedName = computer.name.split('/')[1];
        parsedName = parsedName.split('_');
        var c_row = parsedName[1];
        var c_col = parsedName[2];

        console.log("taj odabrani kompjuter je na redu i koloni: ", c_row, c_col);

        try {
            for (const sessionIteration of selectedSubject.sessions) {
                var foundComputer;
                sessionIteration.classroom.computers.map(r => r.map(
                    comp => {
                        var parsedNameComp = comp.name.split('/')[1];
                        parsedNameComp = parsedNameComp.split('_');
                        var c_rowComp = parsedNameComp[1];
                        var c_colComp = parsedNameComp[2];
                        if (c_row === c_rowComp && c_col === c_colComp) {
                            foundComputer = comp;
                            foundComputer.malfunctioned = malfunctionedStatus;
                            foundComputer.free = true;
                            foundComputer.student = null;
                        }
                        return comp;
                    }
                ));

                console.log("computer found: ", foundComputer);

                const response = await axiosInstance.patch(`/subject/updateComputer`, {subjectId : selectedSubject._id, sessionId : sessionIteration._id, computer: foundComputer});
            }

        } catch (error) {
            console.error('There was an error setting the computer as malfunctioned!', error);
        }

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

    const renderComputers = () => (     // Ovde mozda nece da se stampa student index, jer iako je lab populated, mozda subjects nije kada se fetchuje nesto
        <div>
            <h3>Computers</h3>              
            {computers.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex', padding: '10px' }} >
                    {row.map((computer, colIndex) => (
                        <button 
                            key={colIndex} 
                            className='laboratoryGridItem'
                            style={{
                                padding: '10px',backgroundColor: computer.malfunctioned ? 'red' : computer.free ? 'green' : 
                                    computer.student.attendance[selectedSubject.ordNum-1]? 'darkorange' : 'yellow'
                            }}
                            onClick={() => handleComputerClick(computer)}
                            //disabled={computer.malfunctioned}
                        >
                            {/* {computer.taken == true && computer.student.index} */}
                            
                            {computer.malfunctioned? "N/A": computer.free? "free" : computer.student? computer.student.student.index : "taken"}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );

    const renderActionModal = () => {
        const { computer, action } = actionModal;
        const isComputerMalfunctioned = computer.malfunctioned;
    
        return (
            <div className="computerClickOptions">
                <h3>Computer Actions</h3>
                <form onSubmit={handleSubmitAction}>
                    {!computer.free && (
                        <>
                            <label>
                                <input 
                                    type="radio" 
                                    name="action" 
                                    value="free" 
                                    checked={action === 'free'} 
                                    onChange={() => setActionModal({ ...actionModal, action: 'free' })}
                                />
                                Free Computer
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    name="action" 
                                    value="grade" 
                                    checked={action === 'grade'} 
                                    onChange={() => setActionModal({ ...actionModal, action: 'grade' })}
                                />
                                Grade Student
                            </label>
                        </>
                    )}
                    <label>
                        <input 
                            type="radio" 
                            name="action" 
                            value="malfunction" 
                            checked={action === 'malfunction'} 
                            onChange={() => setActionModal({ ...actionModal, action: 'malfunction' })}
                        />
                        {isComputerMalfunctioned ? 'Fix Computer' : 'Set as Malfunctioned'}
                    </label>
                    {action === 'grade' && (
                        <div>
                            <label>
                                Grade: 
                                <input 
                                    type="number" 
                                    value={actionModal.grade} 
                                    onChange={(e) => setActionModal({ ...actionModal, grade: e.target.value })}
                                    max={selectedSubject.maxPoints} 
                                    min={0}
                                />
                            </label>
                        </div>
                    )}
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => setActionModal({ visible: false, computer: null, action: '', grade: '' })}>Cancel</button>
                </form>
            </div>        
        );
    };
    
    const handleSubmitAction = (e) => {
        e.preventDefault();
        const { computer, action, grade } = actionModal;
        switch (action) {
            case 'free':
                freeComputer(computer);
                break;
            case 'grade':
                gradeStudent(computer, grade);
                break;
            case 'malfunction':
                setMalfunctioned(computer, !computer.malfunctioned); // Toggle malfunctioned status
                break;
            default:
                break;
        }
        setActionModal({ visible: false, computer: null, action: '', grade: '' });
    };
    

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
                {actionModal.visible && renderActionModal()}
            </div>
        </>
    )
}

export default LaboratorijskaVezba;
