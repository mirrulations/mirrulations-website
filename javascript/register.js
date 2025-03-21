let cognitoUser = null;
let COG_USE_POOL_ID;
let COG_CLIENT_ID;
let COG_REGION_ID;

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

if (import.meta.env.VITE_REGION_AWS) {
    COG_USE_POOL_ID = import.meta.env.VITE_REGION_AWS;
} else if (typeof REGION_COG_AMP !== 'undefined') { //USER_POOL_COG_AMP is the enviroment variable set in the AWS Amplify console
    // Running on AWS Amplify
    COG_REGION_ID = REGION_COG_AMP;
} else {
    console.error("Cognito User Pool is not set. Check your environment variables.");
}

if (!COG_REGION_ID) {
    throw new Error("Cognito User Pool is not set. Check your environment variables.");
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

    document.getElementById("registration_form").addEventListener("submit", registerUser);
    document.getElementById("verification_form").addEventListener("submit", verifyUser);
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

async function registerUser(event) {
    event.preventDefault(); // Prevent form submission

    const statusMessage = document.getElementById("registration_status");
    console.log("Register button clicked");

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check password requirements
    const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRequirements.test(password)) {
        statusMessage.innerText = "Password does not meet the requirements!";
        statusMessage.style.color = "red";
        return;
    }

    // Manually check if the email is already registered before calling signUp()
    if (await checkIfEmailExists(email)) {
        statusMessage.innerText = "Email already in use! Please use a different email.";
        statusMessage.style.color = "red";
        return;
    }

    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: COG_USE_POOL_ID,
        ClientId: COG_CLIENT_ID,
    });

    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "email",
            Value: email,
        }),
    ];

    userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
            console.error("Registration failed:", err);

            if (err.code === 'UsernameExistsException') {
                statusMessage.innerText = "Username already exists!";
            } else if (err.code === 'AliasExistsException') {
                statusMessage.innerText = "Email already in use! Please use a different email.";
                statusMessage.style.color = "red";
                return;
            } else {
                statusMessage.innerText = "Registration failed! " + err.message;
            }

            statusMessage.style.color = "red";
            return;
        }

        cognitoUser = result.user;
        console.log("Registration successful:", cognitoUser.getUsername());
        statusMessage.innerText = "Registration successful! Please check your email for verification.";
        statusMessage.style.color = "green";

        // Show the verification form
        document.getElementById("registration_form").style.display = "none";
        document.getElementById("verification_form").style.display = "block";
    });
}

async function verifyUser(event) {
    event.preventDefault(); // Prevent form submission

    const statusMessage = document.getElementById("verification_status");
    console.log("Verify button clicked");

    const verificationCode = document.getElementById("verification_code").value;

    cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
        if (err) {
            console.error("Verification failed:", err);
            statusMessage.innerText = "Verification failed!";
            statusMessage.style.color = "red";
            return;
        }

        console.log("Verification successful:", result);
        statusMessage.innerText = "Verification successful! You can now log in.";
        statusMessage.style.color = "green";

        // Redirect to the login page
        window.location.href = "login.html";
    });
}

async function checkIfEmailExists(email) {
    const cognitoISP = new AWS.CognitoIdentityServiceProvider();

    const params = {
        UserPoolId: COG_USE_POOL_ID,
        Filter: `email = "${email}"`,
        Limit: 1
    };

    try {
        const data = await cognitoISP.listUsers(params).promise();
        return data.Users && data.Users.length > 0; // Returns true if email exists
    } catch (error) {
        console.error("Error checking email existence:", error);
        return false; // Assume email does not exist if there's an error
    }
}