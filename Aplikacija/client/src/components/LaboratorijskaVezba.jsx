import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance'
import '../styles/LaboratorijskaVezba.css'
import AddLabModal from './AddLabModal';


const LaboratorijskaVezba = ({ role }) => {
    const [labs, setLabs] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [computers, setComputers] = useState([]);
    const [actionModal, setActionModal] = useState({ visible: false, computer: null, action: '', grade: '' });
    const [showAddLabModal, setShowAddLabModal] = useState(false); // New state for Add Lab modal

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
            console.log("uso je u prvo");
            setComputers(null);
            setSelectedSession(null);
            setSessions(null);
            setSelectedSubject(null);
        }
        if (selectedLab && selectedLab == labName) {
            console.log("uso je u drugo");
            setSubjects(null);
            setSelectedLab(null);
        }
        else {
            console.log("uso je u trece");
            //setSelectedLab(labName);
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

    const handleStudentComputerClick = async (computer) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const currentUserIndex = user ? user.index : null;
        console.log(currentUserIndex);

        if (!currentUserIndex) {
            console.error("No user found!");
            return;
        }

        var userIsOccupying = false;
        var computerUserIsOccupying;
        var sessionIsOccupying;
        for (const sessionIteration of selectedSubject.sessions) {
            sessionIteration.classroom.computers.map(r => r.map(
                comp => {
                    if (comp.free)
                        return comp;
                    if (comp.student && comp.student.student.index == currentUserIndex) {
                        userIsOccupying = true;
                        sessionIsOccupying = sessionIteration;
                        computerUserIsOccupying = comp;
                    }
                    return comp;
                }
            ));
        }

        const occupiedComputer = computer.student?true:false;
        if (occupiedComputer) {
            console.log("that computer is taken >:3");
            console.log(computer);
            alert("that computer is taken >:3");
        }
        else if (userIsOccupying) {
            // Ask if they want to switch computers or sessions
            const confirmSwitch = window.confirm('You are already using a computer. Do you want to switch?');
            if (confirmSwitch) {
                // Update backend to switch computers
                //switchComputer(computerUserIsOccupying, computer, user);
                console.log("computer clicked", computer);
                console.log("currently occupied comptuer", computerUserIsOccupying);
                await freeComputer(computerUserIsOccupying, sessionIsOccupying);
                await occupyComputer(computer, user);
            }
        } else {
            // Occupy the new computer
            console.log("prazno je ovde, mozes ti!");
            occupyComputer(computer, user);
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

    const occupyComputer = async (computer, student) => {
        console.log("occupying computer");
        var subjectId = selectedSubject._id;
        var sessionId = selectedSession._id;
        var updatedComputer = computer;
        try {
            let studentEntryOfUser = await axiosInstance.post('/studentEntry/filteredFind', {student: student._id, labName : selectedLab});
            console.log("ok for now");
            updatedComputer.student = studentEntryOfUser.data[0];
            console.log("ok even now");
            updatedComputer.free = false;
            console.log("updated computer", updatedComputer);

            const response = await axiosInstance.patch(`/subject/updateComputer`, {subjectId, sessionId, computer: updatedComputer});
            setActionModal({ visible: false, computer: null, action: '', grade: '' });
            // setComputers(computers.map(row => row.map(comp => 
            //     comp._id === computer._id ? { ...comp, taken: false, student: null } : comp
            // )));
        } catch (error) {
            console.error('There was an error freeing the computer!', error);
        }
    };

    const switchComputer = async (oldComputer, newComputer, student) => {
        console.log("switching computer, but not really");
        var subjectId = selectedSubject._id;
        var sessionId = selectedSession._id;
        var updatedComputerOld = oldComputer;
        var updatedComputerNew = newComputer;
        try {
            let studentEntryOfUser = await axiosInstance.post('/studentEntry/filteredFind', {student: student._id, labName : selectedLab});
            updatedComputerOld.student = "";
            updatedComputerOld.free = true;
            const responseOld = await axiosInstance.patch(`/subject/updateComputer`, {subjectId, sessionId, computer: updatedComputerOld});

            updatedComputerNew.student = studentEntryOfUser.data[0];
            updatedComputerNew.free = false;
            const responseNew = await axiosInstance.patch(`/subject/updateComputer`, {subjectId, sessionId, computer: updatedComputerNew});
            setActionModal({ visible: false, computer: null, action: '', grade: '' });
            // setComputers(computers.map(row => row.map(comp => 
            //     comp._id === computer._id ? { ...comp, taken: false, student: null } : comp
            // )));
        } catch (error) {
            console.error('There was an error freeing the computer!', error);
        }
        
    };

    const freeComputer = async (computer, sessionComp) => {

        var subjectId = selectedSubject._id;
        var sessionId = sessionComp._id;
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

    // const renderLabs = () => (
    //     <div>
    //         <h3>Vežbe</h3>
    //         {labs.map(lab => (
    //             <button key={lab._id} onClick={() => handleLabClick(lab.name)}>{lab.name}</button>
    //         ))}
    //     </div>
    // );

    const renderLabs = () => (
        <div>
            <h3>Vežbe</h3>
            {labs.map(lab => (
                <button key={lab._id} onClick={() => handleLabClick(lab.name)}>{lab.name}</button>
            ))}
            {(role === 'admin' || role === 'assistant' || role === 'professor') && (
                <button onClick={() => setShowAddLabModal(true)}>Dodaj laboratorijsku vežbu</button>
            )}
        </div>
    );

    const renderSubjects = () => (
        <div>
            <h3>Teme</h3>
            {subjects.map(subject => (
                <button key={subject._id} onClick={() => handleSubjectClick(subject)}>{subject.desc}</button>
            ))}
        </div>
    );

    const renderSessions = () => (
        <div>
            <h3>Termini</h3>
            <p>{selectedSubject? selectedSubject.date.split('T')[0]: <></>}</p>
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
            <h3>Računari</h3>              
            <p>{selectedSession? selectedSession.time.split('T')[1].split('.')[0] : <></>}</p>
            {computers.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex', padding: '10px' }} >
                    {row.map((computer, colIndex) => (
                        <button 
                            key={colIndex} 
                            className='laboratoryGridItem'
                            style={{
                                padding: '10px',backgroundColor: computer.malfunctioned ? 'red' : computer.free ? 'green' : 
                                    computer.student? computer.student.attendance[selectedSubject.ordNum-1]? 'darkorange' : 'yellow' : 'grey'
                            }}
                            onClick={() => handleComputerClick(computer)}
                            disabled={role == 'student' && computer.malfunctioned}
                        >
                            {/* {computer.taken == true && computer.student.index} */}
                            
                            {computer.malfunctioned? "N/A": computer.free? "S" : computer.student? computer.student.student.index : "taken"}
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
                <h3>Upravljanje računarom</h3>
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
                                Oslobodi računar
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    name="action" 
                                    value="grade" 
                                    checked={action === 'grade'} 
                                    onChange={() => setActionModal({ ...actionModal, action: 'grade' })}
                                />
                                Oceni studenta
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
                freeComputer(computer, selectedSession);
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
    

    return (
        <>
            <div>
                <h2>This is the laboratories section</h2>
                {renderLabs()}
                {selectedLab && renderSubjects()}
                {selectedSubject && renderSessions()}
                {selectedSession && renderComputers()}
                {actionModal.visible && renderActionModal()}
                {showAddLabModal && <AddLabModal onClose={() => setShowAddLabModal(false)} />}
            </div>
        </>
    )
}

export default LaboratorijskaVezba;
