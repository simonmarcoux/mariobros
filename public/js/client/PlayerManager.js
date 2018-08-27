import PlayerController from "../traits/PlayerController";

class PlayerManager {
    constructor() {
        this.instances = new Set;
    }

    createPlayer() {
        const player = null; //new PlayerController();
        this.instances.add(player);

        // add to canvas

        return player;
    }

    removePlayer(player) {
        this.instances.delete(player);
        // remove from canvas
    }
}