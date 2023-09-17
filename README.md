# Local DJ Bot

## Description

Local DJ is a Discord bot that enhances your server's music-listening experience. With Local DJ, users can play YouTube videos directly in the voice channel, control playback, and queue up playlists for endless entertainment. Built with Node.js and utilizing the Discord.js library, it offers a seamless and efficient music streaming setup on your Discord server.

## Installation

### Requirements

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- A Discord Bot Token (obtained from 'https://discord.com/developers/applications')
- FFmpeg, libtool and libsodium-wrappers

### Setup

1. Clone the repository to your local machine using `git clone https://github.com/NaviteLogger/Discord-music-bot.git`.
2. Navigate to the project directory: `cd <project_directory_name>`.
3. Install the necessary software: `sudo apt install ffmpeg libtool`.
4. Install the necessary npm packages: `npm install`. Make sure that you have Node Package Manager installed. 
5. Create a  `.env` file and fill in your Discord Bot Token: `DISCORD_BOT_TOKEN=<your_token_from_discord_developer_portal>`.
6. Start the bot using `node bot.js`.

## Commands Documentation

### General

- `!ping`
  - Description: Checks the bot's latency.
  - Usage: `!ping`
  - Aliases: None

### Music

- `!play <URL>`
  - Description: Plays the YouTube video in the voice channel.
  - Usage: `!play https://www.youtube.com/watch?v=XYZ`
  - Aliases: None

(Note: Add more commands as you implement them)

## Contribution

If you would like to contribute to the project, please fork the repository and submit a pull request. I welcome contributions from the community.

## License

MIT License. See `LICENSE` for more information.

## Contact

For any queries, feel free to open an issue in the repository.

---

Developed with ❤️ by NaviteLogger
