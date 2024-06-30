import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginSignup.css";
import "bootstrap/dist/css/bootstrap.min.css";

import userImg from "../images/person.png";
import emailImg from "../images/email.png";
import passwordImg from "../images/password.png";

import DropdownButton from "react-bootstrap/DropdownButton";
import { Dropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import AuthContext from "../context/AuthContext";

const LoginSignup = () => {
  let { loginUser, registerUser } = useContext(AuthContext);

  const initialValues = {
    name: "",
    lastName: "",
    email: "",
    password: "",
    privileges: "",
    module: "",
    gradDate: "",
    gradFaculty: "",
    birthDate: "",
    index: "",
    phdGradDate: "",
    phdGradFaculty: ""
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [action, setAction] = useState("Login");
  const [typeOfUser, setTypeOfUser] = useState("student");
  const [typeOfDropdown, setTypeOfDropdown] = useState("Student");
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordClicked(!forgotPasswordClicked);

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    var errorList = validate(formValues);

    if (Object.keys(errorList).length === 0) {
      console.log("success! pressed submit and input fields are adequate");
      if (action == "Login") {
        if (forgotPasswordClicked) {
          
          let responseServer = await fetch('http://127.0.0.1:1738/user/resetPasswordEmail', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email: formValues.email})      //you can add {}
          })
          let data = await responseServer.json();
          console.log("response: ", data);
          errorList["serverResponse"] = `${data.message}`;
        }
        else {
          let sendData = {};
        sendData.email = formValues.email;
        sendData.password = formValues.password;
        var response = await loginUser(e, sendData);
        errorList["serverResponse"] = `${response}`;
        }
      } else if (action == "Sign Up") {
        var privilegije = typeOfUser;
        console.log("tip usera je:", privilegije);
        formValues.privileges = privilegije;
        var response = await registerUser(e, formValues);
        errorList["serverResponse"] = `${response}`;
      }
    } else {
      console.log("submit failed, input fields");
      console.log(errorList);

      setFormErrors(errorList);
    }

    if (Object.keys(errorList).length === 0) {
      console.log("success! pressed submit and input fields are adequate");
      if (action === "Login") {
        let sendData = {
          email: formValues.email,
          password: formValues.password,
        };
        var response = await loginUser(e, sendData);
        errorList["serverResponse"] = `${response}`;
      } else if (action === "Sign Up") {
        formValues.privileges = typeOfUser;
        var response = await registerUser(e, formValues);
        errorList["serverResponse"] = `${response}`;
      }
    } else {
      console.log("submit failed, input fields");
      console.log(errorList);
    }
    setFormErrors(errorList);
  };

  useEffect(() => {
    console.log("Form errors:", formErrors);
  }, [formErrors]);

  const validate = (values) => {
            const errors = {};
            const regex = /^(?!\s)[A-Z0-9\s]+$/i;
            values.privileges = "placeholder za privilegije";

            if (action=="Login" && forgotPasswordClicked){
              if (!values['email']) {
                errors['email'] = `email is required!`;                
              }
              return errors;
            }
    
            for (let key in values) {
    
                if (action=="Login"){
                    if (key == "email" || key == "password")
                        if (!values[key]) {
                            errors[key] = `${key} is required!`;
                        }
                }
                else if (typeOfUser=="student"){
                    if (key != "gradDate" && key != "gradFaculty" && key != "phdGradDate" && key != "phdGradFaculty")
                        if (!values[key]) {
                            errors[key] = `${key} is required!`;
                        }
                }
                else if (typeOfUser=="assistant"){
                    if (key != "birthDate" && key != "index" && key!="phdGradDate" && key!="phdGradFaculty")
                        if (!values[key]) {
                            errors[key] = `${key} is required!`;
                        }
                }
                else if (typeOfUser=="professor"){
                    if (key != "birthDate" && key != "index") {
                        if (!values[key]) {
                            errors[key] = `${key} is required!`;
                        }
                    }
                }else if (typeOfUser=="admin"){
                    if (key == "email" || key == "password" || key=="name" || key=="lastName")
                        if (!values[key]) {
                            errors[key] = `${key} is required!`;
                        }
                }
            }
    
            return errors;
        }

  const showInputFields = () => {
    return (
      <div className="inputs">
        <div
          className="input"
          style={{ marginBottom: formErrors.email ? "0px" : "10px" }}
        >
          <img src={emailImg} alt=""></img>
          <input
            type="email"
            name="email"
            placeholder={!forgotPasswordClicked?"Email":"Email"}
            value={formValues.email}
            onChange={handleChange}
            onKeyDown={handleKeypress}
          ></input>
        </div>
        <p className="p-error">{formErrors.email}</p>
        {!forgotPasswordClicked? <><div
          className="input"
          style={{ marginBottom: formErrors.password ? "0px" : "10px" }}
        >
          <img src={passwordImg} alt=""></img>
          <input
            type="password"
            name="password"
            placeholder="Šifra"
            value={formValues.password}
            onChange={handleChange}
            onKeyDown={handleKeypress}
          ></input>
        </div> 
        <p className="p-error">{formErrors.password}</p>
        </>
        : <></>}
        {action==="Sign Up"? <></> : <p onClick={handleForgotPasswordClick} style={{cursor: 'pointer', color: '#03A9F4'}} > {forgotPasswordClicked ? "Nazad" : "Zaboravljena šifra"}</p>}
        

        {action !== "Sign Up" ? (
          <></>
        ) : (
          <>
            <div
              className="input"
              style={{ marginBottom: formErrors.name ? "0px" : "10px" }}
            >
              <img src={userImg} alt=""></img>
              <input
                type="text"
                name="name"
                placeholder="Ime"
                value={formValues.name}
                onChange={handleChange}
                onKeyDown={handleKeypress}
              ></input>
            </div>
            <p className="p-error">{formErrors.name}</p>

            <div
              className="input"
              style={{ marginBottom: formErrors.lastName ? "0px" : "10px" }}
            >
              <img src={userImg} alt=""></img>
              <input
                type="text"
                name="lastName"
                placeholder="Prezime"
                value={formValues.lastName}
                onChange={handleChange}
                onKeyDown={handleKeypress}
              ></input>
            </div>
            <p className="p-error">{formErrors.lastName}</p>

            {typeOfUser === "admin" ? (
              <></>
            ) : (
              <>
                <div
                  className="input"
                  style={{ marginBottom: formErrors.module ? "0px" : "10px" }}
                >
                  <img src={userImg} alt=""></img>
                  <input
                    type="text"
                    name="module"
                    placeholder="Modul"
                    value={formValues.module}
                    onChange={handleChange}
                    onKeyDown={handleKeypress}
                  ></input>
                </div>
                <p className="p-error">{formErrors.module}</p>

                {typeOfUser === "student" ? (
                  <>
                    <div
                      className="input"
                      style={{
                        marginBottom: formErrors.index ? "0px" : "10px",
                      }}
                    >
                      <img src={userImg} alt=""></img>
                      <input
                        type="number"
                        name="index"
                        placeholder="Broj indeksa"
                        value={formValues.index}
                        onChange={handleChange}
                        onKeyDown={handleKeypress}
                      ></input>
                    </div>
                    <p className="p-error">{formErrors.index}</p>

                    <div
                      className="input"
                      style={{
                        marginBottom: formErrors.birthDate ? "0px" : "10px",
                      }}
                    >
                      <img src={userImg} alt=""></img>
                      <input
                        className="textbox-n"
                        type="text"
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        name="birthDate"
                        placeholder="Datum rođenja"
                        value={formValues.birthDate}
                        onChange={handleChange}
                        onKeyDown={handleKeypress}
                      ></input>
                    </div>
                    <p className="p-error">{formErrors.birthDate}</p>
                  </>
                ) : (
                  <>
                    <div
                      className="input"
                      style={{
                        marginBottom: formErrors.gradDate ? "0px" : "10px",
                      }}
                    >
                      <img src={userImg} alt=""></img>
                      <input
                        className="textbox-n"
                        type="text"
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => (e.target.type = "text")}
                        name="gradDate"
                        placeholder="Datum diplomiranja"
                        value={formValues.gradDate}
                        onChange={handleChange}
                        onKeyDown={handleKeypress}
                      ></input>
                    </div>
                    <p className="p-error">{formErrors.gradDate}</p>

                    <div
                      className="input"
                      style={{
                        marginBottom: formErrors.gradFaculty ? "0px" : "10px",
                      }}
                    >
                      <img src={userImg} alt=""></img>
                      <input
                        type="text"
                        name="gradFaculty"
                        placeholder="Fakultet diplomiranja"
                        value={formValues.gradFaculty}
                        onChange={handleChange}
                        onKeyDown={handleKeypress}
                      ></input>
                    </div>
                    <p className="p-error">{formErrors.gradFaculty}</p>

                    {typeOfUser !== "professor" ? (
                      <></>
                    ) : (
                      <>
                        <div
                          className="input"
                          style={{
                            marginBottom: formErrors.phdGradDate
                              ? "0px"
                              : "10px",
                          }}
                        >
                          <img src={userImg} alt=""></img>
                          <input
                            className="textbox-n"
                            type="text"
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                            placeholder="Datum doktoriranja"
                            name="phdGradDate"
                            value={formValues.phdGradDate}
                            onChange={handleChange}
                            onKeyDown={handleKeypress}
                          ></input>
                        </div>
                        <p className="p-error">{formErrors.phdGradDate}</p>
                        <div
                          className="input"
                          style={{
                            marginBottom: formErrors.phdGradFaculty
                              ? "0px"
                              : "10px",
                          }}
                        >
                          <img src={userImg} alt=""></img>
                          <input
                            type="text"
                            name="phdGradFaculty"
                            placeholder="Fakultet doktoriranja"
                            value={formValues.phdGradFaculty}
                            onChange={handleChange}
                            onKeyDown={handleKeypress}
                          ></input>
                        </div>
                        <p className="p-error">{formErrors.phdGradFaculty}</p>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="login-signup-form">
      <div className="container p-3 p-lg-5 mt-5 mb-5 col-md-8 col-lg-5 col-sm-8 col-10">
        <div className="col-lg-10 offset-lg-1">
          <div className="row">
            <div className="col-sm-6">
              <h2
                className={`text-center mb-3 ${
                  action === "Login"
                    ? "highlighted login-signup-title"
                    : "not-highlighted login-signup-title"
                }`}
                onClick={() => setAction("Login")}
              >
                Login
              </h2>
            </div>

            <div className="col-sm-6">
              <h2
                className={`text-center mb-3 ${
                  action === "Sign Up"
                    ? "highlighted login-signup-title"
                    : "not-highlighted login-signup-title"
                }`}
                onClick={() => setAction("Sign Up")}
              >
                Signup
              </h2>
            </div>
          </div>

          <form className="login-fields" onSubmit={handleSubmit}>
            {showInputFields()}
            <div className="d-flex justify-content-between mt-3">
              <Button
                type="submit"
                className="login-signup-btn btn btn-primary  w-100"
              >
                {action==="Login" && forgotPasswordClicked? 'Pošalji mejl za resetovanje šifre' : action }
                
              </Button>
            </div>
            {action === "Sign Up" && (
              <div className="mt-3">
                <DropdownButton id="dropdown-basic-button" title={typeOfDropdown}>
                  <Dropdown.Item
                    onClick={() => {
                      setAction("Sign Up");
                      setTypeOfUser("student");
                      setTypeOfDropdown("Student");
                    }}
                  >
                    Student
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setAction("Sign Up");
                      setTypeOfUser("assistant");
                      setTypeOfDropdown("Asistent");

                    }}
                  >
                    Asistent
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setAction("Sign Up");
                      setTypeOfUser("professor");
                      setTypeOfDropdown("Profesor");

                    }}
                  >
                    Profesor
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setAction("Sign Up");
                      setTypeOfUser("admin");
                      setTypeOfDropdown("Administartor");
                    }}
                  >
                    Administrator
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            )}
          </form>
          {formErrors.serverResponse && (
            <div style={{ marginTop: "30px" }}>{formErrors.serverResponse}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
