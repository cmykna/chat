var _ = require('underscore')
  , net = require('net')
  , fs = require('fs')

var chat_server = net.createServer()
  , clients = [];

var critters;

fs.readFile('critters', function(err, data) {
  if (err) throw err;
  critters = new Buffer(data).toString('ascii').split('\n+\n');
});

function sendBroadcast (message, sender) {
  _.each(clients, function(receiver) {
    if (receiver !== sender) {
      receiver.write(sender.name + " says: " + message);
    }
  });
}

function getRandomCritter () {
  return critters[Math.floor(Math.random() * critters.length)];
}

chat_server.on('connection', function (client) {
  var addr = client.remoteAddress
    , port = client.remotePort
    , critter = getRandomCritter();

  client.name = ['<', addr, ':', port, '>'].join('');
  client.write(critter + '\n');
  client.write('Hi!\n');
  clients.push(client);
  client.on('data', function (data) {
    sendBroadcast(data, client);
  });
});

chat_server.listen(9000);
