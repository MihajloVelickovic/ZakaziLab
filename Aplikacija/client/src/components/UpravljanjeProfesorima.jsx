import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../styles/UpravljanjeStudentima.css";

const fetchData = async () => {
  try {
    const response = await axiosInstance.get("/professor/findAll");
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
      privileges: "Privilegije",
      module: "Modul",
      gradDate: "Datum diplomiranja",
      gradFaculty: "Fakultet",
      phdGradDate: "PHD datum",
      phdGradFaculty: "PHD Fakultet",
    };
  
    for (let key in formData) {
      if (!formData[key] && (isAdding )) {
        errors[key] = `${placeholders[key]} is required!`;
      }
    }
    return errors;
  };
  

const UpravljanjeProfesorima = () => {
  const [professors, setProfessors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    privileges: "",
    module: "",
    gradDate: "",
    gradFaculty: "",
    phdGradDate: "",
    phdGradFaculty: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfessorId, setCurrentProfessorId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchData()
      .then((json) => {
        setProfessors(json);
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
        privileges: "",
        module: "",
        gradDate: "",
        gradFaculty: "",
        phdGradDate: "",
        phdGradFaculty: "",
    });
    setIsEditing(false);
    setCurrentProfessorId(null);
  };

  const addProfessor = async () => {
    try {
        formData.privileges = "professor";

        const errorList = validateForm(formData, true);
        if (Object.keys(errorList).length !== 0) {
            const errorMessage = Object.values(errorList).join("\n");
            alert(errorMessage);
            return;
        }

        const response = await axiosInstance.post("/professor/add", JSON.stringify(formData), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const newProfessor = response.data;
        setProfessors([...professors, newProfessor]);
        setSuccessMessage("Profesor dodat uspešno.");
        clearForm();
    } catch (error) {
        setSuccessMessage("Profesor nije dodat u bazu");
        console.error("Error adding professor:", error);
    }
};


  const updateProfessor = async () => {
    try {
      if (!currentProfessorId) {
        console.error("No professor ID found for updating.");
        return;
      }

      const errorList = validateForm(formData,false);
      if (Object.keys(errorList).length !== 0) {
        const errorMessage = Object.values(errorList).join("\n");
        alert(errorMessage);
        return;
      }

      const updateData = { ...formData};

      const response = await axiosInstance.patch(
        `/professor/update/${currentProfessorId}`,
        updateData
      );
      const updatedProfessor = response.data;

      setProfessors(
        professors.map((professor) =>
          professor._id === currentProfessorId ? updatedProfessor : professor
        )
      );
      setSuccessMessage("Profesor promenjen uspešno.");
      clearForm();
    } catch (error) {
      console.error("Error updating profesor:", error);
      setSuccessMessage("Profesor nije promenjen");
    }
  };

  const editProfessor = (profesor) => {
    const formattedGradDate = profesor.gradDate
      ? new Date(profesor.gradDate).toISOString().split("T")[0]
      : "";
      const formattedPHDGradDate = profesor.phdGradDate
      ? new Date(profesor.phdGradDate).toISOString().split("T")[0]
      : "";
    setFormData({
        name: profesor.name,
        lastName: profesor.lastName,
        email: profesor.email,
        privileges: profesor.privileges,
        module: profesor.module,
        gradDate: formattedGradDate,
        gradFaculty: profesor.gradFaculty,
        phdGradDate: formattedPHDGradDate,
        phdGradFaculty: profesor.phdGradFaculty
    });

    setIsEditing(true);
    setCurrentProfessorId(profesor._id);
  };

  const deleteProfessor = async (professorId) => {
    try {
      const response = await axiosInstance.delete(
        `/professor/delete/${professorId}`
      );
      console.log(response.data.message);
      setProfessors(professors.filter((professor) =>professor._id !== professorId));
      setSuccessMessage("Profesor obrisan uspešno.");
      clearForm();
    } catch (error) {
      console.error("Error deleting profesor:", error);
      setSuccessMessage("Profesor nije obrisan");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

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
          name="gradDate"
          value={formData.gradDate}
          onChange={handleChange}
          placeholder="Datum diplomiranja"
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          name="gradFaculty"
          value={formData.gradFaculty}
          onChange={handleChange}
          placeholder="Fakultet diplomiranja"
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
        <input
          type="date"
          name="phdGradDate"
          value={formData.phdGradDate}
          onChange={handleChange}
          placeholder="Datum doktoriranja"
        />
        <input
          type="text"
          name="phdGradFaculty"
          value={formData.phdGradFaculty}
          onChange={handleChange}
          placeholder="Fakultet doktoriranja"
        />
      </div>
      <div className="input-group">
        <button
          className="btn-submit"
          onClick={isEditing ? updateProfessor : addProfessor}
        >
          {isEditing ? "Izmeni profesora" : "Dodaj profesora"}
        </button>
        <button className="btn-clear" onClick={clearForm}>
          Poništi
        </button>
      </div>
      <table className="table-students">
        <thead>
          <tr>
            <th scope="col">Ime</th>
            <th scope="col">Prezime</th>
            <th scope="col">Email</th>
            <th scope="col">Izmeni</th>
            <th scope="col">Obriši</th>
          </tr>
        </thead>
        <tbody>
          {professors.map((professor, email) => (
            <tr key={email}>
              <td>{professor.name}</td>
              <td>{professor.lastName}</td>
              <td>{professor.email}</td>
              <td className="action-column">
                <button
                  className="btn-submit small"
                  onClick={() => editProfessor(professor)}
                >
                  Izmeni
                </button>
              </td>
              <td className="action-column">
                <button
                  className="btn-submit small"
                  onClick={() => deleteProfessor(professor._id)}
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

export default UpravljanjeProfesorima;
