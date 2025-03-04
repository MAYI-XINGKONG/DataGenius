const sqlite3 = require("sqlite3").verbose();
const { app } = require("electron");
const path = require("path");

var sqliteDbPath = path.join(
  path.dirname(app.getPath("exe")),
  "/resources/database/dj-admin.db"
);

if (process.env.NODE_ENV === "development") {
  sqliteDbPath = path.resolve(__dirname, "../../database/dj-admin.db");
}

console.log(sqliteDbPath);
// 打开 SQLite 数据库连接
var db;

db = new sqlite3.Database(sqliteDbPath, function (err) {
  if (err){
    console.error(err.message)
  }
  console.log('已连接数据库.');
});
//查询登录表
exports.login = function (username, password) {
  return new Promise((resolve, reject) => {
    // const query = `SELECT * FROM 表名 WHERE username = ? AND password = ?`;
    // db.all(query, [username, password], function (err, rows) {
    //   if (err) {
    //     reject(err);
    //   }
    //   resolve(rows);
    // });
    // 对数据库的操作
    resolve([username]);
  });
};
