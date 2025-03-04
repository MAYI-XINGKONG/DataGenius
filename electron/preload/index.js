const { contextBridge, ipcRenderer } = require("electron");
const md5 = require('md5-node');

//登录
const login = async (username, password) => {
 return await ipcRenderer.invoke("login", username, md5(password));
};

contextBridge.exposeInMainWorld("myAPI", {
  login
});
