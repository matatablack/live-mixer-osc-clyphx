const { Server, Message } = require('node-osc');
const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8000,
});

var oscServer = new Server(9000, '0.0.0.0');

let client = null;
let lastMessage = 'none'

oscServer.on('listening', () => {
  console.log('OSC Server is listening.');
})

setInterval(() => {
  console.log('clyphx -> ', lastMessage)
}, 1000)

const filter = [/* 'FADER_11' */]
oscServer.on('message', (clyphxMsg) => {
  let message = String(clyphxMsg)
  lastMessage = message
  
  // if(!filter.length === 0 && filter.some(str => message.includes(str))) { 
  // if(!filter.length === 0 && filter.some(str => message.includes(str))) { 
    message = message.split('/')
    let control = message[1]
    let [type, value] = message[2].split(',')    
    const msg = JSON.stringify({ type, control, value })
    client?.send(msg);   

  // }
});

wss.on('connection', (ws) => {
  console.log('Client Connected')
  ws.send(JSON.stringify({
    msg: 'welcome',
    type: 'message',
  }));

  client = ws
});




wss.on('request', function(request) {
  var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))
});


const cleanup = () => wss.clients.forEach((socket) => {
  // Soft close
  socket.close();
  oscServer.close();
  process.nextTick(() => {
    if ([socket.OPEN, socket.CLOSING].includes(socket.readyState)) {
      // Socket still hangs, hard close
      socket.terminate();
    }
  });
});



process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean'); cleanup();
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true, cleanup:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true, cleanup:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true, cleanup:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));



