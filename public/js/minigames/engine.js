class MinigameEngine {
    constructor() {
        this.activeMinigame = null;
        this.modal = null;
        this.pokemon = null;
        this.ballType = null;
        this.onSuccess = null;
        this.onFail = null;
        this.initModal();
    }

    initModal() {
        const modal = document.createElement('div');
        modal.id = 'minigame-modal';
        modal.className = 'minigame-modal';
        modal.innerHTML = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <div class="pokemon-info">
                        <h2 id="minigame-pokemon-name"></h2>
                        <span id="minigame-pokemon-level"></span>
                    </div>
                    <div class="ball-display">
                        <img id="minigame-ball-sprite" src="">
                    </div>
                </div>
                <div class="pokemon-display">
                    <img id="minigame-pokemon-sprite" src="">
                </div>
                <div class="minigame-area" id="minigame-area"></div>
                <div class="minigame-timer">
                    <div class="timer-bar">
                        <div class="timer-fill" id="timer-fill"></div>
                    </div>
                    <span class="timer-text" id="timer-text"></span>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.modal = modal;
    }

    start(pokemon, ballType, onSuccess, onFail) {
        this.pokemon = pokemon;
        this.ballType = ballType;
        this.onSuccess = onSuccess;
        this.onFail = onFail;

        this.setupUI();
        this.showModal();
    }

    setupUI() {
        const pokemonName = document.getElementById('minigame-pokemon-name');
        const pokemonLevel = document.getElementById('minigame-pokemon-level');
        const pokemonSprite = document.getElementById('minigame-pokemon-sprite');
        const ballSprite = document.getElementById('minigame-ball-sprite');

        pokemonName.textContent = this.pokemon.name;
        pokemonLevel.textContent = `Nivel ${this.pokemon.level}`;
        
        const sprite = this.pokemon.isShiny ? this.pokemon.shinySprite : this.pokemon.sprite;
        pokemonSprite.src = sprite;
        if (this.pokemon.isShiny) {
            pokemonSprite.classList.add('shiny-effect');
        } else {
            pokemonSprite.classList.remove('shiny-effect');
        }

        ballSprite.src = BALL_SPRITES[this.ballType];
    }

    showModal() {
        this.modal.style.display = 'flex';
        this.modal.classList.add('fade-in');
    }

    hideModal() {
        this.modal.style.display = 'none';
        this.modal.classList.remove('fade-in');
    }

    setTimer(seconds) {
        const fill = document.getElementById('timer-fill');
        const text = document.getElementById('timer-text');
        let remaining = seconds;

        const interval = setInterval(() => {
            const percentage = (remaining / seconds) * 100;
            fill.style.width = `${percentage}%`;
            text.textContent = `${remaining.toFixed(1)}s`;

            remaining -= 0.1;

            if (remaining <= 0) {
                clearInterval(interval);
                text.textContent = '0.0s';
                this.onTimeOut();
            }
        }, 100);

        return interval;
    }

    onTimeOut() {
        this.end(false);
    }

    end(success) {
        this.hideModal();
        if (success) {
            this.onSuccess();
        } else {
            this.onFail();
        }
    }
}
