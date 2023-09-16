require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent', 'DirectMessages'] });

client.on('messageCreate', message => {
    console.log(`Received message: "${message.content}" from ${message.author.tag}`); // Log received messages
    if (message.content === "!test")
    {
        console.log('Ping command received'); // Log when the ping command is received
        message.channel.send('Ye ye I am working fine')
            .then(msg => console.log('Sent reply: ', msg.content)) // Log if the message is sent successfully
            .catch(error => console.error('Failed to send message: ', error)); // Log if there is an error sending the message
    }
});

client.on('debug', console.log);
client.on('warn', console.warn);
client.on('error', console.error);

client.login(process.env.DISCORD_BOT_TOKEN);