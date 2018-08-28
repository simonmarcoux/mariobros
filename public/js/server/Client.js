
class Client {
    constructor(conn, id) {
        this.id = id;
        this.conn = conn;
        this.session = null;
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