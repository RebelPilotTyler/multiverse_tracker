const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

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

// Load worlds data
function loadWorlds() {
    const data = fs.readFileSync('./worlds.json', 'utf8');
    return JSON.parse(data);
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

// Respond to commands
client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignore bot messages

    const args = message.content.trim().split(/\s+/); // Split the message into words
    const command = args.shift().toLowerCase(); // Extract the command

    // Handle the "!world" command
    if (command === '!world') {
        const worldName = args.join(' '); // Combine the rest of the message into the world name
        const worlds = loadWorlds(); // Load worlds data

        const world = worlds.find((w) => w.name.toLowerCase() === worldName.toLowerCase());
        if (world) {
            // Respond with world information
            message.channel.send(`🌍 **${world.name}**\nControl: ASTRAL - ${world.control.ASTRAL}%`);
        } else {
            // Respond if the world is not found
            message.channel.send(`⚠️ World "${worldName}" not found. Make sure the name is spelled correctly.`);
        }
    }
});

// Bot login
client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}`);
});

client.login(TOKEN);