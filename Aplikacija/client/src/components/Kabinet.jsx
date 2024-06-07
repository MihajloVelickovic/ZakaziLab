import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import '../styles/Kabinet.css';

const Kabinet = () => {
    const [cabinets, setCabinets] = useState([]);
    const [showCabinets, setShowCabinets] = useState(false);
    const [showDeleteCabinets, setShowDeleteCabinets] = useState(false);
    const [selectedCabinet, setSelectedCabinet] = useState(null);
    const [addCabinet, setAddCabinet] = useState(false);
    const [cabinetForm, setCabinetForm] = useState({ name: '', rows: '', cols: '' });
    const [selectedComputer, setSelectedComputer] = useState(null);
    const [showManageForm, setShowManageForm] = useState(false);
    const [malfunctionStatus, setMalfunctionStatus] = useState(false);
    const [malfunctionDesc, setMalfunctionDesc] = useState('');

    const [isHovered, setIsHovered] = useState(null);

    useEffect(() => {
        if (showCabinets) {
            fetchCabinets();
        }
        else if (showDeleteCabinets){
            fetchCabinets();
        }
    }, [showCabinets, showDeleteCabinets]);

    const fetchCabinets = async () => {
        try {
            var response = await axiosInstance.get('/classroom/findAll');
            console.log("response za findAll je: ", response);
            setCabinets(response.data);
        } catch (error) {
            console.error('Error fetching cabinets:', error.response ? error.response.data : error.message);
        }
    };

    const handleMouseOver = (computer) => {
        // Set isHovered to true when mouse is over the computer
        setIsHovered(computer);
    };
    
    const handleMouseOut = () => {
        // Set isHovered to false when mouse moves out of the computer's area
        setIsHovered(null);
    };

    const handleShowHideCabinets = () => {
        setShowCabinets(!showCabinets);
    };

    const handleCabinetClick = (cabinet) => {
        if (selectedCabinet != cabinet)
            setSelectedCabinet(cabinet);
        else 
            setSelectedCabinet(null);
    };

    const handleAddCabinetClick = () => {       //if it's already selected deselect it here
        setAddCabinet(true);
    };

    const handleCancelAdd = () => {
        setAddCabinet(false);
        setCabinetForm({ name: '', rows: '', cols: '' });
    };

    const handleComputerClick = (computer) => {
        if (selectedComputer==computer)
            setSelectedComputer(null);    
        else
            setSelectedComputer(computer);
    };

    const handleManageButtonClick = () => {
        if (selectedComputer) {
            setMalfunctionStatus(selectedComputer.malfunctioned);
            setMalfunctionDesc(selectedComputer.malfunctionDesc);
            setShowManageForm(true);
        } else {
            alert("Please select a computer first.");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            //modifying computer and sending it
            var modifiedComputer = selectedComputer;
            console.log("selected computer is: ", modifiedComputer);
            modifiedComputer.malfunctioned = malfunctionStatus;
            modifiedComputer.malfunctionDesc = malfunctionDesc;
            const response = await axiosInstance.patch(`/classroom/updateComputer/${selectedCabinet._id}`, modifiedComputer);
            console.log("izgleda da je uspesno. Response: ", response);
            console.log("modifikovan kompjuter", modifiedComputer);

            setSelectedComputer(null);
            setShowManageForm(false);
            fetchCabinets();
        } catch (error) {
            console.error('Error updating computer:', error.response ? error.response.data : error.message);
        }
    };

    const handleSubmitAdd = async () => {
        try {
            console.log("cabinet form is: ", cabinetForm);
            const response = await axiosInstance.post('/classroom/add', cabinetForm);
            fetchCabinets();
            handleCancelAdd();
        } catch (error) {
            console.error('Error adding cabinet:', error.response ? error.response.data : error.message);
        }
    };

    const handleDeleteCabinet = async (cabinet) => {
        var id = cabinet._id;   
        var name = cabinet.name;
        if (window.confirm(`Da li ste sigurni da zelite da obrisete kabinet ${name}?`)) {
            console.log('picked to delete cabinet');
            try {
                await axiosInstance.delete(`/classroom/delete/${id}`);
                fetchCabinets();
            } catch (error) {
                console.error('Error deleting cabinet:', error);
            }
          } else {
            console.log('picked to cancel cabinet deletion');
          }
        
    };

    const handleShowDeleteCabinets = () => {
        setShowDeleteCabinets(!showDeleteCabinets);
    }
    

    return (
        <div className="kabinet-container">
            <button onClick={handleShowHideCabinets}>
                {showCabinets ? 'Hide cabinets' : 'Show cabinets'}
            </button>
            <button onClick={handleAddCabinetClick}>Add a cabinet</button>
            <button onClick={handleShowDeleteCabinets}>Delete cabinet</button>
            <button onClick={handleManageButtonClick} disabled={!selectedComputer}>      
                Manage computer
            </button>

            {showCabinets && (
                <div className="cabinet-list">
                    {cabinets.map((cabinet) => (
                        <div key={cabinet._id} onClick={() => handleCabinetClick(cabinet)}>
                            {cabinet.name}
                        </div>
                    ))}
                </div>
            )}

            {/* {selectedCabinet && (
                <div className="cabinet-detail">
                    <h3>{selectedCabinet.name}</h3>
                    <div className="computer-matrix">
                        {selectedCabinet.computers.map((row, rowIndex) => (
                            <div key={rowIndex} className="row">
                                {row.map((computer, colIndex) => (
                                    <div key={colIndex} className= {computer.malfunctioned? "computer malfunctionedComputer" : "computer workingComputer"}>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

            {selectedCabinet && (
                <div className='showingCabinetContainer'>
                    <h3>{selectedCabinet.name}</h3>
                    <div className="cabinetGridContainer" style={{  gridTemplateColumns: `repeat(${selectedCabinet.cols}, 1fr)` , paddingTop: '25px'}}>
                        {selectedCabinet.computers.flat().map((computer) => (
                            <div
                                key={computer._id}
                                className={`cabinetGridItem ${selectedComputer && selectedComputer._id === computer._id ? 'computer selected' :              //computer-box
                                        computer.malfunctioned? "computer malfunctionedComputer" : "computer workingComputer"}`}
                                onClick={() => handleComputerClick(computer)}
                                onMouseOver={() => handleMouseOver(computer)}
                                onMouseOut={() => handleMouseOut()}
                            >   
                            {isHovered==computer && computer.malfunctioned && (
                                    <div className="malfunctionDescription">
                                        {computer.malfunctionDesc}
                                    </div>
                                )}
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

            {showDeleteCabinets && (
                <div className="delete-cabinet-list">
                    {cabinets.map((cabinet) => (
                        <div key={cabinet._id}>
                            {cabinet.name}
                            <button onClick={() => handleDeleteCabinet(cabinet)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}

            {showManageForm && (
                <div className="manage-form">
                    <form onSubmit={handleFormSubmit}>
                        <label>
                            Malfunctioned:
                            <input
                                type="checkbox"
                                checked={malfunctionStatus}
                                onChange={(e) => setMalfunctionStatus(e.target.checked)}
                            />
                        </label>
                        <label>
                            Malfunction Description:
                            <textarea
                                value={malfunctionDesc}
                                onChange={(e) => setMalfunctionDesc(e.target.value)}
                            />
                        </label>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => setShowManageForm(false)}>Cancel</button>
                    </form>
                </div>
            )}

        </div>
    );
};

export default Kabinet;
