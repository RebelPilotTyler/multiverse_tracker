import { GITHUB_TOKEN } from './config.js';

const API_URL = 'https://api.github.com/repos/RebelPilotTyler/multiverse_tracker/contents/worlds.json';

const fetchWorldStatuses = async () => {
    try {
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`);
        }

        const data = await response.json();
        const worlds = JSON.parse(atob(data.content)); // Decode Base64
        console.log('Fetched Worlds:', worlds);
        return worlds;
    } catch (error) {
        console.error('Error fetching world statuses:', error);
        return [];
    }
};
