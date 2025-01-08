const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds], // Minimum required intents
});

const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

console.log('Starting bot...');

let botInitialized = false;

// Initialize the bot
async function initializeBot() {
    try {
        console.log('Attempting to log in...');
        await client.login(TOKEN);
        console.log('Bot logged in successfully!');
        botInitialized = true;
    } catch (error) {
        console.error('Error logging in:', error.message);
    }
}

client.once('ready', () => {
    console.log(`Bot is online! Logged in as ${client.user.tag}`);
    console.log('Guilds the bot is connected to:');
    client.guilds.cache.forEach((guild) => {
        console.log(`- ${guild.name} (ID: ${guild.id})`);
    });
});

exports.handler = async (event) => {
    console.log('Received event:', event.body);

    try {
        if (!botInitialized) {
            await initializeBot();
        }

        const body = JSON.parse(event.body);
        const { worldName, fieldChanged, newValue } = body;

        const channel = client.channels.cache.get(CHANNEL_ID);
        if (channel) {
            const message = `🔔 **World Update** 🔔\n🌍 **World**: ${worldName}\n🛠️ **Field Changed**: ${fieldChanged}\n✨ **New Value**: ${newValue}`;
            await channel.send(message);
            console.log('Message sent:', message);
            return { statusCode: 200, body: 'Notification sent.' };
        } else {
            console.error('Channel not found.');
            return { statusCode: 404, body: 'Channel not found.' };
        }
    } catch (error) {
        console.error('Error in handler:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

initializeBot().catch((err) => console.error('Startup error:', err));
