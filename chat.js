var _ = require('underscore')
  , net = require('net')

var chat_server = net.createServer()
  , clients = [];

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

function broadcast (message, sender) {
  _.each(clients, function(receiver) {
    if (receiver !== sender) {
      receiver.write(sender.name + " says: " + message);
    }
  });
}
