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

//Exporting the database handle
module.exports = db;