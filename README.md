# modify-nginx-conf

> Modify nginx server file
> 修改nginx配置文件，增加新路由配置

## Install

```bash
npm i -D modify-nginx-conf
yarn modify-nginx-conf -D
```

## Usage

add following code to your file.

#### `create-react-app`

```js
const WebpackModifyNginxConfigPlugin = require('modify-nginx-conf')

/**
 * host 服务器ip
 * port 服务器端口
 * username 用户名
 * password 密码
 * locationPath 添加的项目配置路径名称，eg: /react/aaa/ccc
 * nginxFilePath nginx配置文件的路径
 */
new WebpackModifyNginxConfigPlugin({
  username: 'root',
  host: 'xxxxxx',
  password: 'xxxxxx',
  locationPath: `xxxxxxx`,
  nginxFilePath: '/etc/nginx/conf.d/default.conf',
  aliasFilePath: `xxxx`
})
```
