require('dotenv').config();

const db = require('./Database/database.js');
const Discord = require('discord.js');

const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent', 'DirectMessages'] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    
});

client.on('debug', console.log);
client.on('warn', console.warn);
client.on('error', console.error);

client.login(process.env.DISCORD_BOT_TOKEN);