import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/auth.css";
import { AuthenticationDetails, CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";

//cognito user pool data, in env
const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

const Authentication = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuthenticated") === "true";
        setIsAuthenticated(storedAuth);
        if (storedAuth) {
            navigate("/search-page");
        }
    }, [navigate]);

    const authenticateUser = async (event) => {
        event.preventDefault();
        
        // Basic validation
        if (!username || !password) {
            setStatusMessage("Please enter both username and password");
            return;
        }

        setIsLoading(true);
        setStatusMessage("");

        const authenticationData = {
            Username: username,
            Password: password,
        };

        const authenticationDetails = new AuthenticationDetails(authenticationData);
        const userPool = new CognitoUserPool(poolData);
        const userData = {
            Username: username,
            Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                console.log("Authentication successful");
                setIsLoading(false);
                setStatusMessage("Login successful!");
                setIsAuthenticated(true);

                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("idToken", result.getIdToken().getJwtToken());

                navigate("/search-page");
            },
            onFailure: (err) => {
                console.error("Authentication failed:", err);
                setIsLoading(false);
                setStatusMessage(err.message || "Authentication failed");
            },
        });
    };

    return (
        <div className="login-container">
            {!isAuthenticated && (
                <form onSubmit={authenticateUser} className="login">
                    <h1>Mirrulations</h1>
                    
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
    
                    {/* Password Field */}
                    <div className="form-group mt-3">
                        <label htmlFor="password" className="visually-hidden">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
    
                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100 mt-3"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
    
                    {/* Status Message */}
                    {statusMessage && (
                        <p 
                            id="login_status" 
                            className={`mt-3 text-center ${statusMessage.includes("success") ? "text-success" : "text-danger"}`}
                        >
                            {statusMessage}
                        </p>
                    )}
    
                    {/* Register Link */}
                    <p id="register_link" className="text-center mt-3">
                        Don't have an account? <a href="/register">Register here</a>
                    </p>
    
                    {/* Footer Attribution */}
                    <div className="footer mt-5 text-center">
                        <small className="text-muted">
                            <a href="https://www.flickr.com/photos/wallyg/3664385777">Washington DC - Capitol Hill: United States Capitol</a>
                            <span> by </span><a href="https://www.flickr.com/photos/wallyg/">Wally Gobetz</a>
                            <span> is licensed under </span><a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">CC BY-NC-ND 2.0</a>
                        </small>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Authentication;