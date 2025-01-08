const { Client, GatewayIntentBits } = require('discord.js');
const chokidar = require('chokidar');
const fs = require('fs');

// Bot setup
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const TOKEN = process.env.BOT_TOKEN; // Replace with your bot's token
const CHANNEL_ID = 'website-test'; // Replace with your Discord channel ID

// When the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Watch for changes in worlds.json
    const watcher = chokidar.watch('./worlds.json', { persistent: true });
    watcher.on('change', () => {
        const worlds = loadWorlds();
        client.channels.cache.get(CHANNEL_ID).send('🌍 **Worlds updated!**');
    });
});

// Load worlds data
function loadWorlds() {
    const data = fs.readFileSync('./worlds.json', 'utf8');
    return JSON.parse(data);
}

// Respond to commands
client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    // Lookup world info
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

// Login to Discord
client.login(TOKEN);
