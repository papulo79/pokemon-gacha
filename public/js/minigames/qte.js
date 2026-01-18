class QTEMinigame {
    constructor(engine) {
        this.engine = engine;
        this.sequence = [];
        this.currentIndex = 0;
        this.timer = null;
        this.isGameOver = false;

        this.keyMap = {
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→'
        };

        this.onKeyDown = this.handleKeyDown.bind(this);
    }

    start(pokemon, ballType, onSuccess, onFail) {
        this.isGameOver = false;
        this.currentIndex = 0;
        this.engine.start(pokemon, ballType, onSuccess, onFail);

        const difficulty = this.calculateDifficulty(pokemon, ballType);
        this.sequence = this.generateSequence(difficulty.length);

        this.setupMinigame();
        this.timer = this.engine.setTimer(difficulty.time);

        window.addEventListener('keydown', this.onKeyDown);
    }

    calculateDifficulty(pokemon, ballType) {
        let length = 4;
        let time = 8;

        // Ajustar longitud según Poké Ball
        if (ballType === 'pokeball') length = 6;
        if (ballType === 'superball') length = 5;
        if (ballType === 'ultraball') length = 4;
        if (ballType === 'masterball') {
            length = 3;
            time = 15;
        }

        // Ajustar según nivel del Pokémon
        if (pokemon.level > 20) length += 1;
        if (pokemon.level > 50) length += 1;

        // Ajustar tiempo (mínimo 4s)
        time = Math.max(4, time - (pokemon.level / 20));

        return { length, time };
    }

    generateSequence(length) {
        const keys = Object.keys(this.keyMap);
        const sequence = [];
        for (let i = 0; i < length; i++) {
            sequence.push(keys[Math.floor(Math.random() * keys.length)]);
        }
        return sequence;
    }

    setupMinigame() {
        const area = document.getElementById('minigame-area');

        const iconMap = {
            'ArrowUp': '<svg viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>',
            'ArrowDown': '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>',
            'ArrowLeft': '<svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
            'ArrowRight': '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
        };

        area.innerHTML = `
            <div class="qte-container">
                <p class="minigame-instruction">¡Presiona las teclas en orden!</p>
                <div class="qte-sequence">
                    <div class="qte-sequence-inner" id="qte-sequence-inner">
                        ${this.sequence.map((key, i) => `
                            <div class="qte-key" data-index="${i}" id="qte-key-${i}">
                                ${iconMap[key]}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="qte-controls">
                    <button class="qte-btn" data-key="ArrowLeft">${iconMap.ArrowLeft}</button>
                    <button class="qte-btn" data-key="ArrowUp">${iconMap.ArrowUp}</button>
                    <button class="qte-btn" data-key="ArrowDown">${iconMap.ArrowDown}</button>
                    <button class="qte-btn" data-key="ArrowRight">${iconMap.ArrowRight}</button>
                </div>
            </div>
        `;

        console.log(`QTE: Generated sequence with ${this.sequence.length} keys:`, this.sequence);
        this.updateCarousel();

        area.querySelectorAll('.qte-btn').forEach(btn => {
            btn.onclick = () => this.handleInput(btn.dataset.key);
        });
    }

    handleKeyDown(e) {
        if (this.keyMap[e.key]) {
            e.preventDefault();
            this.handleInput(e.key);
        }
    }

    updateCarousel() {
        const inner = document.getElementById('qte-sequence-inner');
        const keys = document.querySelectorAll('.qte-key');

        const offset = -this.currentIndex * 75;
        inner.style.transform = `translateX(calc(50% - 30px + ${offset}px))`;

        keys.forEach((key, i) => {
            key.classList.remove('past', 'current', 'next', 'success');
            key.style.opacity = '';

            if (i < this.currentIndex) {
                key.classList.add('past', 'success');
            } else if (i === this.currentIndex) {
                key.classList.add('current');
            } else if (i === this.currentIndex + 1) {
                key.classList.add('next');
            } else {
                key.style.opacity = '0';
            }
        });
    }

    handleInput(key) {
        if (this.isGameOver) return;

        const expectedKey = this.sequence[this.currentIndex];

        console.log(`QTE: key=${key}, expected=${expectedKey}, index=${this.currentIndex}/${this.sequence.length}`);

        if (key === expectedKey) {
            this.currentIndex++;
            console.log(`QTE: Correct! New index=${this.currentIndex}`);

            if (this.currentIndex >= this.sequence.length) {
                console.log(`QTE: Sequence complete! Calling end(true)`);
                this.end(true);
            } else {
                this.updateCarousel();
            }
        } else {
            console.log(`QTE: Wrong! Calling end(false)`);
            const currentKeyElement = document.getElementById(`qte-key-${this.currentIndex}`);
            currentKeyElement.classList.add('fail');
            this.end(false);
        }
    }

    end(success) {
        console.log(`QTE: end() called with success=${success}`);
        this.isGameOver = true;
        clearInterval(this.timer);
        window.removeEventListener('keydown', this.onKeyDown);

        const area = document.getElementById('minigame-area');
        area.classList.add(success ? 'minigame-success' : 'minigame-fail');

        setTimeout(() => {
            console.log(`QTE: About to call engine.end(${success})`);
            area.classList.remove('minigame-success', 'minigame-fail');
            this.engine.end(success);
        }, 800);
    }
}
