let cognitoUser = null;
let isAuthenticated = false; // Flag to check if the user is authenticated
let COG_USE_POOL_ID;
let COG_CLIENT_ID;

//User Pool ID vite ingestion
// Check if the environment variable is defined (for local development with Vite)
if (import.meta.env.VITE_COGNITO_USER_POOL_ID) {
    COG_USE_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
} else if (typeof USER_POOL_COG_AMP !== 'undefined') { //USER_POOL_COG_AMP is the enviroment variable set in the AWS Amplify console
    // Running on AWS Amplify
    COG_USE_POOL_ID = USER_POOL_COG_AMP;
} else {
    console.error("Cognito User Pool is not set. Check your environment variables.");
}

if (!COG_USE_POOL_ID) {
    throw new Error("Cognito User Pool is not set. Check your environment variables.");
}

//Client ID vite ingestion
// Check if the environment variable is defined (for local development with Vite)
if (import.meta.env.VITE_COGNITO_CLIENT_ID) {
    COG_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
} else if (typeof CLIENT_ID_COG_AMP !== 'undefined') { //CLIENT_ID_COG_AMP is the enviroment variable set in the AWS Amplify console
    // Running on AWS Amplify
    COG_CLIENT_ID = CLIENT_ID_COG_AMP;
} else {
    console.error("Cognito Client ID is not set. Check your environment variables.");
}

if (!COG_CLIENT_ID) {
    throw new Error("Cognito Client ID is not set. Check your environment variables.");
}

// Load AWS SDK and Cognito SDK when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded. Initializing SDKs...");

    try {
        await loadAWSSDK();
        console.log("AWS SDK (with Cognito) loaded successfully.");
    } catch (error) {
        console.error("Failed to load AWS SDK:", error);
        return; // Stop execution if AWS SDK fails
    }

    console.log("All SDKs loaded. Adding event listeners...");

    document.getElementById("login_form").addEventListener("submit", authenticateUser);
});

async function loadAWSSDK() {
    return new Promise((resolve, reject) => {
        const awsScript = document.createElement("script");
        awsScript.src = "https://sdk.amazonaws.com/js/aws-sdk-2.1192.0.min.js"; // AWS SDK
        awsScript.onload = () => {
            console.log("AWS SDK loaded successfully.");

            // Ensure Cognito Identity Service is available
            if (AWS && AWS.CognitoIdentityServiceProvider) {
                console.log("Cognito SDK is available within AWS SDK.");
                resolve();
            } else {
                reject(new Error("Cognito SDK not found inside AWS SDK!"));
            }
        };
        awsScript.onerror = (error) => {
            console.error("Failed to load AWS SDK:", error);
            reject(error);
        };
        document.head.appendChild(awsScript);
    });
}

async function authenticateUser(event) {
    event.preventDefault(); // Prevent form submission

    const statusMessage = document.getElementById("login_status");
    console.log("Authenticate button clicked");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const authenticationData = {
        Username: username,
        Password: password,
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const poolData = {
        UserPoolId: COG_USE_POOL_ID,
        ClientId: COG_CLIENT_ID,
    };

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
        Username: authenticationData.Username,
        Pool: userPool,
    };
    cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            console.log("Authentication successful");
            statusMessage.innerText = "User authenticated successfully!";
            statusMessage.style.color = "green";
            isAuthenticated = true; // Set the flag to true when the user is authenticated

            // Store authentication status and ID token in localStorage
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("idToken", result.getIdToken().getJwtToken());

            // Redirect to the main page
            window.location.href = "index.html";
        },
        onFailure: (err) => {
            console.error("Authentication failed:", err);
            if (err.code === 'UserNotFoundException') {
                statusMessage.innerText = "User does not exist!";
            } else if (err.code === 'NotAuthorizedException') {
                statusMessage.innerText = "Incorrect username or password!";
            } else {
                statusMessage.innerText = "Authentication failed!";
            }
            statusMessage.style.color = "red";
            isAuthenticated = false; // Ensure the flag is false if authentication fails
        },
        mfaRequired: (message) => {
            console.log("Multi-factor authentication required:", message);
            statusMessage.innerText = "MFA required!";
            statusMessage.style.color = "orange";
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
            console.log("New password required:", userAttributes);

            // Ensure the user attributes include the required fields (e.g., email, given_name)
            const newPassword = prompt("Please enter your new password:");

            if (newPassword) {
                // Exclude immutable attributes like email_verified and email
                const updatedAttributes = {};
                for (const key in userAttributes) {
                    if (userAttributes.hasOwnProperty(key) && key !== "email" && key !== "email_verified") {
                        updatedAttributes[key] = userAttributes[key];
                    }
                }

                // Complete the authentication with the new password and necessary attributes
                cognitoUser.completeNewPasswordChallenge(newPassword, updatedAttributes, {
                    onSuccess: (result) => {
                        console.log("New password set successfully!");
                        statusMessage.innerText = "New password set successfully!";
                        statusMessage.style.color = "green";
                        isAuthenticated = true; // Set the flag to true when the user is authenticated

                        // Store authentication status and ID token in localStorage
                        localStorage.setItem("isAuthenticated", "true");
                        localStorage.setItem("idToken", result.getIdToken().getJwtToken());

                        // Redirect to the main page
                        window.location.href = "index.html";
                    },
                    onFailure: (err) => {
                        console.error("Failed to set new password:", err);
                        statusMessage.innerText = "Failed to set new password!";
                        statusMessage.style.color = "red";
                        isAuthenticated = false; // Ensure the flag is false if setting the new password fails
                    },
                });
            } else {
                statusMessage.innerText = "New password not provided!";
                statusMessage.style.color = "red";
                isAuthenticated = false; // Ensure the flag is false if the new password is not provided
            }
        },
    });
}