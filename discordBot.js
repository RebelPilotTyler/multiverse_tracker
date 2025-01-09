import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits } from 'discord.js';

// Environment variables: Set these in your Actions workflow or deployment settings
const BOT_TOKEN = process.env.BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const DISCORD_CHANNEL_ID2 = process.env.DISCORD_CHANNEL_ID2;
const WORLD_INDEX = process.env.WORLD_INDEX;
const KEY = process.env.KEY;
const NEW_VALUE = process.env.NEW_VALUE;

if (!BOT_TOKEN || !DISCORD_CHANNEL_ID || !DISCORD_CHANNEL_ID2) {
    console.error("Error: BOT_TOKEN or CHANNEL_ID is not set.");
    process.exit(1);
}

// Load the JSON file
const jsonPath = path.resolve('worlds.json');
const worldsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Extract world data
const world = worldsData[WORLD_INDEX];
if (!world) {
    console.error(`Error: World with index ${WORLD_INDEX} not found.`);
    process.exit(1);
}

const { name, control } = world;
const controlSummary = Object.entries(control)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');


let activeChannel = DISCORD_CHANNEL_ID;

let MESSAGE_CONTENT = `World Index: ${WORLD_INDEX}\nKey: ${KEY}\nNew Value: ${NEW_VALUE}`; //WORKS!!!
//let MESSAGE_CONTENT = `${world.name} data changed! ASTRAL Control at ${world.control.ASTRAL}%`
/*if (KEY == 'control.ASTRAL') {
    MESSAGE_CONTENT = `${world.name} data changed! ASTRAL Control at ${world.control.ASTRAL}%`
}*/
if (KEY == 'control.ASTRAL') {
    activeChannel = DISCORD_CHANNEL_ID;
    MESSAGE_CONTENT = "Message to the test ASTRAL channel!";
}
if (KEY == 'control.SPIRIT') {
    activeChannel = DISCORD_CHANNEL_ID2;
    MESSAGE_CONTENT = "Message to the test SPIRIT channel!";
}

//MESSAGE_CONTENT = `User: ${ currentUser }\n` + MESSAGE_CONTENT;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
    try {
        const channel = await client.channels.fetch(activeChannel);
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
