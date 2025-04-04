import React, { useState } from "react";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Cognito user pool data
const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const [verificationCode, setVerificationCode] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isVerificationStep, setIsVerificationStep] = useState(false);
    const navigate = useNavigate();

    const userPool = new CognitoUserPool(poolData);

    const registerUser = (event) => {
        event.preventDefault();

        // Basic validation
        if (!username || !email || !password) {
            setStatusMessage("Please fill out all fields.");
            return;
        }

        setIsLoading(true);
        setStatusMessage("");

        const attributeList = [
            {
                Name: "email",
                Value: email,
            },
        ];

        userPool.signUp(username, password, attributeList, null, (err, result) => {
            setIsLoading(false);

            if (err) {
                console.error("Registration failed:", err);
                setStatusMessage(err.message || "Registration failed.");
                return;
            }

            console.log("Registration successful:", result);
            setStatusMessage("Registration successful! Please check your email for the verification code.");
            setIsVerificationStep(true); // Move to the verification step
        });
    };

    const verifyUser = (event) => {
        event.preventDefault();

        // Basic validation
        if (!username || !verificationCode) {
            setStatusMessage("Please enter your username and verification code.");
            return;
        }

        setIsLoading(true);
        setStatusMessage("");

        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: userPool,
        });

        cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
            setIsLoading(false);

            if (err) {
                console.error("Verification failed:", err);
                setStatusMessage(err.message || "Verification failed.");
                return;
            }

            console.log("Verification successful:", result);
            setStatusMessage("Verification successful! You can now log in.");
            navigate("/auth");
        });
    };

    return (
        <div className="register-container">
            {!isVerificationStep ? (
                <form onSubmit={registerUser} className="register">
                    <h1>Mirrulations Register</h1>

                    {/* Username Field */}
                    <div className="form-group mt-3">
                        <label htmlFor="username" className="visually-hidden">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div className="form-group mt-3">
                        <label htmlFor="email" className="visually-hidden">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="form-group mt-3 position-relative">
                        <label htmlFor="password" className="visually-hidden">Password</label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"} // Toggle input type based on state
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* Use Font Awesome icons */}
                        </span>
                    </div>

                    <small className="text-muted">
                        Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.
                    </small>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>

                    {/* Login Link */}
                    {!isVerificationStep && (
                        <p id="login_link" className="text-center mt-3">
                            Already have an account? <a href="/auth">Login here</a>
                        </p>
                    )}
                </form>
            ) : (
                <form onSubmit={verifyUser} className="register">
                    <h1>Verify Mirrulations Account</h1>

                    {/* Username Field */}
                    <div className="form-group mt-3">
                        <label htmlFor="username" className="visually-hidden">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Verification Code Field */}
                    <div className="form-group mt-3">
                        <label htmlFor="verificationCode" className="visually-hidden">Verification Code</label>
                        <input
                            id="verificationCode"
                            type="text"
                            className="form-control"
                            placeholder="Verification Code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Verify"}
                    </button>
                </form>
            )}

            {/* Status Message */}
            {statusMessage && (
                <p
                    id="register_status"
                    className={`mt-3 text-center ${statusMessage.includes("successful") ? "text-success" : "text-danger"}`}
                >
                    {statusMessage}
                </p>
            )}

            {/* Footer Attribution */}
            <div className="footer mt-5 text-center">
                <small className="text-muted">
                    <a href="https://www.flickr.com/photos/wallyg/3664385777">Washington DC - Capitol Hill: United States Capitol</a>
                    <span> by </span><a href="https://www.flickr.com/photos/wallyg/">Wally Gobetz</a>
                    <span> is licensed under </span><a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">CC BY-NC-ND 2.0</a>
                </small>
            </div>
        </div>
    );
};

export default Register;