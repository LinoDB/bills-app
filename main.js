const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const database = require(path.join(__dirname, "database_handler"))
let win

async function loadDatabase() {
    let db
    try {
        db = await database.open(path.join(__dirname, "bills_database"))
    }
    catch(e) {
        if(e == "SQLITE_CANTOPEN") {
            try {
                db = await database.createDatabase(path.join(__dirname, "bills_database"))
                db = await database.createTable(db, "clients", `client_id INTEGER PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                mobile TEXT,
                country TEXT DEFAULT "Deutschland",
                state TEXT,
                city TEXT,
                postal_code TEXT,
                street TEXT,
                house_number TEXT,
                address_additions TEXT,
                birthday DATE`)
            }
            catch(e) {
                console.log(e)
                exit(1)
            }
        }
        else {
            throw new Error("An error occurred while opening the database: " + e)
        }
    }
    return db
}

function createWindow () {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        }, 
        show: false,
    })

    win.loadFile(path.join(__dirname, 'views/index/index.html'))
    win.maximize(); 
    win.show(); 
}

app.whenReady().then(async () => {
    const db = await loadDatabase()
    ipcMain.handle('ping', async (e) => {
        try {
            ping = await database.queryAll(db, "clients")
        }
        catch(e) {
            ping = e
        }
        return ping
    })

    ipcMain.handle('switchWindow', (e, file) => {
        win.loadFile(path.join(__dirname, file))
    })

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})