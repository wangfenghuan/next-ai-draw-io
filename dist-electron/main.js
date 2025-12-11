Object.defineProperty(exports, "__esModule", { value: true })
const electron_1 = require("electron")
const url_1 = require("url")
const path_1 = require("path")
const __filename = (0, url_1.fileURLToPath)(import.meta.url)
const __dirname = (0, path_1.dirname)(__filename)
let mainWindow = null
function createWindow() {
    electron_1.Menu.setApplicationMenu(null)
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        titleBarStyle:
            process.platform === "darwin" ? "hiddenInset" : "default",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: (0, path_1.join)(__dirname, "preload.mjs"),
        },
        icon: (0, path_1.join)(__dirname, "../public/favicon.ico"),
    })
    const isDev = process.env.NODE_ENV === "development"
    if (isDev) {
        mainWindow.loadURL("http://localhost:6002")
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile((0, path_1.join)(__dirname, "../out/index.html"))
    }
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron_1.shell.openExternal(url)
        return { action: "deny" }
    })
    mainWindow.on("closed", () => {
        mainWindow = null
    })
}
electron_1.app.whenReady().then(() => {
    createWindow()
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit()
    }
})
electron_1.app.on("web-contents-created", (_, contents) => {
    contents.on("will-navigate", (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl)
        if (
            parsedUrl.origin !== "http://localhost:6002" &&
            !parsedUrl.origin.startsWith("file://")
        ) {
            event.preventDefault()
            electron_1.shell.openExternal(navigationUrl)
        }
    })
})
