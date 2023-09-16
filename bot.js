require('dotenv').config();

const { getPrefix, setPrefix } = require('./Database/database.js');
const Discord = require('discord.js');

const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent', 'DirectMessages'] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    //Ignore messages from bots - basically read/react only to human messages
    if(message.guild)
    {
        let prefix = await getPrefix(message.guild.id);
        if(!prefix)
        {
            prefix = '!'; //Set the prefix to the default one
        }

        //Ignore messages that don't start with the prefix - basically read/react only to commandss
        if(message.content.startsWith(prefix))
        {
            const args = message.content.slice(prefix.length).trim().split(/ +/); //Split the message into an array of arguments
            const command = args.shift().toLowerCase(); //Get the command name, in lowercase
        }
    }
});

client.on('debug', console.log);
client.on('warn', console.warn);
client.on('error', console.error);

client.login(process.env.DISCORD_BOT_TOKEN);