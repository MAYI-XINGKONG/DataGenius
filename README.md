## DataGenius
```markdown
环境版本：
python: 3.8.0 （如果需要）
  node: 18.20.0
   npm: 10.5.0
  yarn: 1.22.22
其他依赖版本看package.json
```
这是一个集成`Electron + Vite + Vue3 + Antd + SQLite3`的框架, 只需要按照需求在项目中填充即可，切勿随意更改配置，如需修改打包配置在 `electron-builder.json5`文件中

首先更改`.npmrc`文件的内容：
在文件中更改[electron_mirror]、[electron_builder_binaries_mirror]的值,没有则新建,
```markdown
electron_mirror=https://cdn.npmmirror.com/binaries/electron/
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
```
然后 `yarn install` （使用`npm`会有问题）, 依赖安装完成后再次 `npm install sqlite3`（此处切记用npm，可选，如果打包后sqlite3有问题则清空node_modules,重新yarn后使用npm安装此依赖,注意版本）

如果报错说下载(https://github.com/TryGhost/node-sqlite3/releases/download/v5.1.7/sqlite3-v5.1.7-napi-v36-win32-x64.tar.gz)包失败，
则打开`node_modules\sqlite3`下的`package.json`,将：
```json
"napi_versions": [
   3,
   6
]
```
中的数字去掉一个，我去掉的是3，再重新打包即可

运行：`yarn dev / npm run dev`

打包: `npm run build`
