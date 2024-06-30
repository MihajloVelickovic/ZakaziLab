import React, { useEffect, useState } from "react";
import axiosInstance from '../utils/axiosInstance';
import * as XLSX from 'xlsx';
import "../styles/IzvestajOPoenima.css";

const fetchData = async () => {
    try {
        let response = await axiosInstance.get('/studentEntry/findAll');
        if (!response.ok) {
            console.log('Failed to fetch data', response);
        }
        const data = response.data;
        console.log("fetched: ", data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const IzvestajOPoenima = () => {
    const [entries, setEntries] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);

    useEffect(() => {
        fetchData()
        .then(json => {
            let data = json.map((item) => ({
                labName: item.labName,
                student: item.student,
                points: item.points.reduce((acc, point) => acc + point, 0)
            }));
            setEntries(data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const labs = [...new Set(entries.map(entry => entry.labName))];

    const toggleLab = (labName) => {
        setSelectedLab(selectedLab === labName ? null : labName);
    };

    const filteredEntries = entries.filter(entry => entry.labName === selectedLab)
        .map(entry => ({
            studentIndex: entry.student.index,
            ime: entry.student.name,
            prezime: entry.student.lastName,
            "ukupan broj poena": entry.points
        }))
        .sort((a, b) => a.studentIndex - b.studentIndex); 

    const csvData = filteredEntries.map(user => ({
        "Indeks": user.studentIndex.toString().padStart(6, ' '), 
        "Ime": user.ime.padEnd(10, ' '), 
        "Prezime": user.prezime.padEnd(10, ' '), 
        "Poeni": user["ukupan broj poena"].toString().padEnd(6, ' ') 
    }));

    const sheet = XLSX.utils.json_to_sheet(csvData);
    sheet["!cols"] = [{ width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }]; 

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Izvestaj"); 

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);

    return (
        <div className="wrapper">
            <div className="buttons">
                {labs.map((lab, index) => (
                    <button className={`izvestaj-button ${lab === selectedLab ? 'active' : ''}`} key={index} onClick={() => toggleLab(lab)}>
                        {lab}
                    </button>
                ))}
            </div>
            {selectedLab && (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Indeks</th>
                                <th scope="col">Ime</th>
                                <th scope="col">Prezime</th>
                                <th scope="col">Ukupan broj poena</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.studentIndex}</td>
                                    <td>{user.ime}</td>
                                    <td>{user.prezime}</td>
                                    <td>{user["ukupan broj poena"]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="csv-button">
                        <a href={url} download={`${selectedLab} izvestaj.xlsx`}>Preuzmi podatke</a>
                    </div>
                </>
            )}
        </div>
    );
}

export default IzvestajOPoenima;
