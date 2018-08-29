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

function createClient(conn, id = createId()) {
    return new Client(conn, id);
}

function createSession(id = createId()) {
    if (sessions.has(id)) {
        throw new Error(`Session ${id} already exist`);
    } 

    const session = new Session(id);
    sessions.set(id, session);
    // console.log('Creating session', session);

    return session;
    
}

function getSession(id) {
    return sessions.get(id);
}

function broadcastSession(session) {
    const clients = [...session.clients];
    clients.forEach(client => {
        client.send({
            type: 'session-broadcast',
            peers: {
                you: client.id,
                clients: clients.map(client => client.id), // iterate over the clients and return only the id
            }
        })
    });
}

server.on('connection', conn => {
    console.log('connection established');
    const client = createClient(conn);

    conn.on('message', msg => {
        const data = JSON.parse(msg); 
        // console.log('message received !', data);
        
        // const data = JSON.parse(msg);

        if (data.type === 'create-session') {
            // const id = createId();
            const session = createSession();
            session.join(client);
            client.send({ 
                type: 'session-created',
                id: session.id
            });
        } else if (data.type === 'join-session') {
            const session = getSession(data.id) || createSession(data.id);
            session.join(client);
            
            broadcastSession(session);
        } else if (data.type === 'state-update') {
            client.broadcast(data);
        }

        // console.log('sessions', sessions)
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

        broadcastSession(session);
    })
});