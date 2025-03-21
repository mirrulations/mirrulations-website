import React, {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/auth.css";


const Authentication = () => {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(false);
    
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuthenticated") === "true";
        setIsAuthenticated(storedAuth);
        if (storedAuth) {
            navigate("/search-page");
        }
    }, [navigate]);

    const handleLogin = async () => {
        //will have to replace this, im unsure
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        navigate("/search-page");
    }

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
        navigate("/auth");
    };

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    const handleRegister = () => {
        // Redirect to the registration page
        navigate("/register");
    }

    return (
        <div className="login-container">

            {/* Login/Logout Buttons */}
            {!isAuthenticated ? (
                <>
                    <section className="login">
                    <h1>Mirrulations</h1>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="password"
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleLogin}>
                        Login
                    </button>
                    {!isAuthenticated ? (
                <>
                    {/* Registration Link */}
                </>
            ) : null}
            {!isAuthenticated && (
                <p id="register_link">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            )}
                    </section>
                </>
            ) : (
                <button className="btn btn-secondary" onClick={handleLogout}>
                    Logout
                </button>
            )}
        </div>
    );

};

export default Authentication;
