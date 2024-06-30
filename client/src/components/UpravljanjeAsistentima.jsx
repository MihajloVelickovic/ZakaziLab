import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../styles/UpravljanjeStudentima.css";

const fetchData = async () => {
  try {
    const response = await axiosInstance.get("/assistant/findAll");
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
      gradDate: "Datum diplomiranja",
      privileges: "Privilegije",
      password: "Šifra",
      gradFaculty: "Fakultet diplomiranja",
      module: "Modul",
    };
  
    for (let key in formData) {
      if (!formData[key] && (isAdding || key !== "password")) {
        errors[key] = `${placeholders[key]} is required!`;
      }
    }
    return errors;
  };
  

const UpravljanjeAsistentima = () => {
  const [assistants, setAssistants] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    gradDate: "",
    privileges: "",
    password: "",
    gradFaculty: "",
    module: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentAssistantId, setCurrentAssistantId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [existingPassword, setExistingPassword] = useState("");

  useEffect(() => {
    fetchData()
      .then((json) => {
        setAssistants(json);
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
        gradDate: "",
        privileges: "",
        password: "",
        gradFaculty: "",
        module: "",
    });
    setIsEditing(false);
    setCurrentAssistantId(null);
  };

  const addAssistant = async () => {
    try {
      formData.privileges = "assistant";

      const errorList = validateForm(formData,true);
      if (Object.keys(errorList).length !== 0) {
        const errorMessage = Object.values(errorList).join("\n");
        alert(errorMessage);
        return;
      }

      const response = await axiosInstance.post("/assistant/add", formData);
      const newAssistant = response.data;
      setAssistants([...assistants, newAssistant]);
      setSuccessMessage("Asistent dodat uspešno.");
      clearForm();
    } catch (error) {
      setSuccessMessage("Asistent nije dodat u bazu");
      console.error("Error adding asistent:", error);
    }
  };

  const updateAssistant = async () => {
    try {
      if (!currentAssistantId) {
        console.error("No asistent ID found for updating.");
        return;
      }

      const errorList = validateForm(formData,false);
      if (Object.keys(errorList).length !== 0) {
        const errorMessage = Object.values(errorList).join("\n");
        alert(errorMessage);
        return;
      }

      const passwordToUpdate = existingPassword;
      const updateData = { ...formData, password: passwordToUpdate };

      const response = await axiosInstance.patch(`/assistant/update/${currentAssistantId}`,
        updateData
      );
      const updatedAssistant= response.data;

      setAssistants(assistants.map((Assistant) =>
          Assistant._id === currentAssistantId ? updatedAssistant : Assistant
        )
      );
      setSuccessMessage("Asistent promenjen uspešno.");
      clearForm();
    } catch (error) {
      console.error("Error updating asistent:", error);
      setSuccessMessage("Asistent nije promenjen");
    }
  };

  const editAssistant = (Assistant) => {
    const formattedGradDate = Assistant.gradDate
      ? new Date(Assistant.birthDate).toISOString().split("T")[0]: "";
    setFormData({
        name: Assistant.name,
        lastName: Assistant.lastName,
        email: Assistant.email || "",
        privileges: Assistant.privileges,
        password: "", 
        gradDate: formattedGradDate,
        gradFaculty: Assistant.gradFaculty,
        module: Assistant.module || "",
    });

    setExistingPassword(Assistant.password);
    setIsEditing(true);
    setCurrentAssistantId(Assistant._id);
  };

  const deleteAssistant = async (AssistantId) => {
    try {
      const response = await axiosInstance.delete(`/asisstant/delete/${AssistantId}`
      );
      console.log(response.data.message);
      setAssistants(assistants.filter((Assistant) => Assistant._id !== AssistantId));
      setSuccessMessage("Asistent obrisan uspešno.");
      clearForm();
    } catch (error) {
      console.error("Error deleting asistent:", error);
      setSuccessMessage("Asistent nije obrisan");
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
          name="gradDate"
          value={formData.gradDate}
          onChange={handleChange}
          placeholder="Datum diplomiranja"
        />
        {renderPasswordInput()}
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
        <button
          className="btn-submit"
          onClick={isEditing ? updateAssistant
     : addAssistant
    
          }
        >
          {isEditing ? "Izmeni asistenta" : "Dodaj asistenta"}
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
          {assistants.map((Assistant, email) => (
            <tr key={email}>
              <td>{Assistant.name}</td>
              <td>{Assistant.lastName}</td>
              <td>{Assistant.email}</td>
              <td className="action-column">
                <button
                  className="btn-submit small"
                  onClick={() => editAssistant(Assistant)}
                >
                  Izmeni
                </button>
              </td>
              <td className="action-column">
                <button
                  className="btn-submit small"
                  onClick={() => deleteAssistant(Assistant._id)}
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

export default UpravljanjeAsistentima;
