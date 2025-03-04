const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { release } = require("node:os");
const { join } = require("node:path");
const sqliteService = require("../db/sqliteService");

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// 禁用Windows 7的GPU加速
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

//为Windows 10+通知设置应用程序名称
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: any = null;
//在这里，您还可以使用其他预加载
const preload = join(__dirname, "../preload/index.js");


const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 720,
    height: 512,
    minHeight: 300,
    minWidth: 400,
    title: "Main window",
    titleBarStyle: "customButtonsOnHover",
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      //警告：启用nodeIntegration和禁用contextIsolation在生产中不安全
      //考虑使用contextBridge.exxposeInMainWorld
      // 在上阅读更多信息https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  win.setAspectRatio(1.364); //设置一个 13.364：10 的窗口比例：

  if (url) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged 如果应用程序未打包，请打开devTool
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  //测试向电子渲染器主动推送消息
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  //使用浏览器而不是应用程序打开所有链接
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // 如果用户试图打开另一个主窗口，请将注意力集中在主窗口上
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// 新窗口示例arg:New windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

//登录
// @ts-ignore
ipcMain.handle("login", async function (event, ...arg) {
  const username = arg[0], password = arg[1];
  const result = await sqliteService.login(username, password);
  return result;
});
