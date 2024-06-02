const sqlite3 = require('sqlite3').verbose()

async function open(db_name) {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(db_name + '.db', sqlite3.OPEN_READWRITE, async (err) => {
            if (err) {
                reject(err.code)
            }
            else {
                resolve(db)
            }
        })
    })
}

async function createDatabase(db_name) {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(db_name + '.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, async (err) => {
            if(err) {
                reject(new Error("An error occurred while creating the database: " + err))
            }
            else {
                resolve(db)
            }
        })
    })
}

async function createTable(db, table_name, cols) {
    return new Promise((resolve, reject) => {
        db = db.exec(`
            CREATE TABLE ${table_name} (${cols});`, (err) => {
            if(err) {
                reject(new Error("An error occurred while creating the initial table in the database: " + err))
            }
            else {
                resolve(db)
            }
        })
    })
}

async function insertData(db, table_name, data) {
    return new Promise((resolve, reject) => {
        const cols = data.shift().join(', ')
        let values = []
        while(data.length > 0) {
            values.push(data.shift().join(', '))
        }
        values = values.join('),\n(')
        newdb = db.exec(`
            INSERT INTO ${table_name} (${cols})
            VALUES
                (${values});`, (err) => {
            if(err) {
                reject(new Error(`An error occurred while inserting data into table '${table_name}': ` + err))
            }
            else {
                resolve(newdb)
            }
        })
    })
}

async function queryAll(db, table_name) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT * FROM ${table_name};`, (err, rows) => {
            if(err) {
                reject(new Error(`An error occurred while inserting data into table '${table_name}': ` + err))
            }
            else {
                resolve(rows)
            }
        })
    })
}

module.exports = {open, createDatabase, createTable, insertData, queryAll}