const { Client } = require('node-osc');

const client = new Client('127.0.0.1', 9000);

client.send('/hello', 'world', (err) => {
  if (err) console.error(err);
  client.close();
});