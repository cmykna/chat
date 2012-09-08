var _ = require('underscore')
  , net = require('net')
  , fs = require('fs')

var chat_server = net.createServer()
  , clients = [];

var critters;

fs.readFile('critters', function (err, data) {
  if ( err ) throw err;
  critters = new Buffer(data).toString('ascii').split('\n+\n');
});

function sendBroadcast (message, sender) {
  console.log(message[0] + ' ' + message.length);
  var xclients = []
    , say = sender.name + " says: ";

  _.each(clients, function (receiver) {
    if ( receiver.writable ) {
      receiver !== sender && receiver.write(say + message);
    } else {
      xclients.push(sender);
      sender.destroy();
    }
  });

  if ( xclients.length > 0 ) {
    clients = _(clients).without(xclients);
  }

  if ( clients.length === 1 ) {
    sender.write('there\'s nobody here!\n');
  }

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
  client.write('Hi, ' + client.name + '!\n');
  clients.push(client);

  console.log(client.name + ' joined');

  client.on('data', function (data) {
    // don't send anything if it's just a blank line
    !(data[0] === 13 && data.length === 2) && sendBroadcast(data, client);
  });

  client.on('end', function () {
    console.log(client.name + ' left');
    clients = _(clients).without(this);
  });

  client.on('error', function (e) {
    console.log(e);
  })
});

chat_server.listen(9000);
