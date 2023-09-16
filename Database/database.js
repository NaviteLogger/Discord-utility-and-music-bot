const sqlite3 = require('sqlite3').verbose();

//Opening of the database handle
let db = new sqlite3.Database('./Database/botDatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
    if (error) {
        console.error(error.message);
    }
    console.log('Successfully connected to the SQLite database.');
});

//Initialization of the database
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS guilds (guild_id TEXT, prefix TEXT)");
});

//This query is used to get the prefix of a guild
function getPrefix(guildId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT prefix FROM guilds WHERE guild_id = ?", [guildId], (error, row) => {
            if (error)
            {
                console.error(error.message);
                reject(error);
            }
                else
            {
                if (row)
                {
                    console.log(`Prefix of guild ${guildId} is ${row.prefix}`);
                    resolve(row.prefix);
                }
                    else
                {
                    console.log(`Prefix for guild ${guildId} not found, default prefix will be used to handle commands.`);
                    resolve(null); // resolve with null or a default prefix
                }
            }
        });
    });
}


//This query is used to set the prefix of a guild
function setPrefix(guildId, prefix)
{
    return new Promise((resolve, reject) => {
     db.run("INSERT INTO guilds (guild_id, prefix) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET prefix = ?", [guildId, prefix, prefix], (error) => {
            if (error)
            {
                console.error(error.message);
                reject(error);
            }
                else
            {
                console.log(`Prefix of guild ${guildId} set to ${prefix}`);
                resolve(prefix);
            }
        });   
    });
}

//Exporting the database handle
module.exports = {
    db: db,
    getPrefix: getPrefix,
    setPrefix: setPrefix
};