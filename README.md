# Discord-music-bot
A simple discord music bot using discord.js for you to play music in your discord server voice channels.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Commands](#commands)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [FFmpeg](https://www.ffmpeg.org/download.html)
- [libtool](https://www.gnu.org/software/libtool/)
- [libsodium-wrappers](https://www.npmjs.com/package/libsodium-wrappers)

## Installation

1. Clone the repository
```sh
git clone https://github.com/NaviteLogger/Discord-music-bot.git
```

2. Install NPM packages
```sh
npm install
```

3. Install FFmpeg, libtool and libsodium-wrappers
```sh
sudo apt-get install ffmpeg libtool libsodium-wrappers
```

## Configuration

1. Create a new application in the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot for the application
3. Copy the bot token and paste it in the `.env` file
```sh
DISCORD_TOKEN=your_bot_token
```

## Usage

1. Start the bot
```sh
npm start
```

## Commands

Commands are available in the commands.json file. You can add, remove or modify the commands as per your requirements.

## Contributing

Contributions are always welcome! Please create a pull request to contribute to the project.

## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
