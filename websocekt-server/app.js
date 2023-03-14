// 导入nodejs-websocket
const ws = require('nodejs-websocket')
const PORT = 3000
// 创建一个server
const server = ws.createServer(connect => {
  console.log('由用户连接了')
  connect.on('text', data => {
    // 给用户一个响应数据
    // 给用户发送过来的数据转化为大写并且凭借一点内容
    console.log('收到 ' + data)
    connect.send(data.toUpperCase() + '!!!')
  })
  // 只要websocket连接断开，close事件就会触发
  connect.on('close', (code, reason) => {
    console.log('连接关闭')
  })
  // 注册一个
  connect.on('error', () => {
    console.log('用户连接错误')
  })
})
server.listen(PORT, () => {
  console.log('websocket服务启动成功了，跑在3000端口')
})
