require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages'] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);