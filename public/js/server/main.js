const WebSockerServer = require('ws').Server; 
const server = new WebSockerServer({ port: 9000 });

server.on('connection', conn => {
    console.log('connection established');

    conn.on('close', () => {
        console.log('connection closed');
    })
});