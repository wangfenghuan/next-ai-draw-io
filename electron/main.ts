import { app, BrowserWindow } from "electron"
import { createRequire } from "module"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, "preload.mjs"),
        },
        icon: join(__dirname, "../public/favicon.ico"),
    })

    const isDev = process.env.NODE_ENV === "development"
    if (isDev) {
        mainWindow.loadURL("http://localhost:6002")
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(join(__dirname, "../out/index.html"))
    }

    mainWindow.on("closed", () => {
        mainWindow = null
    })
}

app.whenReady().then(() => {
    createWindow()
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})
