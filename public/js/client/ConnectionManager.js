export default class ConnectionManager {
    constructor(playerManager, entityFactory, level) {
        this.conn = null;
        this.peers = new Map();

        this.entityFactory = entityFactory;
        this.level = level;

        this.playerManager = playerManager;
        this.localPlayer = [...playerManager.instances][0]

        this.names = ['mario', 'player'];
    }

    connect(address) {
        this.conn = new WebSocket(address);

        this.conn.addEventListener('open', () => {
            console.log('connection established');
            this.initSession();
            this.watchEvents();
        });

        this.conn.addEventListener('message', event => {
            console.log('received message', event.data);
            this.receive(event.data);
        });
    }

    initSession() {
        const sessionId = window.location.hash.split('#')[1];
        if (sessionId) {
            this.send({
                type: 'join-session',
                id: sessionId
            });
        } else {
            this.send({ 
                type: 'create-session',
            });
        }
    }

    watchEvents() {
        const entity = this.localPlayer;
        console.log(entity);

        
        ['go', 'kill'].forEach(prop => {
            console.log(entity.events, prop);
            entity.events.listen(prop, () => {
                console.log('test')
                this.send({
                    type: 'state-update',
                    fragment: 'player',
                    state: [prop, entity[prop]]
                })
            })
        });
    }

    updateManager(peers) {
        const me = peers.you;
        const clients = peers.clients.filter(id => me !== id);
        clients.forEach(id => {
            if (!this.peers.has(id)) {
                const player = this.playerManager.createPlayer(this.entityFactory, this.level, 'mario');
                this.peers.set(id, player);
            }           
        });
        console.log(this.peers);

        [...this.peers.entries()].forEach(([id, player]) => {
            if (clients.indexOf(id) === -1) {
                this.playerManager.removePlayer(player, this.level);
                this.peers.delete(id);
            }
        })
    }

    updatePeer(id, fragment, [prop, value]) {
        if (!this.peers.has(id)) {
            console.error('client does not exist', id);
            return;
        }

        const player = this.peers.get(id);
        player[fragment][prop] = value;
        // if (prop === 'go') {
        //     console.log(' is a gooooo');
        // }

        if (prop === 'kill') {
            console.log('kill this player');
            this.playerManager.removePlayer(player, this.level);
            this.peers.delete(id);
        }
        // if (prop === 'score') {
        //     console.log('score');
        // }
    }

    receive(msg) {
        // console.log('reveive', msg);
        const data = JSON.parse(msg);
        if (data.type === 'session-created') {
            window.location.hash = data.id;
        } else if (data.type === 'session-broadcast') {
            this.updateManager(data.peers);
        } else if (data.type === 'state-update') {
            this.updatePeer(data.clientId, data.fragment, data.state);
        }
    }

    send(data) {
        const msg = JSON.stringify(data);
        
        console.log('sending message', msg);
        this.conn.send(msg);
        
    }
}