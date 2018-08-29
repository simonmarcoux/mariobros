
class Client {
    constructor(conn, id) {
        this.id = id;
        this.conn = conn;
        this.session = null;
    }

    broadcast(data) {
        if (!this.session) {
            throw new Error('can not broadcast without session');
        }

        data.clientID = this.id;
        this.session.clients.forEach(client => {
            if (this === client) {
                return;
            }
            client.send(data);
        });
    }

    send(data) {
        const msg = JSON.stringify(data);
        
        console.log(`sending message ${msg}`);
        this.conn.send(msg, function ack(err) {
            if (err) {
                console.error('Error sending message', msg, err);
            }
        });
    }
}

module.exports = Client;