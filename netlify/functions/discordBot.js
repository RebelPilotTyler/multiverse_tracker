const { Client, GatewayIntentBits } = require('discord.js');

// Discord bot setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Allows the bot to interact with guilds (servers)
    ],
});
const TOKEN = process.env.BOT_TOKEN; // Discord bot token from environment variables
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID; // Target Discord channel ID

let botInitialized = false;

// Function to initialize the bot
async function initializeBot() {
    if (!botInitialized) {
        try {
            await client.login(TOKEN);
            console.log('Discord bot initialized');
            botInitialized = true;
        } catch (error) {
            console.error('Error initializing bot:', error);
            throw error;
        }
    }
}

// Serverless function handler
exports.handler = async (event) => {
    try {
        // Ensure the bot is initialized
        await initializeBot();

        // Parse the incoming request body
        const body = JSON.parse(event.body);
        const { worldName, fieldChanged, newValue } = body;

        // Send a message to the Discord channel
        const channel = client.channels.cache.get(CHANNEL_ID);
        if (channel) {
            const message = `🔔 **World Update** 🔔\n🌍 **World**: ${worldName}\n🛠️ **Field Changed**: ${fieldChanged}\n✨ **New Value**: ${newValue}`;
            await channel.send(message);
            console.log(`Message sent to Discord: ${message}`);

            // Return a successful response
            return { statusCode: 200, body: 'Notification sent.' };
        } else {
            console.error('Channel not found.');
            return { statusCode: 404, body: 'Channel not found.' };
        }
    } catch (error) {
        console.error('Error in handler:', error.message, error.stack);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message,
                stack: error.stack,
            }),
        };
    }
};

// Initialize the bot when the serverless function is deployed
initializeBot().catch((err) => console.error('Startup error:', err));
