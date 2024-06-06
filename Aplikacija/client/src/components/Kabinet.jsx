import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import '../styles/Kabinet.css';

const Kabinet = () => {
    const [cabinets, setCabinets] = useState([]);
    const [showCabinets, setShowCabinets] = useState(false);
    const [selectedCabinet, setSelectedCabinet] = useState(null);
    const [addCabinet, setAddCabinet] = useState(false);
    const [cabinetForm, setCabinetForm] = useState({ name: '', rows: '', cols: '' });

    useEffect(() => {
        if (showCabinets) {
            fetchCabinets();
        }
    }, [showCabinets]);

    const fetchCabinets = async () => {
        try {
            var response = await axiosInstance.get('/classroom/findAll');
            console.log("response za findAll je: ", response);
            setCabinets(response.data);
        } catch (error) {
            console.error('Error fetching cabinets:', error.response ? error.response.data : error.message);
        }
    };

    const handleShowHideCabinets = () => {
        setShowCabinets(!showCabinets);
    };

    const handleCabinetClick = (cabinet) => {
        setSelectedCabinet(cabinet);
    };

    const handleAddCabinetClick = () => {
        setAddCabinet(true);
    };

    const handleCancelAdd = () => {
        setAddCabinet(false);
        setCabinetForm({ name: '', rows: '', cols: '' });
    };

    const handleSubmitAdd = async () => {
        try {
            const response = await axiosInstance.post('/classroom/add', cabinetForm);
            fetchCabinets();
            handleCancelAdd();
        } catch (error) {
            console.error('Error adding cabinet:', error);
        }
    };

    const handleDeleteCabinet = async (id) => {
        try {
            await axiosInstance.delete(`/classroom/delete/${id}`);
            fetchCabinets();
        } catch (error) {
            console.error('Error deleting cabinet:', error);
        }
    };

    return (
        <div className="kabinet-container">
            <button onClick={handleShowHideCabinets}>
                {showCabinets ? 'Hide cabinets' : 'Show cabinets'}
            </button>
            <button onClick={handleAddCabinetClick}>Add a cabinet</button>
            <button onClick={() => setShowCabinets(true)}>Delete cabinet</button>

            {showCabinets && (
                <div className="cabinet-list">
                    {cabinets.map((cabinet) => (
                        <div key={cabinet._id} onClick={() => handleCabinetClick(cabinet)}>
                            {cabinet.name}
                        </div>
                    ))}
                </div>
            )}

            {selectedCabinet && (
                <div className="cabinet-detail">
                    <h3>{selectedCabinet.name}</h3>
                    <div className="computer-matrix">
                        {selectedCabinet.computers.map((row, rowIndex) => (
                            <div key={rowIndex} className="row">
                                {row.map((computer, colIndex) => (
                                    <div key={colIndex} className="computer">
                                        {computer.name}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {addCabinet && (
                <div className="add-cabinet-form">
                    <input
                        type="text"
                        placeholder="Cabinet Name"
                        value={cabinetForm.name}
                        onChange={(e) => setCabinetForm({ ...cabinetForm, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Rows"
                        value={cabinetForm.rows}
                        onChange={(e) => setCabinetForm({ ...cabinetForm, rows: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Columns"
                        value={cabinetForm.cols}
                        onChange={(e) => setCabinetForm({ ...cabinetForm, cols: e.target.value })}
                    />
                    <button onClick={handleCancelAdd}>Cancel</button>
                    <button onClick={handleSubmitAdd}>Submit</button>
                </div>
            )}

            {showCabinets && (
                <div className="delete-cabinet-list">
                    {cabinets.map((cabinet) => (
                        <div key={cabinet._id}>
                            {cabinet.name}
                            <button onClick={() => handleDeleteCabinet(cabinet._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Kabinet;
