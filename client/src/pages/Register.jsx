import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Register.css";
import { AuthContext } from "../contexts/AuthContext"

const MAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,24}$/;


function Register() {

    const navigate = useNavigate();
    const { register } = useContext(AuthContext);


    const mailRef = useRef();
    const errRef = useRef();

    //MAIL + input check
    const [mail, setMail] = useState("");
    const [validMail, setValidMail] = useState(false);
    const [mailFocus, setMailFocus] = useState(false);

    //PASSWORD + input check
    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        mailRef.current.focus();
    }, []);

    useEffect(() => {
        //test if mail fits regex criteria - if yes set validMail to true. Do this everytime something in mail changes
        const result = MAIL_REGEX.test(mail);
        setValidMail(result);
    }, [mail]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
    }, [pwd]);

    //clear out error message when user starts typing again
    useEffect(() => {
        setErrMsg("");
    }, [mail, pwd]);


    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const registrated = await register(mail, pwd);

            if (registrated) {
                console.log("Registration successful");
                setSuccess(true);
            }
        } catch (error) {
            console.log(error);

        }
    };

    const navigateToLogin = () => {
        navigate("/login");
    };

    return (
        <section className="register">
            <p
                ref={errRef}
                className={errMsg ? "errMsg" : "offscreen"}
                //error code readble with screen reader
                aria-live="assertive"
            >
                {errMsg}
            </p>

            <h1>Register</h1>

            <form onSubmit={handleRegister}>

                <label htmlFor="mail">
                    Email:
                    {/* if email is valid show green check mark */}
                    <span className={validMail ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    {/* if we have valid email or if user state does not exist (=field empty), we want to hide regex */}
                    <span className={validMail || !mail ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>

                <input
                    placeholder="register with email"
                    type="text"
                    //for future reusage: id should match htmlFor of label
                    id="email"
                    ref={mailRef}
                    //dont show other inputs from former users (its registration process for new user, suggestions wouldnt help anyway)  
                    autoComplete="off"
                    onChange={(e) => setMail(e.target.value)}
                    aria-invalid={validMail ? "false" : "true"}
                    //makes uidnote readable with screen reader
                    aria-describedby="uidnote"
                    onFocus={() => setMailFocus(true)}
                    onBlur={() => setMailFocus(false)}
                    required
                />
                <p id="uidnote" className={mailFocus && mail && !validMail ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Please enter a valid email address.
                </p>

                <label htmlFor="password">
                    Password:
                    {/* if password is valid show green check mark */}
                    <span className={validPwd ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    {/* if we have valid email or if user state does not exist (=field empty), we want to hide regex */}
                    <span className={validPwd || !pwd ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </label>

                <input
                    placeholder="set a password"
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />

                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters. <br />
                    Must contain at least one lowercase letter, one uppercase letter and one number.
                </p>

                <button type="submit">Register!</button>
            </form>

            {success ? <p>Registration succesfull! Please switch to login.</p> : <p>Already registered?</p>}
            <a className="a" onClick={navigateToLogin}>Login</a>

        </section>
    );
}


export default Register;