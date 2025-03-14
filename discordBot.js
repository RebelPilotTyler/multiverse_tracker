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
const jsonPath = path.resolve('/.netlify/functions/getWorlds');
const worldsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Extract world data
const world = worldsData[WORLD_INDEX];
if (!world) {
    console.error(`Error: World with index ${WORLD_INDEX} not found.`);
    process.exit(1);
}

let forcedChannel = null;

//Set message content based on the new value written
let MESSAGE_CONTENT = `World Index: ${WORLD_INDEX}\nKey: ${KEY}\nNew Value: ${NEW_VALUE}`; //WORKS!!!
//let MESSAGE_CONTENT = `${world.name} data changed! ASTRAL Control at ${world.control.ASTRAL}%`
/*if (KEY == 'control.ASTRAL') {
    MESSAGE_CONTENT = `${world.name} data changed! ASTRAL Control at ${world.control.ASTRAL}%`
}*/
//Faction Control
if (KEY == 'control.ASTRAL' || KEY == 'control.SPIRIT' || KEY == 'control.Gilded_Garden' || KEY == 'control.Marines' || KEY == 'control.Flood' || KEY == 'control.Super Earth' || KEY == 'control.New_Republic') {
    MESSAGE_CONTENT = `# __***UPDATE***__\nFaction Control of *${world.name}* has changed.\n-# [Check your Portal Watch for details!](https://multiverse-tracker.netlify.app/)`;
}//POIs
else if (KEY == 'ASTRAL_details.points_of_interest') {
    MESSAGE_CONTENT = `# __***UPDATE***__\nPOIs updated for *${world.name}*.\n-# [Check your Portal Watch for details!](https://multiverse-tracker.netlify.app/)`;
    forcedChannel = 'ASTRAL';
}
else if (KEY == 'SPIRIT_details.points_of_interest') {
    MESSAGE_CONTENT = `# __***UPDATE***__\nPOIs updated for *${world.name}*.\n[-# Check your Portal Watch for details!](https://multiverse-tracker.netlify.app/)`;
    forcedChannel = 'SPIRIT';
}//Rifts
else if (KEY == 'ASTRAL_details.rifts') {
    MESSAGE_CONTENT = `# __***RIFT DETECTED***__\nEnergy trace is coming from *${world.name}*.\n[-# Check your Portal Watch for details!](https://multiverse-tracker.netlify.app/)`;
    forcedChannel = 'ASTRAL';
}
else if (KEY == 'SPIRIT_details.rifts') {
    MESSAGE_CONTENT = `# __***RIFT DETECTED***__\nEnergy trace is coming from *${world.name}*.\n[-# Check your Portal Watch for details!](https://multiverse-tracker.netlify.app/)`;
    forcedChannel = 'SPIRIT';
}//Merge Points
else if (KEY == 'ASTRAL_details.merge_points') {
    MESSAGE_CONTENT = `# __***MERGE POINT DISCOVERED***__\nThe Merge Point for *${world.name}* has been found.\n[-# Check your Portal Watch for details!](https://multiverse-tracker.netlify.app/)`;
    forcedChannel = 'ASTRAL';
}
else if (KEY == 'SPIRIT_details.merge_points') {
    MESSAGE_CONTENT = `# __***MERGE POINT DISCOVERED***__\nThe Merge Point for *${world.name}* has been found.\n[-# Check your Portal Watch for details!](https://multiverse-tracker.netlify.app/)`;
    forcedChannel = 'SPIRIT';
}//General Description
else if (KEY == 'details.description') {
    MESSAGE_CONTENT = `# __***UPDATE***__\nWorld Info for *${world.name}* has been updated.\n[-# Check your Portal Watch for details!](https://multiverse-tracker.netlify.app/)`;
}
else {
    console.log('Message not viewable by ASTRAL or SPIRIT.');
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
    try {
        if (forcedChannel == 'ASTRAL') {
            const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
            if (!channel?.isTextBased()) {
                console.error("Error: Channel is not valid or not a text-based channel.");
                process.exit(1);
            }

            await channel.send(MESSAGE_CONTENT);
            console.log("Message sent successfully.");
        }
        else if (forcedChannel == 'SPIRIT') {
            const channel = await client.channels.fetch(DISCORD_CHANNEL_ID2);
            if (!channel?.isTextBased()) {
                console.error("Error: Channel is not valid or not a text-based channel.");
                process.exit(1);
            }

            await channel.send(MESSAGE_CONTENT);
            console.log("Message sent successfully.");
        }
        else if (world.viewableBy.includes('ASTRAL') || world.viewableBy.includes('SPIRIT')) {
            if (world.viewableBy.includes('ASTRAL')) {
                const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
                if (!channel?.isTextBased()) {
                    console.error("Error: Channel is not valid or not a text-based channel.");
                    process.exit(1);
                }

                await channel.send(MESSAGE_CONTENT);
                console.log("Message sent successfully.");
            }
            if (world.viewableBy.includes('SPIRIT')) {
                const channel = await client.channels.fetch(DISCORD_CHANNEL_ID2);
                if (!channel?.isTextBased()) {
                    console.error("Error: Channel is not valid or not a text-based channel.");
                    process.exit(1);
                }

                await channel.send(MESSAGE_CONTENT);
                console.log("Message sent successfully.");
            }
        }
        else {
            console.log("Message not viewable by ASTRAL or SPIRIT.");
            process.exit(1);
        }
    } catch (error) {
        console.error("Failed to send message:", error.message);
    } finally {
        client.destroy();
    }
});

client.login(BOT_TOKEN);
