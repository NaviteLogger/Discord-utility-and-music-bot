const {
  joinVoiceChannel,
  createAudioResource,
  AudioPlayerStatus,
  createAudioPlayer,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const YouTube = require("youtube-sr");

const { setPrefix } = require("./Database/database.js");

//Create an array to store the queue of songs
let queue = [];

//Create a boolean to store whether a song is currently playing
let isPlaying = false;

async function playCommand(message, args) {
  const url = args[0]; //Assuming the URL is the first argument passed to the command

  if (isPlaying) {
    queue.push(url);
    message.reply(`Added ${url} to the queue!`);
  } else {
    isPlaying = true;
    play(connection, url, message);
  }
}

//This function will deal with the play command
async function play(connection, message, args) {
  const voiceChannel = message.member.voice.channel; //Get the user's voice channel

  //The user must be present in the voice channel for the bot to join and play music
  if (!voiceChannel) {
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  }

  //Set up the connection to the voice channel
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id.toString(),
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  //Debugging
  connection.on("debug", console.debug);

  //Log the connection state changes - this may produce a lot of console output, so consider commenting it out
  connection.on("stateChange", (oldState, newState) => {
    console.log(
      `Connection transitioned from ${oldState.status} to ${newState.status}`
    );
  });

  const url = args[0]; //Assuming the URL is the first argument passed to the command
  const stream = ytdl(url, { filter: "audioonly" }); //Create a stream from the YouTube video
  console.log("Stream created with URL:", url); //Debugging

  const resource = createAudioResource(stream); //Create an audio resource from the stream
  const player = createAudioPlayer(); //Create an audio player

  player.play(resource); //Play the audio resource

  player.on(AudioPlayerStatus.Idle, () => {
    if (queue.length > 0) {
      play(connection, queue.shift(), message);
    } else {
      connection.destroy();
      isPlaying = false;
    }
  });

  player.on("error", (error) => {
    console.error("Error in player:", error);
    message.channel.send(
      "An error occurred while playing the audio. Have a look at the bot's console for more details."
    );
  });

  connection.on("error", (error) => {
    console.error("Error in connection:", error);
    message.channel.send(
      "An error occurred in the connection. Have a look at the bot's console for more details."
    );
  });

  connection.subscribe(player);

  return message.reply(`Now playing: ${url}!`);
}

async function skipCommand(message, args) {
  if (isPlaying) {
    message.channel.send("Skipping current song!");
    connection.destroy();
    isPlaying = false;
  } else {
    message.channel.send("There is no song to skip!");
  }
}

async function stopCommand(message, args) {
  if (isPlaying) {
    message.channel.send("Stopping playback!");
    connection.destroy();
    isPlaying = false;
    queue = []; //Empty the queue
  } else {
    message.channel.send("There is no song to stop!");
  }
}

async function pauseCommand(message, args) {
  if (isPlaying) {
    message.channel.send("Pausing playback!");
    connection.pause();
  } else {
    message.channel.send("There is no song to pause!");
  }
}

async function resumeCommand(message, args) {
  if (isPlaying) {
    message.channel.send("Resuming playback!");
    connection.resume();
  } else {
    message.channel.send("There is no song to resume!");
  }
}

async function volumeControlCommand(message, args) {
  if (isPlaying) {
    const volume = args[0];
    if (volume) {
      message.channel.send(`Setting volume to ${volume}!`);
      connection.setVolume(volume);
    } else {
      message.channel.send(`The current volume is ${connection.state.volume}!`);
    }
  } else {
    message.channel.send("There is no song to set the volume for!");
  }
}

async function searchCommand(message, args) {
  //Retrieve the search term from the arguments
  const searchTerm = args.join(' ');

  if(!searchTerm) {
    return message.channel.send('You must specify a search term!');
  }

  try {
    //Search for videos based on the search term
    const videos = await YouTube.search(searchTerm, { limit: 5 });

    //Check if any videos were found
    if(videos.length === 0) {
      return message.channel.send('No videos found!');
    }

    //Create a string with the video titles to display
    let content = 'Here are the top 5 results:\n';
    videos.forEach((video, index) => {
      content += `${index + 1}: [${video.title}](${video.url})\n`;
    });
    content += 'Please enter the number of the video you want to play!';

    //Send the message with the video titles
    message.channel.send(content);

    //Create a filter to check if the user's message is a number between 1 and 5
    const filter = (response) => !isNaN(response.content) && response.content < 6 && response.content > 0;
    
    //Create a message collector
    const collector = message.channel.createMessageCollector({ filter, time: 30000 });

    collector.on('collect', async (response) => {
      const videoIndex = parseInt(response.content) - 1;
      const url = videos[videoIndex].url;

      //Play the video
      play(connection, message, url);
    });

    collector.on('end', (collected, reason) => {
      if(reason === 'time') {
        message.channel.send('Video selection timed out!');
      }
    });
  } catch(error) {
    console.error(error);
    message.channel.send('An error occurred while searching for videos!');
  }
}

module.exports = {
  ping: {
    description: "Bot responds with Pong!",
    execute(message, args) {
      message.channel.send("Pong!");
    },
  },
  setprefix: {
    description: "Sets the prefix for the bot (Admin only)",
    async execute(message, args) {
      if (message.member.permissions.has("ADMINISTRATOR")) {
        const newPrefix = args[0];

        if (newPrefix) {
          await setPrefix(message.guild.id, newPrefix);
          message.channel.send(`Prefix set to ${newPrefix}`);
        } else {
          message.channel.send("You must specify a new prefix!");
        }
      } else {
        message.channel.send(
          "You must have admin privileges to use this command!"
        );
      }
    },
  },

  help: {
    description: "List all of my commands.",
    execute(message, args, commands) {
      let helpMessage = "Here are the available commands:\n";

      for (const [name, command] of Object.entries(commands)) {
        helpMessage += `!${name}: ${command.description}\n`;
      }

      message.channel.send(helpMessage);
    },
  },

  playCommand: {
    description: "Play a song from YouTube",
    async execute(message, args) {
      playCommand(message, args);
    },
  },

  skip: {
    description: "Skip the current song",
    async execute(message, args) {
      skipCommand(message, args);
    },
  },

  stop: {
    description: "Stop playing queued songs",
    async execute(message, args) {
      stopCommand(message, args);
    },
  },

  pause: {
    description: "Pause the currently playing song",
    async execute(message, args) {
      pauseCommand(message, args);
    },
  },

  resume: {
    description: "Resume the currently playing song",
    async execute(message, args) {
      resumeCommand(message, args);
    },
  },

  volume: {
    description: "Set the volume of the currently playing song",
    async execute(message, args) {
      volumeControlCommand(message, args);
    },
  },
};
