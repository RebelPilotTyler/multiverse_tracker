exports.handler = async (event) => {
    const { username, password } = JSON.parse(event.body);

    // Securely get passwords from Netlify environment variables
    const storedPasswords = {
        ASTRAL: process.env.ASTRAL_PASSWORD,
        SPIRIT: process.env.SPIRIT_PASSWORD,
        GM: process.env.GM_PASSWORD,
    };

    // Validate login credentials
    if (storedPasswords[username] && storedPasswords[username] === password) {
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Login successful" }),
        };
    } else {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false, message: "Invalid credentials" }),
        };
    }
};
