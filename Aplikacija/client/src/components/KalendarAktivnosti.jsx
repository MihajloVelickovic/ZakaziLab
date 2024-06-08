
import React, { useState, useEffect } from "react";
import axiosInstance from '../utils/axiosInstance';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/KalendarAktivnosti.css';

const KalendarAktivnosti = () => {
    const [labSchedule, setLabSchedule] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [hoveredSubject, setHoveredSubject] = useState(null);

    useEffect(() => {
        fetchLabSchedule();
    }, []);

    const fetchLabSchedule = async () => {
        try {
            const response = await axiosInstance.get('/subject/findAll');
            setLabSchedule(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching lab schedule:', error.response ? error.response.data : error.message);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const subject = labSchedule.find(item => new Date(item.date).toDateString() === date.toDateString());
        setHoveredSubject(subject ? subject.lab.split("_")[0] + " / " + subject.desc : null);
    };

    const getTileClassNames = ({ date }) => {
        const subject = labSchedule.find(item => new Date(item.date).toDateString() === date.toDateString());
        return subject ? 'highlighted-date' : null;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-wrapper">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileClassName={getTileClassNames}
                />
            </div>
            <div className="hovered-subject">
                {hoveredSubject && <p>Odabrana tema: {hoveredSubject}</p>}
            </div>
        </div>
    );
}

export default KalendarAktivnosti;








    // const renderStudentActivities = () => (
    //     <>
    //         <h2>Student: Imas toliko toga da me mrzi da ih listam ovde.</h2>
    //     </>
    // );
    // const renderProfessorActivities = () => (
    //     <>
    //         <h2>Professor: Imas toliko toga da me mrzi da ih listam ovde.</h2>
    //     </>
    // );
    // const renderAdminActivities = () => (
    //     <>
    //         <h2>Admin: Imas toliko toga da me mrzi da ih listam ovde.</h2>
    //     </>
    // );

    // let renderContext;
    // switch (role) {
    //     case 'admin':
    //         renderContext = renderAdminActivities();
    //         break;
    //     case 'professor':
    //         renderContext = renderProfessorActivities();
    //         break;
    //     case 'student':
    //     default:
    //         renderContext = renderStudentActivities();
    //         break;
    // }

    // return (
    //     <>
    //     <div>
    //         <h2>This is the activities section</h2>
    //         {renderContext}
    //     </div>
    //     </>
    // )

   

