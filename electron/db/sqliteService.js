const sqlite3 = require("sqlite3").verbose();
const { app } = require("electron");
const path = require("path");
const md5 = require('md5-node');

var sqliteDbPath = path.join(
  path.dirname(app.getPath("exe")),
  "/resources/database/dj-admin.db"
);

if (process.env.NODE_ENV === "development") {
  sqliteDbPath = path.resolve(__dirname, "../../database/dj-admin.db");
}

// 打开 SQLite 数据库连接
var db;

db = new sqlite3.Database(sqliteDbPath, function (err) {
  if (err){
    console.error(err.message)
  }
  console.log('已连接数据库.');
  // 初始化数据库表
  initDatabaseTables();
});

// 初始化数据库表
function initDatabaseTables() {
  const tableName = 'users'; // 假设要检查和创建的表名为 users
  const checkTableQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`;

  db.get(checkTableQuery, function (err, row) {
    if (err) {
      console.error(err.message);
      return;
    }
    if (!row) {
      // 表不存在，创建表
      const createTableQuery = `CREATE TABLE ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      )`;
      db.run(createTableQuery, function (err) {
        if (err) {
          console.error(err.message);
        } else {
          // 插入默认用户
          insertDefaultUser();
        }
      });
    }
  });
}

// 插入默认用户
function insertDefaultUser() {
  const defaultUsername = 'admin';
  const defaultPassword = '123456';
  const encryptedPassword = md5(defaultPassword);

  const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(insertQuery, [defaultUsername, encryptedPassword]);
}


//查询登录表
exports.login = function (username, password) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.all(query, [username, password], function (err, rows) {
      if (err) {
        reject(err);
      } else {
        if (rows.length > 0) {
          // 登录成功，返回用户名
          resolve({code: 200, msg: '欢迎回来！' + rows[0].username});
        } else {
          // 登录失败，返回错误提示
          resolve({code: 403, msg: '用户或密码不存在!'});
        }
      }
    });
  });
};
