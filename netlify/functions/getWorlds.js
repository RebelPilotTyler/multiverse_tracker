const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    try {
        // Read the file from Netlify's filesystem
        const filePath = path.join(__dirname, "../../protected/worlds.json");
        const worldsData = fs.readFileSync(filePath, "utf-8");

        return {
            statusCode: 200,
            body: worldsData,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error retrieving worlds data" }),
        };
    }
};
