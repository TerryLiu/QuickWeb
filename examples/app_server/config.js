/**
 * 服务器配置
 */
 
module.exports = {

  // Worker进程数量
  "cluster":    1
  
  // 监听的端口
, "listen http":  [8080, 81, 82]
  
  // 消息服务器，可以为Unix Socket
, "message":      "127.0.0.1:8851"
  
  // 管理界面
, "master": {
    "port":       8850           // 端口
  , "host":       "127.0.0.1"    // 地址
  , "admin":      "admin"        // 账户
  , "password":   "admin"        // 密码
  }
  
  // 更新状态
, "status update": {
    "connector":        60000    // 更新请求统计
  , "load line":        20000    // 更新系统资源占用
  , "load line size":   20       // 系统资源占用数据个数
  , "worker heartbeat": 30000    // Worker进程心跳间隔
  }
  
  // 记录的进程异常信息数量
, "exception log size": 50
  
  // 插件 onExtend 扩展request, response对象之后，执行路由处理程序之前
, "onExtend": function (req, res) {
    console.log(new Date().toUTCString() + ' ' + req.method + ' ' + req.url);
  }

  // 插件 onRequest 在接收到请求，准备处理之前
, "onRequest": function (req, res, next) {
    res.setHeader('Date', new Date().toUTCString());
    next();
  }
}