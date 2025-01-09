import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import path from 'path';

// Load the JSON file
const jsonPath = path.resolve('worlds.json');
const worldsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

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

//Utility Commands
    // Respond to a simple command
    if (message.content === '!test') {
        message.channel.send('Test command received. R5-L8, ready to assist!');
    }//Tests R5's access to worlds.json
    if (message.content === '!testFileAccess') {
        if (worldsData[0].name == 'Faerûn') {
            message.channel.send('File Access Confirmed!');
        }
        else {
            message.channel.send('File Access Incomplete.');
        }
    }//Tests R5's latency
    if (message.content === '!ping') {
        const latency = Date.now() - message.createdTimestamp;
        message.channel.send(`Pong! Latency is ${latency}ms.`);
    }//Grabs a list of R5's commands
    if (message.content === '!commands') {
        message.channel.send(`Here's a list of my programmed capabilities:\n
            **UTILITY**\n
            - !commands | This very command, to list my functions.\n
            - !test | Just for checking in and making sure I am active.\n
            - !testFileAccess | Test to make sure my access to the multiverse database is online.\n
            - !ping | Test my latency to the net.\n
            **INFORMATION**\n
            - !tellmeaboutyourself | Some information about your friendly multiversal droid!\n
            - !user | Seems like a dumb question, but if you want to know about yourself...\n
            - !portalwatch | Get the link to the website that hosts your portal watch!\n
            - !music | Get the link to the Campaign Soundtrack!\n
            - !episodes | For watching the latest episode!\n
            **OTHER**\n
            - !roll [sides] | Can't get enough dice rolling huh? Add sides for the different dice, good luck!
            `)
    }
//Information Commands
    //R5 blathers on about himself for a paragraph
    if (message.content === '!tellmeaboutyourself') {
        message.channel.send(`
            Of course! I'm R5-L8, a droid for Star Squadron. Right now I help out on ASTRAL Stationin the Technology Department. I am equipped with numerous technological and even combat functions, although I don't do much of that anymore. Ah that takes me back! I remember when I used to fight alongside the rest of the clones and- you know what nevermind.
            `);
    }//R5 tells someone about their character
    if (message.content === '!user') {
        if (message.author.tag == 'daime7'){
            message.channel.send(`
                You are Sworin of Team Alpha, a member of ASTRAL. Also the (self-proclaimed) captain of the ASTRAL Pirates.
                `);
        }
        else if (message.author.tag == 'buttere13'){
            message.channel.send(`
                You are Aurora Fiye of Team Alpha, a member of ASTRAL. Also a huntress and the hero Aura. No wonder you're helping us in the Tech Department, you've got a heck of a resume...
                `);
        }
        else if (message.author.tag == 'xstar_stealerx'){
            message.channel.send(`
                You are Dodo of Team Alpha, a member of ASTRAL. Not to mention the fancy title of Dodo the Indomitable. What's that you guys have been saying? Oh right, Dodo solos!
                `);
        }
        else if (message.author.tag == 'voidrain'){
            message.channel.send(`
                You are Rukia Dreamer of Team Omega, a member of SPIRIT. A hunter of gigantic monster that could eat me for breakfast... You're pretty high in the ranks there at SPIRIT too huh?
                `);
        }
        else if (message.author.tag == 'knine69'){
            message.channel.send(`
                You are Jack Kaiser of Team Omega, a member of SPIRIT. A warrior who flies on unseen wings, slaying giants who tower over most buildings. Sounds dangerous, but cool!
                `);
        }
        else if (message.author.tag == 'sithchris.'){
            message.channel.send(`
                You are Kazuma of Team Omega, a member of SPIRIT. A Jujutsu sorcerer and talented scientist. Watch where you're throwing that space-magic!
                `);
        }
        else if (message.author.tag == 's33dwallice'){
            message.channel.send(`
                You are Xylos 'Kelamee of Team Alpha, a member of ASTRAL. Leader of the Seekers of the Night, a group of Elites who serve your new goal. The Final Crusade, as I recall.
                `);
        }
        else if (message.author.tag == 'gitglonked'){
            message.channel.send(`
                You are Torin Wildhorne of Team Omega, a member of SPIRIT. I heard you had a cute puppy sidekick too, I must see it...
                `);
        }
        else if (message.author.tag == 'oddec'){
            message.channel.send(`
                You are Shiro of Team Alpha, a member of ASTRAL. And you've got the biggest appetite I've ever seen. And before you think it I am not edible!
                `);
        }
        else if (message.author.tag == 'arwtsh'){
            message.channel.send(`
                You are Elmer the Precognitor of Team Omega, a member of SPIRIT. You probably knew I was going to ask but, is it true you can see the future?
                `);
        }
        else if (message.author.tag == 'rebelpilottyler'){
            message.channel.send(`
                You are my creator and the writer of this game, Tyler! Forgot that easily?
                `);
        }
        else {
            message.channel.send(`You are ${message.author.tag}, an awesome member of this campaign! Thanks for hanging out!`);
        }
    }//Gives the website link
    if (message.content === '!portalwatch') {
        message.channel.send(`It's on your wrist dummy! Or do you need the link?\n[Portal Watch](https://multiverse-tracker.netlify.app/)`);
    }//Gives the link to the campaign soundtrack
    if (message.content === '!music') {
        message.channel.send(`You can find the epic soundtrack [here](https://www.youtube.com/playlist?list=PLMWMDY1YH65pvOSTxeop7J5fJlWKSEm9V)`);
    }//Gives the link to the campaign recordings
    if (message.content === '!episodes') {
        message.channel.send(`Watch the latest episodes of [Heroes of the Multiverse](https://www.youtube.com/playlist?list=PLMWMDY1YH65qJ-KIPaAlWErc9mPBuAPps)!`);
    }
//Other Commands
    if (message.content.startsWith('!roll')) {
        const args = message.content.split(' ');
        const sides = parseInt(args[1]) || 20;
        const roll = Math.floor(Math.random() * sides) + 1;
        message.channel.send(`You rolled a ${roll} on a D${sides}.`);
    }
});

// Log in to Discord
client.login(BOT_TOKEN);
