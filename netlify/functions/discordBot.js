const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs'); // To read worlds.json

// Initialize Discord bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
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

// Load worlds data
function loadWorlds() {
    const data = fs.readFileSync('./worlds.json', 'utf8');
    return JSON.parse(data);
}

// Handle user commands
client.on('messageCreate'), (message) => {
    if (message.author.bot) return; // Ignore messages from bots

    const args = message.content.trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    // Handle "!world" command
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

// Ensure the bot initializes when deployed
initializeBot().catch((err) => console.error('Error initializing bot:', err));
