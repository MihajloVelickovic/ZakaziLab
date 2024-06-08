import React, { useEffect, useState } from "react";
import axiosInstance from '../utils/axiosInstance';
import "../styles/UpravljanjeStudentima.css"; 

const fetchData = async () => {
    try {
        const response = await axiosInstance.get('/student/findAll');
        const data = response.data;
        console.log("fetched: ", data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const validateForm = (formData) => {
    const errors = {};
    const placeholders = {
        name: 'Name',
        lastName: 'Last Name',
        email: 'Email',
        password: 'Password',
        birthDate: 'Birth Date',
        index: 'Index',
        module: 'Module'
    };
    for (let key in formData) {
        if (!formData[key]) {
            errors[key] = `${placeholders[key]} is required!`;
        }
    }
    return errors;
};

const UpravljanjeStudentima = () => {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: '',
        index: '',
        module: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchData()
        .then(json => {
            setStudents(json);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const clearForm = () => {
        setFormData({
            name: '',
            lastName: '',
            email: '',
            password: '',
            birthDate: '',
            index: '',
            module: ''
        });
        setIsEditing(false);
        setCurrentStudentId(null);
    };

    const addStudent = async () => {
        try {
            formData.privileges = 'student';
            
            const errorList = validateForm(formData);
            if (Object.keys(errorList).length !== 0) {
                const errorMessage = Object.values(errorList).join('\n');
                alert(errorMessage);
                return;
            }

            const response = await axiosInstance.post('/student/add', formData);
            const newStudent = response.data;
            setStudents([...students, newStudent]);
            setSuccessMessage('Student dodat uspešno.');
            clearForm();
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const updateStudent = async () => {
        try {
            if (!currentStudentId) {
                console.error('No student ID found for updating.');
                return;
            }

            const errorList = validateForm(formData);
            if (Object.keys(errorList).length !== 0) {
                const errorMessage = Object.values(errorList).join('\n');
                alert(errorMessage);
                return;
            }
            
            const response = await axiosInstance.patch(`/student/update/${currentStudentId}`, formData);
            const updatedStudent = response.data;

            setStudents(students.map(student => (student._id === currentStudentId ? updatedStudent : student)));
            setSuccessMessage('Student promenjen uspešno.');
            clearForm();
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const editStudent = (student) => {
        const formattedBirthDate = student.birthDate ? new Date(student.birthDate).toISOString().split('T')[0] : '';
        setFormData({
            name: student.name,
            lastName: student.lastName,
            email: student.email || '',
            password: student.password || '', 
            birthDate: formattedBirthDate,
            index: student.index,
            module: student.module || ''
        });
        setIsEditing(true);
        setCurrentStudentId(student._id);
    };

    const deleteStudent = async (studentId) => {
        try {
            const response = await axiosInstance.delete(`/student/delete/${studentId}`);
            console.log(response.data.message);
            setStudents(students.filter(student => student._id !== studentId));
            setSuccessMessage('Student obrisan uspešno.');
            clearForm();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessMessage('');
        }, 3000); // Adjust the timeout duration as needed
        return () => clearTimeout(timer);
    }, [successMessage]);

    return (
        <div className="wrapper">
            {successMessage && <div className="success-message">{successMessage}</div>}
            <div className="input-group">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
            </div>
            <div className="input-group">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            </div>
            <div className="input-group big">
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="Birth Date" />
            </div>
            <div className="input-group">
                <input type="number" name="index" value={formData.index} onChange={handleChange} placeholder="Index" />
                <input type="text" name="module" value={formData.module} onChange={handleChange} placeholder="Module" />
            </div>
            <div className="input-group">
                <button className="btn-submit" onClick={isEditing ? updateStudent : addStudent}>
                    {isEditing ? 'Izmeni studenta' : 'Dodaj studenta'}
                </button>
                <button className="btn-clear" onClick={clearForm}>
                    Poništi
                </button>
            </div>
            <table className="table-students">
                <thead>
                    <tr>
                        <th scope="col">Indeks</th>
                        <th scope="col">Ime</th>
                        <th scope="col">Prezime</th>
                        <th scope="col">Izmeni</th> 
                        <th scope="col">Obriši</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td>{student.index}</td>
                            <td>{student.name}</td>
                            <td>{student.lastName}</td>
                            <td className="action-column">
                                <button className="btn-submit small" onClick={() => editStudent(student)}>Izmeni</button>
                            </td>
                            <td className="action-column">
                                <button className="btn-submit small" onClick={() => deleteStudent(student._id)}>Obriši</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UpravljanjeStudentima;

