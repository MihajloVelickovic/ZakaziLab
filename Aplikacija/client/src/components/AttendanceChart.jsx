import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import '../styles/AttendanceChart.css';
import axiosInstance from '../utils/axiosInstance';

const AttendanceChart = () => {
    const [chartData, setChartData] = useState(null);
    const [labs, setLabs] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);


    const handleLabClick = async (labName) => {
        if (selectedLab){
            console.log("uso je u prvo");
            setSelectedSubject(null);
        }
        if (selectedLab && selectedLab == labName) {
            console.log("uso je u drugo");
            setSelectedLab(null);
        }
        else {
            console.log("uso je u trece");
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
        if (selectedSubject){
        }
        if (selectedSubject && subject == selectedSubject){
            setSelectedSubject(null);
        }
        else {
            setSelectedSubject(subject);
        }
    };

    const renderLabs = () => (
        <div>
            <h3>Vežbe</h3>
            {labs.map(lab => (
                <button key={lab._id} onClick={() => handleLabClick(lab.name)}>{lab.name}</button>
            ))}
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

    const fetchLabs = async () => {
        axiosInstance.get('/lab/findAll').then(response => {
            setLabs(response.data);
            console.log(response.data);
        }).catch(error => {
            console.error('There was an error fetching the labs!', error);
        });
    }
    useEffect(() => {
        console.log("hey");
        fetchLabs();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            const makeChart = () => {
                const sessionAttendance = selectedSubject.sessions.map(session => {
                    const studentCount = session.classroom.computers.flat().filter(computer => !computer.free).length;
                    return {
                        time: session.time,
                        studentCount
                    };
                });
                const data = sessionAttendance;
                const labels = data.map(session => new Date(session.time).toLocaleString());
                const studentCounts = data.map(session => session.studentCount);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Broj prisustva',
                            data: studentCounts,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        }
                    ]
                });
            };
            makeChart();
        }
    }, [selectedSubject]);

    return (
        <>
            <div className="chartContainer">
            {renderLabs()}
            {selectedLab && renderSubjects()}
            </div>
            
            {selectedSubject &&
                <div className="attendance-chart size-stuff">
                    <h3>Graf prisustva</h3>
                    {chartData ? (
                        <Bar data={chartData} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            }
        </>
    );
};

export default AttendanceChart;
