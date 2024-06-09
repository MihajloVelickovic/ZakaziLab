import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import '../styles/AddLabModal.css';

const AddLabModal = ({ onClose }) => {
    const [classrooms, setClassrooms] = useState([]);
    const [labData, setLabData] = useState({
        labName: '',
        desc: '',
        mandatory: false,
        subjectNum: 0,
        maxPoints: 0,
        classroom: '',
        subjects: [],               //moze da ostane ovako, ali mora da doda maxPoints na serveru i da preimenuje dates
        studentList: [],            
        timeSlots: [],           
        autoSchedule: false,
    });

    const [studentIndex, setStudentIndex] = useState('');
    const [sessionHour, setSessionHour] = useState('');
    const [sessionMinute, setSessionMinute] = useState('');

    useEffect(() => {
        axiosInstance.get('/classroom/findAll').then(response => {
            setClassrooms(response.data);
        }).catch(error => {
            console.error('There was an error fetching the classrooms!', error);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLabData({
            ...labData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubjectChange = (index, field, value) => {
        const newSubjects = [...labData.subjects];
        newSubjects[index] = {
            ...newSubjects[index],
            [field]: value
        };
        setLabData({
            ...labData,
            subjects: newSubjects
        });
    };

    const addSubject = () => {
        setLabData({
            ...labData,
            subjects: [...labData.subjects, { desc: '', date: '', maxSubjPoints: 0 }]
        });
    };

    const handleAddStudentIndex = () => {
        if (studentIndex.trim()) {
            setLabData({
                ...labData,
                studentList: [...labData.studentList, studentIndex.trim()]
            });
            setStudentIndex('');
        }
    };

    const handleAddSessionTime = () => {
        if (sessionHour.trim() && sessionMinute.trim()) {
            const time = `${sessionHour.padStart(2, '0')}:${sessionMinute.padStart(2, '0')}`;
            setLabData({
                ...labData,
                timeSlots: [...labData.timeSlots, time]
            });
            setSessionHour('');
            setSessionMinute('');
        }
    };

    const handleRemoveStudentIndex = (indexToRemove) => {
        setLabData({
            ...labData,
            studentList: labData.studentList.filter((_, index) => index !== indexToRemove)
        });
    };

    const handleSubmit = async (e) => {         //I added it to be async
        e.preventDefault();
        labData['subjects'] = labData['subjects'].map( subject => {
            subject.date = `${subject.date}T00:00:00Z`;
            return subject;
        })
        console.log(labData);
        await axiosInstance.post('/lab/add', labData).then(response => {
            onClose();
            // Refresh the labs list if needed
        }).catch(error => {
            console.error('There was an error adding the lab!', error);
        });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Dodaj laboratorijsku vežbu</h3>
                <form className='addLabForm' onSubmit={handleSubmit}>
                    <label>
                        Classroom:
                        <select name="classroom" value={labData.classroom} onChange={handleChange}>
                            <option value="">Select Classroom</option>
                            {classrooms.map(classroom => (
                                <option key={classroom._id} value={classroom._id}>{classroom.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Name:
                        <input type="text" name="labName" value={labData.labName} onChange={handleChange} required />
                    </label>
                    <label>
                        Description:
                        <input type="text" name="desc" value={labData.desc} onChange={handleChange} required />
                    </label>
                    <label>
                        Mandatory:
                        <input type="checkbox" name="mandatory" checked={labData.mandatory} onChange={handleChange} />
                    </label>
                    <label>
                        Max Points:
                        <input type="number" min="0" name="maxPoints" value={labData.maxPoints} onChange={handleChange} required />
                    </label>
                    <label>
                        Subject Number:
                        <input type="number" min="0" name="subjectNum" value={labData.subjectNum} onChange={handleChange} required />
                    </label>
                    <div>
                        <h3>Subjects</h3>
                        {labData.subjects.map((subject, index) => (
                            <div key={index}>
                                <label>
                                    Description:
                                    <input type="text" value={subject.desc} onChange={(e) => handleSubjectChange(index, 'desc', e.target.value)} required />
                                </label>
                                <label>
                                    Subject Date:
                                    <input type="date" value={subject.date} onChange={(e) => handleSubjectChange(index, 'date', e.target.value)} required />
                                </label>
                                <label>
                                    Max Points:
                                    <input type="number" min="0" value={subject.maxSubjPoints} onChange={(e) => handleSubjectChange(index, 'maxSubjPoints', e.target.value)} required />
                                </label>
                            </div>
                        ))}
                        <button type="button" onClick={addSubject}>Add Subject</button>
                    </div>
                    <label>
                        Student List (indexes):
                        <input
                            type="text"
                            value={studentIndex}
                            onChange={(e) => setStudentIndex(e.target.value)}
                            placeholder="Enter student index"
                        />
                        <button type="button" onClick={handleAddStudentIndex}>Add Index</button>
                        <div>
                            {labData.studentList.map((index, idx) => (
                                <div key={idx}>
                                    {index} <button type="button" onClick={() => handleRemoveStudentIndex(idx)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </label>
                    <div>
                        <h3>Session Times</h3>
                        <label>
                            Hour:
                            <input
                                type="number"
                                value={sessionHour}
                                onChange={(e) => setSessionHour(e.target.value)}
                                min="0"
                                max="23"
                                placeholder="HH"
                                required
                            />
                        </label>
                        <label>
                            Minute:
                            <input
                                type="number"
                                value={sessionMinute}
                                onChange={(e) => setSessionMinute(e.target.value)}
                                min="0"
                                max="59"
                                placeholder="MM"
                                required
                            />
                        </label>
                        <button type="button" onClick={handleAddSessionTime}>Add Session Time</button>
                        <div>
                            {labData.timeSlots.map((time, idx) => (
                                <div key={idx}>{time}</div>
                            ))}
                        </div>
                    </div>
                    <label>
                        Auto Schedule:
                        <input type="checkbox" name="autoSchedule" checked={labData.autoSchedule} onChange={handleChange} />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddLabModal;
