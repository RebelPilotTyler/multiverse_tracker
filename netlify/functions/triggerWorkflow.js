const fetch = require('node-fetch');

export async function handler(event) {
    try {
        const body = JSON.parse(event.body);
        const { event_type, client_payload } = body;

        if (!event_type || !client_payload) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid payload: event_type or client_payload is missing." }),
            };
        }

        const GITHUB_PAT = process.env.GITHUB_PAT;
        const response = await fetch(`https://api.github.com/repos/RebelPilotTyler/multiverse_tracker/dispatches`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GITHUB_PAT}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ event_type, client_payload }),
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
                body: JSON.stringify({ error: errorData }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
