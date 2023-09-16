require('dotenv').config();
const { joinVoiceChannel, createAudioResource, AudioPlayerStatus, createAudioPlayer } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const { getPrefix, setPrefix } = require('./Database/database.js');
const commands = require('./commands.js');
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
            const commandName = args.shift().toLowerCase(); //Get the command name, in lowercase
            
            const command = commands[commandName]; //Get the command object from the commands object
            if(!command)
            {
                return message.channel.send(`There is no command with name ${commandName}!`);
            }

            try
            {
                command.execute(message, args, commands);
            }
                catch(error)
            {
                console.error(error);
                message.channel.send('There was an error trying to execute the command:' + error.message);
            }
        }
    }
});

//This function will deal with the play command
async function playCommand(message, args) {
    const voiceChannel = message.member.voice.channel;
  
    //The user must be present in the voice channel for the bot to join and play music
    if (!voiceChannel) {
      return message.channel.send('You need to be in a voice channel to play music!');
    }
  
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
  
    const url = args[0]; // assuming the URL is the first argument to the command
    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();
  
    player.play(resource);
  
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  
    connection.subscribe(player);
  
    return message.reply(`Now playing: ${url}!`);
}

client.on('debug', console.log);
client.on('warn', console.warn);
client.on('error', console.error);

client.login(process.env.DISCORD_BOT_TOKEN);