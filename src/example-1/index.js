const http = require('http');

const host = '0.0.0.0';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, host, () => {
  console.log(`Server running at ${host}:${port}`);
});
