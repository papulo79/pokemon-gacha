# Minijuego de Captura - PokéJourney

## 🎯 Objetivo Principal
Reemplazar el sistema de captura basado en probabilidad por un **minijuego interactivo** donde el usuario debe completar una mecánica para atrapar al Pokémon.

## ✅ Estado Actual
**IMPLEMENTADO** - Motor de minijuegos funcionando con primera mecánica (Timing Circle)

## 📁 Archivos del Sistema de Minijuegos

```
public/
├── css/
│   └── minigames.css          # Estilos específicos para minijuegos
├── js/
│   └── minigames/
│       ├── engine.js          # Motor base de minijuegos
│       └── timing-circle.js    # Implementación Timing Circle
└── index.html                  # Incluye scripts del sistema

js/
└── script.js                   # Integración con sistema de captura
```

## 🔧 Motor de Minijuegos (engine.js)

### Clase MinigameEngine
Responsable de gestionar el modal del minijuego y el estado del juego.

#### Métodos Principales:
- `start(pokemon, ballType, onSuccess, onFail)` - Inicia el minijuego
- `setupUI()` - Configura el UI con datos del Pokémon y Poké Ball
- `setTimer(seconds)` - Inicia el timer visual
- `end(success)` - Finaliza el minijuego y ejecuta callback

#### Modal del Minijuego:
- Header: Nombre y nivel del Pokémon, sprite de la Poké Ball
- Display: Sprite grande del Pokémon (con efecto shiny si aplica)
- Área de juego: Contenedor dinámico para cada mecánica
- Timer: Barra de progreso y texto con tiempo restante

## 🎮 Timing Circle (timing-circle.js)

### Mecánica Implementada:
Un círculo que se expande y contrae. El usuario debe hacer clic cuando el círculo coincida con la zona verde.

### Factores de Dificultad:

#### Tamaño de la Zona Verde:
- **Master Ball**: 60% de base
- **Ultra Ball**: 40% de base
- **Super Ball**: 30% de base
- **Poké Ball**: 20% de base

Ajustado por:
- Nivel del Pokémon (mayor nivel = zona más pequeña)
- Ratio de captura (menor ratio = zona más pequeña)

#### Tiempo Límite:
- **Master Ball**: 15s de base
- **Ultra Ball**: 12s de base
- **Super Ball**: 10s de base
- **Poké Ball**: 8s de base

Ajustado por dificultad del Pokémon

### Umbral de Éxito:
El porcentaje de superposición del círculo con la zona verde debe ser:
- **Master Ball**: Automático (siempre éxito)
- **Ultra Ball**: ≥ 40%
- **Super Ball**: ≥ 55%
- **Poké Ball**: ≥ 70%

## 📊 Balance de Dificultad Implementado

| Poké Ball | Zona Verde (Base) | Timer (Base) | Umbral Éxito |
|------------|------------------|--------------|--------------|
| Master Ball | 60% | 15s | Automático |
| Ultra Ball | 40% | 12s | ≥ 40% |
| Super Ball | 30% | 10s | ≥ 55% |
| Poké Ball | 20% | 8s | ≥ 70% |

## 🎨 Elementos Visuales Implementados:
- ✅ Modal oscuro con backdrop blur
- ✅ Sprite grande del Pokémon (200px)
- ✅ Efecto shiny (brillo dorado + animación)
- ✅ Círculo animado que expande/contrae
- ✅ Zona verde clara con gradientes
- ✅ Timer con barra de progreso
- ✅ Animación de bounce en Poké Ball
- ✅ Animación fadeIn/scaleIn del modal
- ✅ Hover effects y active states
- ✅ Responsive design para móvil

## 🔄 Integración con el Juego Principal

### Flujo de Captura:
1. Usuario selecciona Poké Ball y Pokémon
2. `attemptCapture(ballType)` se ejecuta
3. Se descuenta la Poké Ball del inventario
4. Se inicia el minijuego con `timingCircleMinigame.start()`
5. Si éxito → `onMinigameSuccess(pokemon)` → `onCaptureSuccess()` → nuevo encuentro
6. Si fallo → `onMinigameFail()` → notificación de escape → checkInventory

## ❓ Preguntas por Resolver (Decisiones Tomadas)

1. **¿Cuál mecánica prefieres?** 
   ✅ Opción A: Timing Circle (IMPLEMENTADO)
   Motor preparado para añadir mecánicas adicionales

2. **¿Un solo intento o múltiples oportunidades?**
   ✅ Solo un intento

3. **¿Timer o sin límite de tiempo?**
   ✅ Con límite de tiempo, relacionado con la dificultad (5-15s según Poké Ball y Pokémon)

4. **¿El usuario puede usar diferentes Poké Balls durante el minijuego?**
   ✅ No, la Poké Ball se elige al inicio y define la dificultad

5. **¿Animación de lanzamiento de la bola?**
   ✅ Animación de bounce en la Poké Ball en el header

6. **¿Partículas para captura exitosa?**
   ✅ Confeti ya implementado en el sistema principal, se ejecuta tras captura

## 🚀 Pasos Siguientes (Mecánicas Futuras)

El motor está diseñado para ser extensible. Para añadir nuevas mecánicas:

1. Crear nueva clase que implemente la lógica
2. Usar `MinigameEngine.start()` para iniciar
3. Crear UI en `#minigame-area`
4. Implementar detección de éxito/fallo
5. Ejecutar `engine.end(true/false)` al terminar

### Ejemplo de Nueva Mecánica:
```javascript
class NewMinigame {
    constructor(engine) {
        this.engine = engine;
    }

    start(pokemon, ballType, onSuccess, onFail) {
        this.engine.start(pokemon, ballType, onSuccess, onFail);
        // Implementación específica
    }
}
```

---
*Documento actualizado: 17 enero 2026*
*Sistema de minijuegos implementado y funcional*