const { contextBridge, ipcRenderer } = require("electron");

//登录
const login = async (username, password) => {
  let result = await ipcRenderer.invoke("login", username, password);
  if (result.length) {
    return {
      success: true,
      data: { username: result[0], message: "登录成功" },
    };
  } else {
    return { success: false, errMsg: "用户名密码不正确" };
  }
};

contextBridge.exposeInMainWorld("myAPI", {
  login
});
