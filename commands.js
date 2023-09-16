const { joinVoiceChannel, createAudioResource, AudioPlayerStatus, createAudioPlayer } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const { setPrefix } = require('./Database/database.js');

//This function will deal with the play command
async function playCommand(message, args) {
    const voiceChannel = message.member.voice.channel;
  
    //The user must be present in the voice channel for the bot to join and play music
    if (!voiceChannel) {
      return message.channel.send('You need to be in a voice channel to play music!');
    }
  
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id.toString(),
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    connection.on('debug', console.debug);
  
    connection.on('stateChange', (oldState, newState) => {
        console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
    });

    const url = args[0]; // assuming the URL is the first argument to the command
    const stream = ytdl(url, { filter: 'audioonly' });
    console.log('Stream created with URL:', url);


    const resource = createAudioResource(stream);
    const player = createAudioPlayer();
  
    player.play(resource);
  
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    player.on('error', error => {
        console.error('Error in player:', error);
        message.channel.send("An error occurred while playing the audio. Have a look at the bot's console for more details.");
    });

    connection.on('error', error => {
        console.error('Error in connection:', error);
        message.channel.send("An error occurred in the connection. Have a look at the bot's console for more details.");
    });
  
    connection.subscribe(player);
  
    return message.reply(`Now playing: ${url}!`);
}

module.exports = {
    ping: {
        description: 'Bot responds with Pong!',
        execute(message, args)
        {
            message.channel.send('Pong!');
        },
    },
    setprefix: {
        description: 'Sets the prefix for the bot (Admin only)',
        async execute(message, args)
        {
            if (message.member.permissions.has('ADMINISTRATOR'))
            {
                const newPrefix = args[0];

                if (newPrefix)
                {
                    await setPrefix(message.guild.id, newPrefix);
                    message.channel.send(`Prefix set to ${newPrefix}`);
                } 
                    else
                {
                    message.channel.send('You must specify a new prefix!');
                }
            } 
                else
            {
                message.channel.send('You must have admin privileges to use this command!');
            }
        },
    },

    help: {
        description: 'List all of my commands.',
        execute(message, args, commands)
        {
          let helpMessage = 'Here are the available commands:\n';
          
          for (const [name, command] of Object.entries(commands))
          {
            helpMessage += `!${name}: ${command.description}\n`;
          }
    
          message.channel.send(helpMessage);
        },
    },

    play: {
        description: 'Play a song from YouTube',
        async execute(message, args)
        {
            playCommand(message, args);
        },
    },
};