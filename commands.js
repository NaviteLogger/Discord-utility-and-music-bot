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
};