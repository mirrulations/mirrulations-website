// Retrieve the API Gateway URL from environment variables (AWS Amplify or local .env)
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

document.getElementById("search_button").addEventListener("click", search);

/**
 * Gets data for and updates the front end based on search.
 */
async function search() {
    const name = document.getElementById("search_input").value;
    const data = await getSearchData(name);
    const results_box = document.getElementById("results");
    results_box.innerHTML = ''; // Clears the results box from previous searches

    // Display all data from the API
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const result = document.createElement("p");
            const value = typeof data[key] === 'object' ? JSON.stringify(data[key], null, 2) : data[key];
            result.innerText = `${key}: ${value}`;
            results_box.appendChild(result);
        }
    }
}

/**
 * Fetches data from AWS API Gateway.
 * @param {string} name - The name to search for.
 * @returns {Object} - The search results.
 */
async function getSearchData(name) {
    if (!API_GATEWAY_URL) {
        throw new Error("API Gateway URL is not set. Check your environment variables.");
    }

    const response = await fetch(`${API_GATEWAY_URL}?name=${name}`, {
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data); // Log the data to debug its structure
    return data;
}