// This script listens to Actions workflow events and sends a message to Discord using a bot

const { Client, Intents } = require('discord.js');

// Environment variables: Set these in your Actions workflow or deployment settings
const DISCORD_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const MESSAGE_CONTENT = process.env.MESSAGE_CONTENT || "Workflow triggered successfully!";

console.log(DISCORD_TOKEN);
console.log(CHANNEL_ID);

if (!DISCORD_TOKEN || !CHANNEL_ID) {
    console.error("Error: DISCORD_TOKEN or CHANNEL_ID is not set.");
    process.exit(1);
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', async () => {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (!channel || !channel.isText()) {
            console.error("Error: Channel is not valid or not a text channel.");
            process.exit(1);
        }

        await channel.send(MESSAGE_CONTENT);
        console.log("Message sent successfully.");
    } catch (error) {
        console.error("Failed to send message:", error.message);
    } finally {
        client.destroy();
    }
});

client.login(DISCORD_TOKEN);