var _ = require('underscore')
  , net = require('net')
  , chat_server = net.createServer()
  , clients = [];

chat_server.on('connection', function (client) {
  client.write('Hi!\n');
  clients.push(client);
  client.on('data', function (data) {
    // var i = 0
    //   , number_of_clients = client_list.length;
    // for (i; i < number_of_clients; i++) {
    //     client_list[i].write(data);
    // }
    _.each(clients, function (client) {
      client.write(data);
    }, data);
  });
  // client.end();
});

chat_server.listen(9000);
