const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

// Discord bot setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

let botInitialized = false;

// Initialize the bot
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

// Load worlds data
function loadWorlds() {
    const data = fs.readFileSync('./worlds.json', 'utf8');
    return JSON.parse(data);
}

// Set up event listeners
function setupEventListeners() {
    if (botInitialized) {
        // Prevent adding multiple listeners
        return;
    }

    // Listen for messages to handle commands
    client.on('messageCreate', (message) => {
        if (message.author.bot) return;

        const args = message.content.trim().split(/\s+/);
        const command = args.shift().toLowerCase();

        if (command === '!world') {
            const worldName = args.join(' ');
            const worlds = loadWorlds();

            const world = worlds.find((w) => w.name.toLowerCase() === worldName.toLowerCase());
            if (world) {
                message.channel.send(
                    `🌍 **${world.name}**\nControl: ASTRAL - ${world.control.ASTRAL}%`
                );
            } else {
                message.channel.send(
                    `⚠️ World "${worldName}" not found. Make sure the name is spelled correctly.`
                );
            }
        }
    });
}

// Serverless function handler
exports.handler = async (event) => {
    try {
        await initializeBot();
        setupEventListeners();

        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body);
            const { action, worldName, message, fieldChanged, newValue } = body;

            if (action === 'notify') {
                const channel = client.channels.cache.get(CHANNEL_ID);
                if (channel) {
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
    } catch (error) {
        console.error('Handler error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

// Ensure the bot initializes properly on startup
initializeBot()
    .then(() => setupEventListeners())
    .catch((error) => console.error('Startup error:', error));
