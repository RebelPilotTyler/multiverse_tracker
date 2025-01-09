const { Client, GatewayIntentBits } = require('discord.js');

// Create a new Discord client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Bot token from environment variable
const BOT_TOKEN = process.env.BOT_TOKEN;

// When the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for messages
client.on('messageCreate', message => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Respond to a simple command
    if (message.content === '!test') {
        message.channel.send('Test command received! Bot is working.');
    }
});

// Log in to Discord
client.login(BOT_TOKEN);
