const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    try {
        // Use correct path inside the Netlify function execution environment
        const filePath = ".netlify/functions/worlds.json";

        console.log("Attempting to read file:", filePath);

        if (!fs.existsSync(filePath)) {
            console.error("File not found:", filePath);
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "worlds.json not found" }),
            };
        }

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
