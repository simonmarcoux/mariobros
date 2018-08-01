import Keyboard from './KeyboardState.js';

export function setupKeyboard(player) {
    const input = new Keyboard();
    input.addMapping('Space', keyState => {
        if (keyState) {
            player.jump.start();
        } else {
            player.jump.cancel();
        }
    });

    input.addMapping('KeyO', keyState => {
        player.turbo(keyState);
    });

    input.addMapping('KeyD', keyState => {
        player.go.dir += keyState ? 1 : -1;
    });

    input.addMapping('KeyA', keyState => {
        player.go.dir += keyState ? -1 : 1;
    });

    return input;
}
