
const { Client } = require('ssh2');
const shellCont = require('./shell')
const colors = require('colors')
const client = new Client();

/**
 * host 服务器ip
 * port 服务器端口
 * username 用户名
 * password 密码
 * locationPath 添加的项目配置路径名称，eg: /react/aaa/ccc
 * nginxFilePath nginx配置文件的路径
 */
interface IOptions {
	host?: string;
  port?: number;
  username?: string;
  password?: string;
  locationPath?: string;
  nginxFilePath?: string;
  aliasFilePath?: string;
}

class NginxConfigModify {
  private options: IOptions = {}

  public constructor(options: IOptions = {}) {
    this.options = options
  }

  public modify(): void {
    let {
      host,
      port = 22,
      username = 'root',
      password,
      locationPath = '/',
      nginxFilePath,
      aliasFilePath
    } = this.options

    client.on('ready', () => {
      client.sftp((err: any, sftp: any) => {
        if (err) throw err;
        
        sftp.writeFile('/tmp/push-nginx-conf.sh', shellCont, (err: any) => {
          if (err) throw err;
        });
        
        client.exec(`sh /tmp/push-nginx-conf.sh ${nginxFilePath} ${locationPath} ${aliasFilePath}`, (err: any, stream: any) => {
          if (err) {
            console.log('shell execute occur some error:' + colors.red(err));
          }
          stream.on('close', () => {
            client.end();
          }).on('data', (data: any) => {
            console.log(colors.rainbow(`\nlocation '${locationPath}', ${data}`))
          }).stderr.on('data', (data: any) => {
            console.log('' + data);
          });
        });
      });
    }).connect({
      host,
      port,
      username,
      password
    })
  }
}

// @ts-ignore
NginxConfigModify.prototype.apply = function(compiler: any) {
  compiler.hooks.done.tapAsync('NginxConfigModify', (compilation: any, callback: () => void) => {
    callback()
    this.modify()
  })
}

module.exports = NginxConfigModify