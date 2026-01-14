// PokeJourney Game Logic
const GAME_STATE = {
    inventory: JSON.parse(localStorage.getItem('pokeInventory')) || {
        pokeball: 10,
        superball: 0,
        ultraball: 0,
        masterball: 0
    },
    collection: JSON.parse(localStorage.getItem('pokeCollection')) || [],
    currentRunIds: JSON.parse(localStorage.getItem('pokeCurrentRun')) || [], // Persistir IDs del viaje
    currentEncounter: [],
    selectedPokemonIndex: 0
};

const BALL_POWER = {
    pokeball: 1,
    superball: 1.5,
    ultraball: 2,
    masterball: 255 // Siempre captura
};

const BALL_SPRITES = {
    pokeball: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    superball: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
    ultraball: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
    masterball: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png'
};

// --- API Service ---
async function fetchPokemon(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        const isAlreadyCaught = GAME_STATE.collection.some(p => p.id === data.id);

        // Si ya lo tenemos, hay una pequeña probabilidad (ej. 10%) de que aparezca Shiny
        // Si no lo tenemos, la probabilidad es la base (1%)
        let shinyChance = isAlreadyCaught ? 0.15 : 0.01;
        const isShiny = Math.random() < shinyChance;

        // Lógica de Niveles refinada
        const baseExp = data.base_experience || 50;
        let level = 5;

        if (speciesData.is_legendary || speciesData.is_mythical) {
            level = Math.floor(Math.random() * 20) + 50;
        } else if (baseExp < 100) {
            // Formas base o evoluciones tempranas (ej. Cascoon)
            level = Math.floor(Math.random() * 12) + 5;
        } else if (baseExp < 200) {
            level = Math.floor(Math.random() * 20) + 25;
        } else {
            level = Math.floor(Math.random() * 20) + 45;
        }

        return {
            id: data.id,
            name: data.name,
            sprite: data.sprites.other['official-artwork'].front_default,
            shinySprite: data.sprites.other['official-artwork'].front_shiny,
            captureRate: speciesData.capture_rate || 50,
            isShiny: isShiny,
            level: level
        };
    } catch (error) {
        console.error("Error fetching pokemon:", error);
    }
}

// --- Game Control ---
async function startNewEncounter() {
    const grid = document.getElementById('pokemon-grid');
    grid.innerHTML = '<div class="pokeball-loading">¡Buscando Pokémon...!</div>';

    const ids = new Set();
    while (ids.size < 3) {
        ids.add(Math.floor(Math.random() * 898) + 1);
    }

    const pokemons = await Promise.all(Array.from(ids).map(id => fetchPokemon(id)));

    GAME_STATE.currentEncounter = pokemons;
    GAME_STATE.selectedPokemonIndex = 0; // Seleccionar el primero por defecto
    renderEncounters();
    updateUI();
}

function selectPokemon(index) {
    GAME_STATE.selectedPokemonIndex = index;
    renderEncounters();
} function attemptCapture(ballType) {
    if (GAME_STATE.inventory[ballType] <= 0) return;

    const pokemonIndex = GAME_STATE.selectedPokemonIndex;
    const pokemon = GAME_STATE.currentEncounter[pokemonIndex];
    GAME_STATE.inventory[ballType]--;

    // Animación de captura
    const cards = document.querySelectorAll('.pokemon-card');
    const card = cards[pokemonIndex];
    card.classList.add('shaking');

    // Deshabilitar botones durante la captura
    updateUI(true);

    setTimeout(() => {
        card.classList.remove('shaking');

        // Lógica de éxito: (BaseCaptureRate * BallModifier) / 255
        const successChance = (pokemon.captureRate * BALL_POWER[ballType]) / 255;
        const roll = Math.random();

        if (roll < successChance || ballType === 'masterball') {
            onCaptureSuccess(pokemon);
            startNewEncounter();
        } else {
            showNotification(`¡Rayos! ${pokemon.name} se escapó de la ${ballType}.`);
            updateUI();
            checkInventory();
        }
    }, 1500);
}

function checkInventory() {
    const totalBalls = Object.values(GAME_STATE.inventory).reduce((a, b) => a + b, 0);
    if (totalBalls === 0) {
        showGameOver();
    }
}

function showGameOver() {
    const overlay = document.getElementById('game-over-overlay');
    const stats = document.getElementById('run-stats');

    stats.innerText = `Has capturado ${GAME_STATE.currentRunIds.length} Pokémon en este viaje.`;
    overlay.style.display = 'flex';
    overlay.classList.add('fade-in');

    // ¡Lanzar Confeti!
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ffcb05', '#ff5350', '#2a75bb']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ffcb05', '#ff5350', '#2a75bb']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function restartGame() {
    // Resetear inventario y sesión de viaje
    GAME_STATE.inventory = {
        pokeball: 10,
        superball: 0,
        ultraball: 0,
        masterball: 0
    };
    GAME_STATE.currentRunIds = []; // Limpiar IDs del viaje actual

    // Ocultar overlay
    const overlay = document.getElementById('game-over-overlay');
    overlay.style.display = 'none';

    // Resetear encuentros
    startNewEncounter();
    saveGame(false);
    updateUI();
    showNotification("¡Un nuevo viaje comienza! Tienes 10 Poké Balls.");
}

function onCaptureSuccess(pokemon) {
    showNotification(`¡Felicidades! Capturaste a ${pokemon.name.toUpperCase()}!`);

    // Añadir al registro de la partida actual
    GAME_STATE.currentRunIds.push(pokemon.id);

    // Guardar en colección (si no existe, lo añadimos; si existe, se queda)
    const alreadyExists = GAME_STATE.collection.find(p => p.id === pokemon.id);
    if (!alreadyExists) {
        GAME_STATE.collection.push({
            ...pokemon,
            capturedAt: new Date().toISOString()
        });
    }

    // Guardar automáticamente tras cada captura
    saveGame(false);
    rewardBalls();
    updateUI();
}

function saveGame(showNotify = true) {
    localStorage.setItem('pokeCollection', JSON.stringify(GAME_STATE.collection));
    localStorage.setItem('pokeInventory', JSON.stringify(GAME_STATE.inventory));
    localStorage.setItem('pokeCurrentRun', JSON.stringify(GAME_STATE.currentRunIds));
    if (showNotify) {
        showNotification("¡Progreso guardado correctamente!");
    }
}

function rewardBalls() {
    GAME_STATE.inventory.pokeball += Math.floor(Math.random() * 3) + 1;

    // Suerte de dar una mejor ball
    const luck = Math.random();
    if (luck < 0.1) GAME_STATE.inventory.masterball++;
    else if (luck < 0.3) GAME_STATE.inventory.ultraball++;
    else if (luck < 0.6) GAME_STATE.inventory.superball++;
}

// --- UI Rendering ---
function renderEncounters() {
    const grid = document.getElementById('pokemon-grid');
    grid.innerHTML = '';

    GAME_STATE.currentEncounter.forEach((poke, index) => {
        const isAlreadyCaught = GAME_STATE.collection.some(p => p.id === poke.id);
        const isSelected = GAME_STATE.selectedPokemonIndex === index;
        const card = document.createElement('div');
        card.className = `pokemon-card ${!isAlreadyCaught ? 'new' : ''} ${isSelected ? 'selected' : ''}`;
        card.onclick = () => selectPokemon(index);

        card.innerHTML = `
            <img src="${poke.isShiny ? poke.shinySprite : poke.sprite}" class="${poke.isShiny ? 'shiny-effect' : ''}">
            <p class="pokemon-name">${poke.isShiny ? '✨ ' : ''}${poke.name}</p>
            <p class="pokemon-level">Nivel: ${poke.level}</p>
        `;
        grid.appendChild(card);
    });
}

function updateUI(isCapturing = false) {
    const invElement = document.getElementById('inventory');
    invElement.innerHTML = Object.entries(GAME_STATE.inventory).map(([ball, count]) => `
        <button class="ball-action ${count <= 0 || isCapturing ? 'disabled' : ''}" 
                onclick="attemptCapture('${ball}')" 
                ${count <= 0 || isCapturing ? 'disabled' : ''}>
            <img src="${BALL_SPRITES[ball]}">
            <div class="ball-info">
                <span class="count">${count}</span>
            </div>
        </button>
    `).join('');

    renderEncounters();
}

function showNotification(text) {
    const notif = document.getElementById('notifications');
    const div = document.createElement('div');
    div.className = 'notification';
    div.innerText = text;
    notif.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// Interfaz de Colección
document.getElementById('btn-collection').onclick = () => {
    const modal = document.getElementById('collection-modal');
    const list = document.getElementById('collection-list');
    list.innerHTML = '';

    // Ordenar colección para que los del viaje actual salgan primero (opcional)
    const sortedCollection = [...GAME_STATE.collection].sort((a, b) => {
        const aInRun = GAME_STATE.currentRunIds.includes(a.id);
        const bInRun = GAME_STATE.currentRunIds.includes(b.id);
        if (aInRun && !bInRun) return -1;
        if (!aInRun && bInRun) return 1;
        return 0;
    });

    sortedCollection.forEach(poke => {
        const isFromCurrentRun = GAME_STATE.currentRunIds.includes(poke.id);
        const item = document.createElement('div');
        item.className = `mini-card ${!isFromCurrentRun ? 'legacy' : ''}`;
        item.innerHTML = `
            <img src="${poke.sprite}">
            <p>${poke.name}</p>
        `;
        list.appendChild(item);
    });

    modal.style.display = 'block';
};

document.getElementById('btn-save').onclick = () => {
    saveGame(true);
};

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('collection-modal').style.display = 'none';
};

document.getElementById('btn-restart').onclick = () => {
    restartGame();
};

document.getElementById('btn-skip').onclick = () => {
    startNewEncounter();
    showNotification("¡Buscando nuevos Pokémon!");
};

// Init
startNewEncounter();
checkInventory();
