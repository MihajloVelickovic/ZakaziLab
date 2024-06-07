// import React, {useState, useEffect, useContext} from "react";
// import { useNavigate } from 'react-router-dom';
// import { Navigate } from "react-router-dom";
// import '../styles/LoginSignup.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import userImg from '../images/person.png';
// import emailImg from '../images/email.png';
// import passwordImg from '../images/password.png';

// import DropdownButton from "react-bootstrap/DropdownButton";
// import { Dropdown } from "react-bootstrap";
// import Button from 'react-bootstrap/Button';
// import AuthContext from "../context/AuthContext";
// //import backgroundImg from '../images/loginBackground.jpg';

// const LoginSignup = () => {

//     let {loginUser, registerUser} = useContext(AuthContext);

//     //const [action, setAction] = useState("Sign Up");

//     const initialValues = {name:"",lastName:"", email: "", password: "",privileges: "", module:"", gradDate:"", gradFaculty:"",birthDate:"",index:"",   phdGradDate:"", phdGradFaculty:""};

//     const [formValues, setFormValues] = useState(initialValues);
//     const [formErrors, setFormErrors] = useState({});
//     const [action, setAction] = useState("Login");
//     const [typeOfUser, setTypeOfUser] = useState("student");
//     const navigate = useNavigate();

//     //msLogin (izbaci ga kad budes imao vremena)
//     const [isLoggedIn, setIsLoggedIn] = useState(false);

//     const handleLogin = () => {
//         console.log("pressed useless login button");
//     };

//     const getUserDetails = () => {
//         // if (accounts.length > 0) {
//         // const account = accounts[0];
//         // return (
//         //     <div>
//         //     <p style={{fontWeight: 'bold'}}>User Details</p>
//         //     <p>Username: {account.idTokenClaims.name}</p>
//         //     <p>Email: {account.username}</p>
//         //     </div>
//         // );
//         // }
//         //I'm not using msall anymore so you need to login differently
//         return null;
//     };
//     //end of msLogin

//     const postValues = async () => {
//         if (Object.keys(formErrors).length === 0) {
//             console.log(formValues);
//             console.log(JSON.stringify(formValues));
//             console.log("success!");
//             try {
//                 await fetch('http://127.0.0.1:1738/studentSignUp', {
//                     method: 'POST',
//                     headers: {
//                         'Accept': 'application/json',
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(
//                         formValues
//                     )
//                     })
//             } catch (err) {
//                 console.log("Error: ", err);
//             }
//         }
//     }

//     const handleChange = (e) => {

//         const {name, value} = e.target;
//         setFormValues({...formValues, [name]: value});
//     }

//     const fetchStudent = async (Email) => {
//         try {
//             console.log(Email);
//             const response = await fetch(`http://127.0.0.1:1738/user/filteredFind`, {
//                 method: "POST",
//                 body: JSON.stringify({email: Email}),
//                 headers: {"Content-Type": "application/json"}
//             });

//             if (response.status != 200 && response.status != 404) {
//                 throw new Error('Failed to fetch data jbg');
//             }
//             const data = await response.json();

//             if (response.status == 404) {
//                 console.log("nema ga taj lik");
//             }
//             if (response.status == 200){
//                 console.log("hoce vljd", data);
//                 localStorage.setItem('userData', JSON.stringify(data));
//                 navigate(`/${data.privileges}`);  // Redirect to the page named like data.privileges

//             }
//             return data;

//         } catch (error) {
//             console.error('Error fetching data:', error);
//             throw error;
//         }
//     };

//     const handleKeypress = e => {
//         //it triggers by pressing the enter key
//       if (e.keyCode === 13) {
//         handleSubmit(e);
//       }
//     };

//     const handleSubmit = async (e) => {

//         e.preventDefault();
//         var errorList = validate(formValues);

//         if (Object.keys(errorList).length === 0) {
//             //console.log(formValues);
//             // console.log(JSON.stringify(formValues));
//             console.log("success! pressed submit and input fields are adequate");
//             //ovde sada treba da se pozove fetch ka serveru
//             if (action=="Login"){
//                 let sendData = {}
//                 sendData.email = formValues.email;
//                 sendData.password = formValues.password;
//                 var response = await loginUser(e, sendData);
//                 //var message = response.json().message;
//                 errorList['serverResponse'] = `${response}`;

//             } else if (action == "Sign Up"){
//                 var privilegije = typeOfUser;
//                 console.log("tip usera je:", privilegije);
//                 formValues.privileges = privilegije;
//                 var response = await registerUser(e, formValues);
//                 errorList['serverResponse'] = `${response}`
//             }
//         }
//         else {
//             console.log("submit failed, input fields")
//             console.log(errorList);
//         };
//         setFormErrors(errorList);
//     }

//     useEffect( () => {
//         console.log("nije logovan");
//     },[formErrors])

//     const validate = (values) => {
//         const errors = {};
//         const regex = /^(?!\s)[A-Z0-9\s]+$/i;
//         values.privileges = "placeholder za privilegije";

//         for (let key in values) {

//             if (action=="Login"){
//                 if (key == "email" || key == "password")
//                     if (!values[key]) {
//                         errors[key] = `${key} is required!`;
//                     }
//             }
//             else if (typeOfUser=="student"){
//                 if (key != "gradDate" && key != "gradFaculty" && key != "phdGradDate" && key != "phdGradFaculty")
//                     if (!values[key]) {
//                         errors[key] = `${key} is required!`;
//                     }
//             }
//             else if (typeOfUser=="assistant"){
//                 if (key != "birthDate" && key != "index" && key!="phdGradDate" && key!="phdGradFaculty")
//                     if (!values[key]) {
//                         errors[key] = `${key} is required!`;
//                     }
//             }
//             else if (typeOfUser=="professor"){
//                 if (key != "birthDate" && key != "index") {
//                     if (!values[key]) {
//                         errors[key] = `${key} is required!`;
//                     }
//                 }
//             }else if (typeOfUser=="admin"){
//                 if (key == "email" || key == "password" || key=="name" || key=="lastName")
//                     if (!values[key]) {
//                         errors[key] = `${key} is required!`;
//                     }
//             }
//         }

//         return errors;
//     }

//     const showInputFields = () => {
//         return (
//             <div className='inputs'>
//                 <div className='input' style={{marginBottom: formErrors.email?"0px":"10px"}}>
//                     <img src={emailImg} alt=''></img>
//                     <input type='email' name='email' placeholder='Email' value = {formValues.email} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                 </div>
//                 <p>{formErrors.email}</p>
//                 <div className='input' style={{marginBottom: formErrors.password?"0px":"10px"}}>
//                     <img src={passwordImg} alt='' ></img>
//                     <input type='password' name='password' placeholder='Password' value = {formValues.password} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                 </div>
//                 <p>{formErrors.password}</p>

//                 {action!="Sign Up"? <></> : <>
//                     <div className='input' style={{marginBottom: formErrors.name?"0px":"10px"}}>
//                         <img src={userImg} alt='' ></img>
//                         <input type='text' name='name' placeholder='Name' value = {formValues.name} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                     </div>
//                     <p>{formErrors.name}</p>

//                     <div className='input' style={{marginBottom: formErrors.lastName?"0px":"10px"}}>
//                         <img src={userImg} alt='' ></img>
//                         <input type='text' name='lastName' placeholder='LastName' value = {formValues.lastName} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                     </div>
//                     <p>{formErrors.lastName}</p>

//                     {typeOfUser=="admin"? <></>: <>
//                         <div className='input' style={{marginBottom: formErrors.module?"0px":"10px"}}>
//                             <img src={userImg} alt='' ></img>
//                             <input type='text' name='module' placeholder='module' value = {formValues.module} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                         </div>
//                         <p>{formErrors.module}</p>

//                         {typeOfUser=="student"? <>
//                             <div className='input'style={{marginBottom: formErrors.index?"0px":"10px"}}>
//                                 <img src={userImg} alt='' ></img>
//                                 <input type="number" name='index' placeholder='index' value = {formValues.index} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                             </div>
//                             <p>{formErrors.index}</p>

//                             <div className='input' style={{marginBottom: formErrors.birthDate?"0px":"10px"}}>
//                                 <img src={userImg} alt='' ></img>
//                                 <input className="textbox-n" type="text" onFocus={(e) => (e.target.type = "date")}
//                                         onBlur={(e) => (e.target.type = "text")} name='birthDate' placeholder='datum rodjenja' value = {formValues.birthDate} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                             </div>
//                             <p>{formErrors.birthDate}</p>
//                         </>:
//                         <>
//                             <div className='input' style={{marginBottom: formErrors.gradDate?"0px":"10px"}}>
//                                 <img src={userImg} alt='' ></img>
//                                 <input className="textbox-n" type="text" onFocus={(e) => (e.target.type = "date")}
//                                         onBlur={(e) => (e.target.type = "text")} name='gradDate' placeholder='datum diplomiranja' value = {formValues.gradDate} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                             </div>
//                             <p>{formErrors.gradDate}</p>

//                             <div className='input' style={{marginBottom: formErrors.gradFaculty?"0px":"10px"}}>
//                                 <img src={userImg} alt='' ></img>
//                                 <input type="text" name='gradFaculty' placeholder='fakultet diplomiranja' value = {formValues.gradFaculty} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                             </div>
//                             <p>{formErrors.gradFaculty}</p>

//                             {typeOfUser!="professor"?<></> :
//                             <>
//                                 <div className='input' style={{marginBottom: formErrors.phdGradDate?"0px":"10px"}}>
//                                 <img src={userImg} alt='' ></img>
//                                 <input className="textbox-n" type="text" onFocus={(e) => (e.target.type = "date")}
//                                         onBlur={(e) => (e.target.type = "text")} placeholder="datum doktoriranja" name='phdGradDate' value = {formValues.phdGradDate} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                                 </div>
//                                 <p>{formErrors.phdGradDate}</p>

//                                 <div className='input' style={{marginBottom: formErrors.phdGradFaculty?"0px":"10px"}}>
//                                 <img src={userImg} alt='' ></img>
//                                 <input type="text" name='phdGradFaculty' placeholder='fakultet doktoriranja' value = {formValues.phdGradFaculty} onChange={handleChange} onKeyDown={handleKeypress}></input>
//                                 </div>
//                                 <p>{formErrors.phdGradFaculty}</p>
//                             </>}
//                         </>}
//                     </>}
//                 </>}
//             </div>
//         )
//     }

//     return (
//         <>
//         <div className='loginContainer'>
//             {/* {Object.keys(formErrors).length === 0 && isSubmit ? (<div className="ui message success">Signed in successfully</div>) :
//             (<pre>{JSON.stringify(formValues)} </pre>
//             )} */}
//             <form>
//             <div className='header'>
//                 <div className='text'>{action=="Login"?<>Login</>: <>Sign Up</>}</div>
//                 <div className='underline'></div>
//             </div>
//             <div className='submit-container'>
//                 <Button variant="primary" onClick={()=>{setAction("Login")}}>Login</Button>
//                 <DropdownButton id="dropdown-basic-button" title="Register as">
//                     <Dropdown.Item onClick={()=>{setAction("Sign Up"); setTypeOfUser("student")}}>student</Dropdown.Item>
//                     <Dropdown.Item onClick={()=>{setAction("Sign Up"); setTypeOfUser("assistant")}}>assistant</Dropdown.Item>
//                     <Dropdown.Item onClick={()=>{setAction("Sign Up"); setTypeOfUser("professor")}}>professor</Dropdown.Item>
//                     <Dropdown.Item onClick={()=>{setAction("Sign Up"); setTypeOfUser("admin")}}>admin</Dropdown.Item>
//                 </DropdownButton>
//             </div>

//             {showInputFields()}

//             <div style={{padding:"20px", float:"right"}}>
//                 <Button variant="primary" onClick={handleSubmit}>Submit dugme</Button>
//             </div>
//             </form>
//             <div style={{padding:"20px", float:"left"}}>
//                 <p>{formErrors.serverResponse}</p>
//             </div>
//         </div>
//         </>
//     )
// }

// export default LoginSignup;

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
    phdGradFaculty: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [action, setAction] = useState("Login");
  const [typeOfUser, setTypeOfUser] = useState("student");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var errorList = validate(formValues);

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
    const fieldNames = {
      name: "Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      module: "Module",
      gradDate: "Graduation Date",
      gradFaculty: "Graduation Faculty",
      birthDate: "Birth Date",
      index: "Index",
      phdGradDate: "PhD Graduation Date",
      phdGradFaculty: "PhD Graduation Faculty",
    };

    for (let key in values) {
      if (!values[key]) {
        errors[key] = `${fieldNames[key]} is required!`;
      }
    }

    return errors;
  };

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
            placeholder="Email"
            value={formValues.email}
            onChange={handleChange}
            onKeyDown={handleKeypress}
          ></input>
        </div>
        <p className="p-error">{formErrors.email}</p>
        <div
          className="input"
          style={{ marginBottom: formErrors.password ? "0px" : "10px" }}
        >
          <img src={passwordImg} alt=""></img>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formValues.password}
            onChange={handleChange}
            onKeyDown={handleKeypress}
          ></input>
        </div>
        <p className="p-error">{formErrors.password}</p>

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
                placeholder="Name"
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
                placeholder="Last Name"
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
                    placeholder="Module"
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
                        placeholder="Index"
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
                        placeholder="Birth Date"
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
                        placeholder="Graduation Date"
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
                        placeholder="Graduation Faculty"
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
                            placeholder="PhD Graduation Date"
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
                            placeholder="PhD Graduation Faculty"
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
        action === "Login" ? "highlighted login-signup-title" : "not-highlighted login-signup-title"
      }`}
      onClick={() => setAction("Login")}
    >
      Login 
    </h2>
  </div>

  <div className="col-sm-6">
    <h2
      className={`text-center mb-3 ${
        action === "Sign Up" ? "highlighted login-signup-title" : "not-highlighted login-signup-title"
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
              <Button type="submit" className="login-signup-btn btn btn-primary  w-100">
                {action}
              </Button>
            </div>
            {action === "Sign Up" && (
              <div className="mt-3">
                <label htmlFor="userType">Register as:</label>
                <DropdownButton
                  id="userType"
                  title={typeOfUser}
                  onSelect={(eventKey) => {
                    setTypeOfUser(eventKey);
                    setFormErrors({});
                  }}
                >
                  <Dropdown.Item eventKey="student">Student</Dropdown.Item>
                  <Dropdown.Item eventKey="assistant">Assistant</Dropdown.Item>
                  <Dropdown.Item eventKey="professor">Professor</Dropdown.Item>
                  <Dropdown.Item eventKey="admin">Admin</Dropdown.Item>
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
