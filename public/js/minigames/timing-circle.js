class TimingCircleMinigame {
    constructor(engine) {
        this.engine = engine;
        this.circle = null;
        this.greenZone = null;
        this.timerInterval = null;
        this.animationFrame = null;
        this.startTime = 0;
        this.cycleDuration = 2000;
        this.active = false;
        this.greenZoneSize = 0;
    }

    start(pokemon, ballType, onSuccess, onFail) {
        this.engine.start(pokemon, ballType, onSuccess, onFail);
        this.active = true;
        this.startTime = Date.now();

        this.setupMinigame();
        this.startTimer();
        this.animate();
    }

    setupMinigame() {
        const area = document.getElementById('minigame-area');
        area.innerHTML = '';

        const gameContainer = document.createElement('div');
        gameContainer.className = 'timing-circle-container';

        const target = document.createElement('div');
        target.className = 'timing-target';
        
        this.greenZone = document.createElement('div');
        this.greenZone.className = 'green-zone';
        
        this.circle = document.createElement('div');
        this.circle.className = 'timing-circle';

        target.appendChild(this.greenZone);
        target.appendChild(this.circle);
        gameContainer.appendChild(target);

        const instruction = document.createElement('div');
        instruction.className = 'minigame-instruction';
        instruction.textContent = '¡Haz clic cuando el círculo esté en la zona verde!';
        gameContainer.appendChild(instruction);

        area.appendChild(gameContainer);

        this.greenZoneSize = this.getGreenZoneSize();
        this.greenZone.style.height = `${this.greenZoneSize}%`;
        this.greenZone.style.top = `${50 - this.greenZoneSize / 2}%`;

        target.addEventListener('click', () => this.handleClick());
    }

    getGreenZoneSize() {
        const pokemon = this.engine.pokemon;
        const ballType = this.engine.ballType;

        const levelFactor = Math.min(pokemon.level / 100, 0.5);
        const captureRateFactor = (100 - pokemon.captureRate) / 200;
        const difficulty = levelFactor + captureRateFactor;

        const baseSizes = {
            masterball: 60,
            ultraball: 40,
            superball: 30,
            pokeball: 20
        };

        const baseSize = baseSizes[ballType] || 20;
        return Math.max(10, baseSize - (difficulty * 15));
    }

    getTimerDuration() {
        const pokemon = this.engine.pokemon;
        const ballType = this.engine.ballType;

        const levelFactor = pokemon.level / 100;
        const captureRateFactor = (100 - pokemon.captureRate) / 200;
        const difficulty = levelFactor + captureRateFactor;

        const baseTimes = {
            masterball: 15,
            ultraball: 12,
            superball: 10,
            pokeball: 8
        };

        const baseTime = baseTimes[ballType] || 8;
        return Math.max(5, baseTime - (difficulty * 3));
    }

    startTimer() {
        const duration = this.getTimerDuration();
        this.timerInterval = this.engine.setTimer(duration);
    }

    animate() {
        if (!this.active) return;

        const elapsed = Date.now() - this.startTime;
        const progress = (elapsed % this.cycleDuration) / this.cycleDuration;

        const size = 50 + (Math.sin(progress * Math.PI * 2) * 40);
        this.circle.style.width = `${size}%`;
        this.circle.style.height = `${size}%`;
        this.circle.style.top = `${50 - size / 2}%`;
        this.circle.style.left = `${50 - size / 2}%`;

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    handleClick() {
        if (!this.active) return;
        this.active = false;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const success = this.checkSuccess();
        this.engine.end(success);
    }

    checkSuccess() {
        const elapsed = Date.now() - this.startTime;
        const progress = (elapsed % this.cycleDuration) / this.cycleDuration;

        const size = 50 + (Math.sin(progress * Math.PI * 2) * 40);
        const circleTop = 50 - size / 2;
        const circleBottom = 50 + size / 2;

        const greenZoneTop = 50 - this.greenZoneSize / 2;
        const greenZoneBottom = 50 + this.greenZoneSize / 2;

        const overlapTop = Math.max(circleTop, greenZoneTop);
        const overlapBottom = Math.min(circleBottom, greenZoneBottom);
        const overlapSize = Math.max(0, overlapBottom - overlapTop);

        const overlapPercentage = (overlapSize / size) * 100;

        if (this.engine.ballType === 'masterball') {
            return true;
        }

        const thresholds = {
            masterball: 0,
            ultraball: 40,
            superball: 55,
            pokeball: 70
        };

        const threshold = thresholds[this.engine.ballType] || 70;
        return overlapPercentage >= threshold;
    }

    cleanup() {
        this.active = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}
