const sqlite3 = require('sqlite3').verbose();

//Opening of the database handle
let db = new sqlite3.Database('./db/quotes.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
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
function getPrefix(guildIdd)
{
    return new Promise((resolve, reject) => {
        db.get("SELECT prefix FROM guilds WHERE guild_id = ?", [guildId], (error, row) => {
            if (error)
            {
                console.error(error.message);
                reject(error);
            }
                else
            {
                console.log(`Prefix of guild ${guildId} is ${row.prefix}`);
                resolve(row.prefix);
            }
        });
    });
}

//Exporting the database handle
module.exports = db;