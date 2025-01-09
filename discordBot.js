const { Client, GatewayIntentBits } = require('discord.js');

import { fetchWorldStatuses } from './app.js';

const worlds = fetchWorldStatuses();

// Environment variables: Set these in your Actions workflow or deployment settings
const BOT_TOKEN = process.env.BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const WORLD_INDEX = process.env.WORLD_INDEX;
const KEY = process.env.KEY;
const NEW_VALUE = process.env.NEW_VALUE

//let MESSAGE_CONTENT = `World Index: ${WORLD_INDEX}\nKey: ${KEY}\nNew Value: ${NEW_VALUE}`; //WORKS!!!
let MESSAGE_CONTENT = `${worlds[Number(WORLD_INDEX)].name}`

if (!BOT_TOKEN || !DISCORD_CHANNEL_ID) {
    console.error("Error: BOT_TOKEN or CHANNEL_ID is not set.");
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
    try {
        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        if (!channel?.isTextBased()) {
            console.error("Error: Channel is not valid or not a text-based channel.");
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

client.login(BOT_TOKEN);
