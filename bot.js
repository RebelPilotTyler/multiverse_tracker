const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const chokidar = require('chokidar'); // For watching file changes

// Bot setup
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const TOKEN = process.env.BOT_TOKEN; // Replace with your bot's token
const CHANNEL_ID = 'website-test'; // Replace with your Discord channel ID

// Load worlds data
function loadWorlds() {
    const data = fs.readFileSync('./worlds.json', 'utf8');
    return JSON.parse(data);
}

// Respond to commands
client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignore bot messages

    const args = message.content.trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    // Handle !world command
    if (command === '!world') {
        const worldName = args.join(' ');
        const worlds = loadWorlds();

        const world = worlds.find((w) => w.name.toLowerCase() === worldName.toLowerCase());
        if (world) {
            message.channel.send(`🌍 **${world.name}**\nControl: ASTRAL - ${world.control.ASTRAL}%`);
        } else {
            message.channel.send(`⚠️ World "${worldName}" not found.`);
        }
    }
});

// Notify on file changes
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    const watcher = chokidar.watch('./worlds.json', { persistent: true });
    watcher.on('change', () => {
        client.channels.cache.get(CHANNEL_ID).send('🌍 **Worlds updated!**');
    });
});

// Login to Discord
client.login(TOKEN);
