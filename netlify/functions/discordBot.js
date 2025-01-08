const { Client, GatewayIntentBits } = require('discord.js');

// Initialize Discord bot
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const TOKEN = process.env.BOT_TOKEN; // Add your bot token in Netlify environment variables
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID; // Add your channel ID in Netlify environment variables

let botInitialized = false;

// Function to initialize the bot
async function initializeBot() {
    if (!botInitialized) {
        await client.login(TOKEN);
        console.log('Discord bot initialized');
        botInitialized = true;
    }
}

// Serverless function handler
exports.handler = async (event) => {
    await initializeBot();

    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const { action, worldName, message, fieldChanged, newValue } = body;

        if (action === 'notify') {
            const channel = client.channels.cache.get(CHANNEL_ID);
            if (channel) {
                // Construct the message dynamically
                const notificationMessage = `🔔 **World Update** 🔔\n🌍 **World**: ${worldName}\n🛠️ **Field Changed**: ${fieldChanged}\n✨ **New Value**: ${newValue}`;
                
                await channel.send(notificationMessage);
                return { statusCode: 200, body: 'Notification sent.' };
            } else {
                return { statusCode: 404, body: 'Channel not found.' };
            }
        }

        return { statusCode: 400, body: 'Invalid action.' };
    }

    return { statusCode: 405, body: 'Method not allowed.' };
};
