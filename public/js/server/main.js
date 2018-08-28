const WebSockerServer = require('ws').Server; 
const Session = require('./session');
const Client = require('./client');


const server = new WebSockerServer({ port: 9000 });

const sessions = new Map;


function createId(len = 6, chars ='abcdefghjkmnopqrstwxyz0123456789') {
    let id = '';
    while (len--) {
        id += chars[Math.random() * chars.length | 0];
    }
    return id;
}

server.on('connection', conn => {
    console.log('connection established');
    const client = new Client(conn);

    conn.on('message', msg => {
        console.log('message received !');
        console.log(msg);
        const data = JSON.parse(msg);

        if (data.type === 'create-session') {
            const id = createId();
            const session = new Session(id);
            session.join(client);
            sessions.set(session.id, session);
            client.send({ 
                type: 'session-created',
                id: session.id
            });
        } else if (data.type === 'join-session') {
            const session = sessions.get(data.id);
            session.join(client);
        }

        console.log('sessions', sessions)
    });

    conn.on('close', () => {
        console.log('connection closed');
        const session = client.session;
        if (session) {
            session.leave(client);
            if (session.clients.size === 0) {
                sessions.delete(session.id);
            }
        }
    })
});