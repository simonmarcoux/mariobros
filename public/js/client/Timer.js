export default class Timer {
    constructor(deltaTime = 1/60) {
        let accumulatedTime = 0;
        let lastTime = 0;
    
        // redraw compositor at each frame
        this.updateProxy = (time) => {
            accumulatedTime += (time - lastTime) / 1000;

            // timer hack 
            if (accumulatedTime > 1) {
                accumulatedTime = 1;
            }
    
            while (accumulatedTime > deltaTime) {
                this.update(deltaTime)
                accumulatedTime -= deltaTime;
            }
            
            lastTime = time;

            this.enqueue();
        }
    }

    enqueue() {
        requestAnimationFrame(this.updateProxy);
    }

    start() {
        this.enqueue();
    }
}