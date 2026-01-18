# QTE UI/UX Improvements - Plan de Implementación

## 🎯 Objetivo
Mejorar la experiencia de usuario del minijuego QTE mediante:
1. **Layout horizontal de botones**: Reducir el espacio vertical ocupado.
2. **Sistema de carrusel para la secuencia**: Mostrar máximo 3 teclas simultáneamente con animaciones de deslizamiento.

## 📐 Diseño Visual

### Esquema del Carrusel
```
┌─────────────────────────────────┐
│     [T]    [S]    [S]           │  T = Tecla pasada (opacity: 0.6)
│      ↑      ↑      ↑            │  S = Tecla actual (opacity: 1.0, destacada)
│    Past  Current Next           │  S = Siguiente tecla (opacity: 1.0)
│                                 │
│   ┌───┐  ┌───┐  ┌───┐  ┌───┐    │
│   │ ← │  │ ↑ │  │ ↓ │  │ → │    │  Botones en línea horizontal
│   └───┘  └───┘  └───┘  └───┘    │
└─────────────────────────────────┘
```

### Estados de las Teclas
- **Pasada** (izquierda): `opacity: 0.6`, `transform: scale(0.85)`
- **Actual** (centro): `opacity: 1.0`, `transform: scale(1.1)`, borde destacado
- **Siguiente** (derecha): `opacity: 0.6`, `transform: scale(0.85)`

## 🔧 Cambios Técnicos

### 1. CSS (`public/css/minigames.css`)

#### Carrusel de Secuencia
```css
.qte-sequence {
    width: 200px;
    height: 80px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.qte-sequence-inner {
    display: flex;
    gap: 15px;
    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.qte-key {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    /* ... estilos existentes ... */
}

.qte-key.past,
.qte-key.next {
    opacity: 0.6;
    transform: scale(0.85);
}

.qte-key.current {
    opacity: 1;
    transform: scale(1.1);
    border-color: var(--accent-yellow);
    box-shadow: 0 0 20px rgba(255, 203, 5, 0.6);
}
```

#### Botones Horizontales
```css
.qte-controls {
    display: flex;
    gap: 15px;
    justify-content: center;
    padding: 10px;
}

.qte-btn {
    /* Eliminar grid-area */
    /* ... estilos existentes ... */
}
```

### 2. JavaScript (`public/js/minigames/qte.js`)

#### Método `setupMinigame()`
```javascript
setupMinigame() {
    const area = document.getElementById('minigame-area');
    area.innerHTML = `
        <div class="qte-container">
            <p class="minigame-instruction">¡Presiona las teclas en orden!</p>
            <div class="qte-sequence">
                <div class="qte-sequence-inner" id="qte-sequence-inner">
                    ${this.sequence.map((key, i) => `
                        <div class="qte-key" data-index="${i}" id="qte-key-${i}">
                            ${this.keyMap[key]}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="qte-controls">
                <button class="qte-btn" data-key="ArrowLeft">←</button>
                <button class="qte-btn" data-key="ArrowUp">↑</button>
                <button class="qte-btn" data-key="ArrowDown">↓</button>
                <button class="qte-btn" data-key="ArrowRight">→</button>
            </div>
        </div>
    `;

    this.updateCarousel();
    
    // Event listeners...
}
```

#### Método `updateCarousel()`
```javascript
updateCarousel() {
    const inner = document.getElementById('qte-sequence-inner');
    const keys = document.querySelectorAll('.qte-key');
    
    // Calcular desplazamiento para centrar la tecla actual
    const offset = -this.currentIndex * 75; // 60px width + 15px gap
    inner.style.transform = `translateX(calc(50% - 30px + ${offset}px))`;
    
    // Aplicar clases según posición
    keys.forEach((key, i) => {
        key.classList.remove('past', 'current', 'next', 'success');
        
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
```

#### Actualizar `handleInput()`
```javascript
handleInput(key) {
    if (this.isGameOver) return;

    const expectedKey = this.sequence[this.currentIndex];

    if (key === expectedKey) {
        this.currentIndex++;
        this.updateCarousel(); // Animar el carrusel

        if (this.currentIndex >= this.sequence.length) {
            this.end(true);
        }
    } else {
        const currentKeyElement = document.getElementById(`qte-key-${this.currentIndex}`);
        currentKeyElement.classList.add('fail');
        this.end(false);
    }
}
```

## ✅ Checklist de Implementación

- [ ] Actualizar CSS para el carrusel
- [ ] Actualizar CSS para botones horizontales
- [ ] Implementar `updateCarousel()` en `qte.js`
- [ ] Modificar `setupMinigame()` con nueva estructura HTML
- [ ] Actualizar `handleInput()` para usar `updateCarousel()`
- [ ] Probar con secuencias de diferentes longitudes (3, 5, 8 teclas)
- [ ] Verificar animaciones de deslizamiento
- [ ] Verificar responsive en móvil

## 🎨 Mejoras Visuales Adicionales

- **Animación de entrada**: Las teclas pueden aparecer con un efecto de "fade in" desde la derecha.
- **Feedback táctil**: Los botones pueden tener un efecto de "ripple" al pulsarse.
- **Indicador de progreso**: Mostrar "X/Y" debajo del carrusel para indicar progreso.

---
*Documento creado: 18 enero 2026*
