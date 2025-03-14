const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    try {
        // Define file path
        const filePath = path.join(__dirname, "../../protected/worlds.json");

        // Debug: Log file path to check if it's correct
        console.log("Attempting to read file:", filePath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error("File not found:", filePath);
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "worlds.json not found" }),
            };
        }

        // Read file
        const worldsData = fs.readFileSync(filePath, "utf-8");

        return {
            statusCode: 200,
            body: worldsData,
        };
    } catch (error) {
        console.error("Error in getWorlds.js:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
