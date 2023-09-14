require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages'] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const testChannel = client.channels.cache.get('YOUR_CHANNEL_ID_HERE');
    if (testChannel) {
        testChannel.send('Bot has started up');
    }
});

client.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

client.on('debug', console.log);
client.on('warn', console.warn);
client.on('error', console.error);

client.login(process.env.DISCORD_BOT_TOKEN);