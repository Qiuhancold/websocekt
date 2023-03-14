// 导入nodejs-websocket
const ws = require('nodejs-websocket')
const PORT = 3001
const TYPE_ENTER = 0 //表示进入聊天室的消息
const TYPE_LEAVE = 1 //用户离开聊天室的消息
const TYPE_MSG = 2 //正常的聊天消息
//  分析：
// 消息应该是一个对象
// type:消息的类型，0：表示进入聊天室的消息 1：用户离开聊天室的消息 2：正常的聊天消息
// msg:消息的内容
// time：聊天的具体时间
// /**/

let count = 0
// connect每个链接到服务器的用户都会有一个connect
// 创建一个server
const server = ws.createServer(connect => {
  console.log('新的连接')
  count++
  connect.userName = `用户${count}`
  // 1.告诉所有用户，有人加入了聊天室
  broadcast({
    type: TYPE_ENTER,
    msg: `${connect.userName}进入了聊天室`,
    time: new Date().toLocaleTimeString(),
  })
  // 接收到浏览器的数据
  connect.on('text', data => {
    // 2.收到消息的时候告诉所有用户，发送的消息内容
    broadcast({
      type: TYPE_MSG,
      msg: `${data}`,
      time: new Date().toLocaleTimeString(),
    })
  })
  // 关闭连接触发
  connect.on('close', (code, reason) => {
    console.log('连接关闭')
    count--
    // 3.告诉所有用户，有人离开了聊天室
    broadcast({
      type: TYPE_LEAVE,
      msg: `${connect.userName}离开了聊天室`,
      time: new Date().toLocaleTimeString(),
    })
  })
  // 发生异常 触发
  connect.on('error', () => {
    console.log('用户连接错误')
  })
})
// 广播，给所有用户发送消息
function broadcast(msg) {
  // server.connections:表示所有用户
  server.connections.forEach(item => {
    item.send(JSON.stringify(msg))
  })
}
server.listen(PORT, () => {
  console.log(`websocket服务启动成功了，跑在${PORT}端口`)
})
