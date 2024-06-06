import React, { useEffect, useState } from "react";
import "../styles/OsvojeniPoeni.css";
import axiosInstance from '../utils/axiosInstance'
//import useAxios from "../utils/useAxios";


var user = null;
if (localStorage.getItem('user')){
    user = JSON.parse(localStorage.getItem('user'));
    console.log("user sa localStorage-a: ", user);
}
var Index = user? user.index : -1;
var idStudenta;
//console.log(ID);
//console.log("user je: ", user);

const fetchData = async (idStudenta) => {
    try {

        // const response = await fetch(`http://127.0.0.1:1738/studentEntry/filteredFind`, {
        //         method: "POST",
        //         body: JSON.stringify({student: user}),
        //         //OVO DODAJ LAKI :DDD
        //         headers: {/*"Authorization": `Bearer ${localStorage.getItem("JWT")}`,*/"Content-Type": "application/json"}
        //     });
        var student = idStudenta;
        let response = await axiosInstance.post('/studentEntry/filteredFind', {student});
        if (!response.ok) {
            console.log('Failed to fetch data', response);
        }

        //const data = await response.json();
        const data = response.data;
        console.log("ovo sam fethovao buraz: ", data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const OsvojeniPoeni = () => {
    const [entries, setEntries] = useState([]);
    const [selectedLabs, setSelectedLabs] = useState([]);
    const [studentIndex, setStudentIndex] = useState(null);
    

    useEffect(() => {
        if (localStorage.getItem('user')){
            user = JSON.parse(localStorage.getItem('user'));
            console.log("user sa localStorage-a: ", user);
            Index = user.index;
        }
        if (user){
            idStudenta = user._id;
            fetchData(idStudenta)
            .then((res) => {
                console.log('Fetched data:', res);
                // const filteredEntries = res.filter(entry => entry.student.index === 18569);
                const filteredEntries = res;
                setEntries(filteredEntries);
                if (filteredEntries.length > 0) {
                    setStudentIndex(filteredEntries[0].student.index);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }
        
    }, []);

    const toggleLab = (labName) => {
        setSelectedLabs(prevSelectedLabs => {
            if (prevSelectedLabs.includes(labName)) {
                return prevSelectedLabs.filter(name => name !== labName);
            } else {
                return [...prevSelectedLabs, labName];
            }
        });
    };

    const renderTables = () => {
        const tables = {};

        entries.forEach(entry => {
            if (!tables[entry.labName]) {
                tables[entry.labName] = {
                    points: [],
                    totalPoints: 0
                };
            }
            tables[entry.labName].points.push(...entry.points);
            tables[entry.labName].totalPoints += entry.points.reduce((acc, cur) => acc + cur, 0);
        });

        return (
            <div>
                <h2>Osvojeni poeni na laboratorijskim vezbama</h2>
                <p>Student: {user.name} {user.lastName}</p>
                <p>Indeks: {Index}</p>
                {Object.keys(tables).map((labName, index) => (
                    <div key={index} className="lab-table">
                        <button className={selectedLabs.includes(labName) ? "active" : ""} onClick={() => toggleLab(labName)}>{labName}</button>
                        <div className={selectedLabs.includes(labName) ? "table-open" : "table-closed"}>
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Redni broj vezbe</th>
                                        <th>Broj poena</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tables[labName].points.map((points, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{points}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td><strong>Ukupno:</strong></td>
                                        <td><strong>{tables[labName].totalPoints}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            {entries.length > 0 ? (
                renderTables()
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default OsvojeniPoeni;


























    // const yourDataObject = { labName: "OOP"};
    // , {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(yourDataObject)


        
    // return (
        
    //     <>
    //         <h2>Nula bajo moj, nula.</h2>
    //         <div className="resultati">
    //         </div>
    //     </>   
    // )


       // const response = fetch("http://127.0.0.1:1738/studentEntry/findAll")
    //                 .then(res => res.json())
    //                 .then(data => {
    //                     const filteredData = data.filter(entry => 
    //                         entry.student.index === Sindex
    //                     );
    //                     //filteredData.forEach(p => console.log(p));
    //                     return filteredData;
    //                 })
    //                 .then(result => {
    //                     console.log(result); // If you want to do something with the result
    //                 })
    //                 .catch(error => console.error('Error:', error));