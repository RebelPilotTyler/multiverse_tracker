const { Client, GatewayIntentBits } = require('discord.js');

// Discord bot setup
const client = new Client({
    intents: [GatewayIntentBits.Guilds], // Minimum required intents
});
const TOKEN = process.env.BOT_TOKEN; // Discord bot token
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID; // Target Discord channel

let botInitialized = false;

// Initialize the bot at startup
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

// Call initializeBot immediately when the serverless function is deployed
initializeBot().catch((err) => console.error('Startup error:', err));

// Serverless function handler
exports.handler = async (event) => {
    try {
        // Parse the incoming request
        const body = JSON.parse(event.body);
        const { worldName, fieldChanged, newValue } = body;

        console.log('Loaded CHANNEL_ID:', process.env.DISCORD_CHANNEL_ID);
        console.log('Loaded CHANNEL_ID:', CHANNEL_ID);

        // Send the notification to Discord
        const channel = client.channels.cache.get(CHANNEL_ID);
        if (channel) {
            const message = `🔔 **World Update** 🔔\n🌍 **World**: ${worldName}\n🛠️ **Field Changed**: ${fieldChanged}\n✨ **New Value**: ${newValue}`;
            await channel.send(message); // Wait for the message to be sent
            console.log(`Message sent to Discord: ${message}`);

            // Return success response
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

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (channel) {
        try {
            await channel.send('Test message from the bot!');
            console.log('Message sent successfully.');
        } catch (error) {
            console.error('Failed to send message:', error.message);
        }
    } else {
        console.error('Channel not found. Check the CHANNEL_ID.');
    }
});

client.once('ready', () => {
    console.log('Bot is online!');
    console.log('Guilds the bot is connected to:');
    client.guilds.cache.forEach((guild) => {
        console.log(`- ${guild.name} (ID: ${guild.id})`);
    });
});
