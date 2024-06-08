import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../styles/UpravljanjeStudentima.css";

const fetchData = async () => {
  try {
    const response = await axiosInstance.get("/student/findAll");
    const data = response.data;
    console.log("fetched: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const validateForm = (formData, isAdding) => {
    const errors = {};
    const placeholders = {
      name: "Ime",
      lastName: "Prezime",
      email: "Email",
      birthDate: "Datum rođenja",
      privileges: "Privilegije",
      password: "Šifra",
      index: "Indeks",
      module: "Modul",
    };
  
    for (let key in formData) {
      if (!formData[key] && (isAdding || key !== "password")) {
        errors[key] = `${placeholders[key]} is required!`;
      }
    }
    return errors;
  };
  

const UpravljanjeStudentima = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    birthDate: "",
    privileges: "",
    password: "",
    index: "",
    module: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [existingPassword, setExistingPassword] = useState("");

  useEffect(() => {
    fetchData()
      .then((json) => {
        setStudents(json);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData({
      name: "",
      lastName: "",
      email: "",
      birthDate: "",
      privileges: "",
      password: "",
      index: "",
      module: "",
    });
    setIsEditing(false);
    setCurrentStudentId(null);
  };

  const addStudent = async () => {
    try {
      formData.privileges = "student";

      const errorList = validateForm(formData,true);
      if (Object.keys(errorList).length !== 0) {
        const errorMessage = Object.values(errorList).join("\n");
        alert(errorMessage);
        return;
      }

      const response = await axiosInstance.post("/student/add", formData);
      const newStudent = response.data;
      setStudents([...students, newStudent]);
      setSuccessMessage("Student dodat uspešno.");
      clearForm();
    } catch (error) {
      setSuccessMessage("Student nije dodat u bazu");
      console.error("Error adding student:", error);
    }
  };

  const updateStudent = async () => {
    try {
      if (!currentStudentId) {
        console.error("No student ID found for updating.");
        return;
      }

      const errorList = validateForm(formData,false);
      if (Object.keys(errorList).length !== 0) {
        const errorMessage = Object.values(errorList).join("\n");
        alert(errorMessage);
        return;
      }

      const passwordToUpdate = existingPassword;
      console.log("Sifrica je" + passwordToUpdate)
      const updateData = { ...formData, password: passwordToUpdate };

      const response = await axiosInstance.patch(
        `/student/update/${currentStudentId}`,
        updateData
      );
      const updatedStudent = response.data;

      setStudents(
        students.map((student) =>
          student._id === currentStudentId ? updatedStudent : student
        )
      );
      setSuccessMessage("Student promenjen uspešno.");
      clearForm();
    } catch (error) {
      console.error("Error updating student:", error);
      setSuccessMessage("Student nije promenjen");
    }
  };

  const editStudent = (student) => {
    const formattedBirthDate = student.birthDate
      ? new Date(student.birthDate).toISOString().split("T")[0]
      : "";
    setFormData({
      name: student.name,
      lastName: student.lastName,
      email: student.email || "",
      privileges: student.privileges,
      password: "", 
      birthDate: formattedBirthDate,
      index: student.index,
      module: student.module || "",
    });

    setExistingPassword(student.password);
    setIsEditing(true);
    setCurrentStudentId(student._id);
  };

  const deleteStudent = async (studentId) => {
    try {
      const response = await axiosInstance.delete(
        `/student/delete/${studentId}`
      );
      console.log(response.data.message);
      setStudents(students.filter((student) => student._id !== studentId));
      setSuccessMessage("Student obrisan uspešno.");
      clearForm();
    } catch (error) {
      console.error("Error deleting student:", error);
      setSuccessMessage("Student nije obrisan");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const renderPasswordInput = () => {
    if (isEditing) {
      return (
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Šifra"
          disabled
        />
      );
    } else {
      return (
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Šifra"
        />
      );
    }
  };

  return (
    <div className="wrapper">
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="input-group">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ime"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Prezime"
        />
      </div>
      <div className="input-group">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="privileges"
          name="privileges"
          value={formData.privileges}
          onChange={handleChange}
          placeholder="Privilegije"
        />
      </div>
      <div className="input-group big">
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          placeholder="Datum rođenja"
        />
        {renderPasswordInput()}
      </div>
      <div className="input-group">
        <input
          type="number"
          name="index"
          value={formData.index}
          onChange={handleChange}
          placeholder="Indeks"
        />
        <input
          type="text"
          name="module"
          value={formData.module}
          onChange={handleChange}
          placeholder="Modul"
        />
      </div>
      <div className="input-group">
        <button
          className="btn-submit"
          onClick={isEditing ? updateStudent : addStudent}
        >
          {isEditing ? "Izmeni studenta" : "Dodaj studenta"}
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
                <button
                  className="btn-submit small"
                  onClick={() => editStudent(student)}
                >
                  Izmeni
                </button>
              </td>
              <td className="action-column">
                <button
                  className="btn-submit small"
                  onClick={() => deleteStudent(student._id)}
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpravljanjeStudentima;
