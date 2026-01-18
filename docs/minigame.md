# Minijuego de Captura - PokéJourney

## 🎯 Objetivo Principal
Reemplazar el sistema de captura basado en probabilidad por un **minijuego interactivo** donde el usuario debe completar una mecánica para atrapar al Pokémon.

## ✅ Estado Actual
**IMPLEMENTADO** - Motor de minijuegos funcionando con dos mecánicas activas:
- **Timing Circle**: Un círculo que oscila y requiere precisión.
- **QTE (Quick Time Event)**: Secuencias de flechas (Teclado + Móvil).

## 🏛️ Arquitectura del Sistema

El sistema utiliza un **patrón de motor compartido** para garantizar consistencia visual:

1.  **MinigameEngine (engine.js)**: Gestiona el "marco" del juego.
    *   Crea y muestra el modal único.
    *   Muestra el nombre, nivel y **sprite centrado** del Pokémon.
    *   Controla el temporizador global y las barras de progreso.
    *   Expone el contenedor `#minigame-area` para que los minijuegos rendericen su lógica.

2.  **Mecánicas Específicas**: Clases independientes que se inyectan en el motor.
    *   `TimingCircleMinigame`: Lógica de animación del círculo y colisión.
    *   `QTEMinigame`: Lógica de secuencias de teclas y botones táctiles.

---

## 🚀 Cómo Implementar un Nuevo Minijuego

El sistema es 100% extensible. Para añadir una nueva mecánica (ej. "Opción D: Click Precision"):

### 1. Crear la Clase de la Mecánica
Crea un archivo en `public/js/minigames/your-game.js`:

```javascript
class YourNewMinigame {
    constructor(engine) {
        this.engine = engine; // Acceso al motor para timer y UI base
    }

    start(pokemon, ballType, onSuccess, onFail) {
        // 1. Iniciar el motor (abre el modal y configura el Pokemon)
        this.engine.start(pokemon, ballType, onSuccess, onFail);
        
        // 2. Renderizar tu UI específica en el área de juego
        const area = document.getElementById('minigame-area');
        area.innerHTML = `<div>Tu mecánica aquí</div>`;
        
        // 3. Iniciar tu lógica (timer, animaciones, etc.)
        this.timer = this.engine.setTimer(10); // 10 segundos
    }

    end(success) {
        // Al terminar, llamar a engine.end(success)
        this.engine.end(success);
    }
}
```

### 2. Estilizar en CSS
Añade tus estilos en `public/css/minigames.css`. Usa el contenedor `.minigame-area` como base.

### 3. Registrar e Integrar
En `public/index.html`:
```html
<script src="js/minigames/your-game.js"></script>
```

En `public/js/script.js`:
```javascript
const yourNewMinigame = new YourNewMinigame(minigameEngine);

// En attemptCapture, añade tu juego a la rotación o selección
const minigames = [timingCircleMinigame, qteMinigame, yourNewMinigame];
const activeMinigame = minigames[Math.floor(Math.random() * minigames.length)];
```

---

## 🎮 Mecánicas Implementadas

### ✅ Opción A: Timing Circle
Un círculo que se expande y contrae. El usuario debe hacer clic cuando el círculo coincida con la zona verde.
- **Dificultad**: Escala el tamaño de la zona verde y la tolerancia del "Perfecto".

### ✅ Opción B: QTE (Quick Time Event)
Secuencia de flechas aleatorias. Soporte para teclado y botones en pantalla para móviles.
- **Dificultad**: Escala la longitud de la secuencia (3 a 8 teclas) y el tiempo disponible.

## 📊 Balance de Dificultad (Base)

| Poké Ball | Timer (Base) | Multiplicador de Ventaja |
|------------|--------------|-------------------------|
| Master Ball | 15s | Captura Automática |
| Ultra Ball | 12s | Zona amplia / Secuencia corta |
| Super Ball | 10s | Zona media / Secuencia media |
| Poké Ball | 8s | Zona pequeña / Secuencia larga |

---

## 📝 Historial de Cambios

- **18 enero 2026**: Implementación de **QTE** con soporte móvil.
- **18 enero 2026**: Refactorización a arquitectura de **Modal Único** en `MinigameEngine`.
- **17 enero 2026**: Primera versión con **Timing Circle**.

---
*Documento actualizado: 18 enero 2026*