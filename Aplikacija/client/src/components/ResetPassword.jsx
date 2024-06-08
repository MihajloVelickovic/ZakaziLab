import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const initialValues = {
    pas1: "",
    pas2: ""
};

const ResetPassword = () => {
    const [formValues, setFormValues] = useState(initialValues);
    const confirmToken = useParams();
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        const response = await fetch(`http://127.0.0.1:1738/user/resetPassword`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${confirmToken.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: formValues.pas1,
                confirmPassword: formValues.pas2
            })
        });
        const receivedMessage = await response.json();
        if (response.status === 200) {
            console.log("uspesno, vracena poruka je:", receivedMessage.message);
        } else {
            console.log("neuspesno, poruka je:", receivedMessage.message);
        }

        setMessage(receivedMessage.message);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    useEffect(() => {
        if (message === "Uspešno resetovana šifra") {
            const timer = setTimeout(() => {
                window.location.href = `/login`;
            }, 3000); // 3 seconds delay

            return () => clearTimeout(timer); // Clean up the timer if the component unmounts or message changes
        }
    }, [message]);

    return (
        <>
            <h2 style={{ textAlign: "center", marginTop: "40px" }}>
                Hello
            </h2>

            <div className="forgotPasswordContainer">
                <h3>Unesite novu šifru</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        <input
                            type="password"
                            name="pas1"
                            placeholder='password'
                            value={formValues.pas1}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        <input
                            type="password"
                            name="pas2"
                            placeholder='Potvrdite Password'
                            value={formValues.pas2}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>
            {message && <div>{message}</div>}
        </>
    );
}

export default ResetPassword;
