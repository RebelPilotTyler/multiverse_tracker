const fetch = require('node-fetch'); // CommonJS import for compatibility

exports.handler = async (event, context) => {
    try {
        const body = JSON.parse(event.body);
        const { event_type } = body;

        // Ensure the event_type is specified and valid
        if (!event_type) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing 'event_type' in request body." }),
            };
        }

        const GITHUB_PAT = process.env.GITHUB_PAT; // GitHub PAT from Netlify's environment variables
        const repoOwner = "RebelPilotTyler"; // Update with your GitHub username
        const repoName = "multiverse_tracker"; // Repository name

        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/dispatches`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GITHUB_PAT}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ event_type }),
        });

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Workflow triggered successfully!" }),
            };
        } else {
            const errorData = await response.json();
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Error triggering workflow", error: errorData }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Server error", error: error.message }),
        };
    }
};
