export default class ConnectionManager {
    constructor() {
        this.conn = null;
    }

    connect(address) {
        this.conn = new WebSocket(address);

        this.conn.addEventListener('open', () => {
            console.log('connection established');
            this.conn.send('create-session');
        });
    }
}