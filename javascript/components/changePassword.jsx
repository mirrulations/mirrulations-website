import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/changePassword.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [statusMessage, setStatusMessage] = useState("");

  const cognitoUser = window.newPasswordCognitoUser;

  // Password validation checks
  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    specialChar: /[@$!%*?&]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordChecks).every((check) => check);

  useEffect(() => {
    if (!cognitoUser) {
      setStatusMessage("Session expired. Please log in again.");
      setTimeout(() => navigate("/auth"), 2000);
    }
  }, [cognitoUser, navigate]);

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!newPassword || !cognitoUser) {
      setStatusMessage("Missing data or password. Please try again.");
      return;
    }

    if (!isPasswordValid) {
      setStatusMessage("Please ensure your password meets all the requirements.");
      return;
    }

    cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
      onSuccess: (result) => {
        {statusMessage.text && (
          <p
            className={`mt-3 text-center ${
              statusMessage.type === "success" ? "text-success" : "text-danger"
            }`}
          >
            {statusMessage.text}
          </p>
        )}
        setTimeout(() => {
          navigate("/auth");
        }, 1500);
      },
      onFailure: (err) => {
        console.error("Password change failed:", err);
        setStatusMessage(err.message || "Password change failed.");
      },
    });
  };

  return (
    <div className="change-password-container">
      <form onSubmit={handleChangePassword} className="login">
        <h1>Change Mirrulations Password</h1>
        <p className="text-muted custom-text">In order to continue to Mirrulations, please create a password that adheres to all requirements below.</p>
        <div className="form-group mt-3 position-relative">
          <label htmlFor="newPassword" className="visually-hidden">New Password</label>
          <input
            id="newPassword"
            type={showPassword ? "text" : "password"} // Toggle input type based on state
            className="form-control"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#6c757d",
            }}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> {/* Use Font Awesome icons */}
          </span>
        </div>

        {/* Password Requirements */}
        <ul className="password-requirements mt-3">
          <li>
            <FontAwesomeIcon icon={passwordChecks.length ? faCheck : faTimes} className={passwordChecks.length ? "text-success" : "text-danger"} />
            {" "}At least 8 characters
          </li>
          <li>
            <FontAwesomeIcon icon={passwordChecks.uppercase ? faCheck : faTimes} className={passwordChecks.uppercase ? "text-success" : "text-danger"} />
            {" "}At least one uppercase letter
          </li>
          <li>
            <FontAwesomeIcon icon={passwordChecks.lowercase ? faCheck : faTimes} className={passwordChecks.lowercase ? "text-success" : "text-danger"} />
            {" "}At least one lowercase letter
          </li>
          <li>
            <FontAwesomeIcon icon={passwordChecks.number ? faCheck : faTimes} className={passwordChecks.number ? "text-success" : "text-danger"} />
            {" "}At least one number
          </li>
          <li>
            <FontAwesomeIcon icon={passwordChecks.specialChar ? faCheck : faTimes} className={passwordChecks.specialChar ? "text-success" : "text-danger"} />
            {" "}At least one special character (@, $, !, %, *, ?, &)
          </li>
        </ul>

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Change Password
        </button>
        {statusMessage && (
          <p className="mt-3 text-center text-danger">{statusMessage}</p>
        )}
      </form>

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

export default ChangePassword;