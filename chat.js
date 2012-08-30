var _ = require('underscore')
  , net = require('net')
  , chat_server = net.createServer()
  , clients = [];

function broadcast (message, client) {
  var i = 0
    , clen = clients.length;
  for (i; i < clen; i++) {
    if (client !== clients[i]) {
      clients[i].write(client.name + " says " + message);
    }
  }
}

chat_server.on('connection', function (client) {
  var addr = client.remoteAddress
    , port = client.remotePort;

  client.name = '<' + addr + ':' + port + '>';
  client.write('Hi!\n');
  clients.push(client);
  client.on('data', function (data) {
    broadcast(data, client);
  });
});

chat_server.listen(9000);
