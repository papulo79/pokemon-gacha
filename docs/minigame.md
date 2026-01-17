 # Minijuego de Captura - PokéJourney

## 🎯 Objetivo Principal
Reemplazar el sistema de captura basado en probabilidad por un **minijuego interactivo** donde el usuario debe completar una mecánica para atrapar al Pokémon.

## 📋 Requisitos Funcionales

### 1. Activación del Minijuego
- Se activa cuando el usuario selecciona una Poké Ball y hace clic en un Pokémon
- El minijuego aparece en un **modal/overlay** que cubre la pantalla
- Muestra el Pokémon seleccionado (sprite, nombre, nivel)

### 2. Mecánicas del Minijuego (Por Definir)
*[Aquí definiremos las mecánicas específicas]*

### 3. Factores que Afectan la Dificultad
- **Tipo de Poké Ball**: Master Ball debería ser automática o muy fácil
- **Nivel del Pokémon**: Pokémon de mayor nivel = más difícil
- **Ratio de captura base**: Pokémon con ratio bajo = más difícil
- **Shiny**: Posiblemente más difícil para mantener la exclusividad

### 4. Resultados Posibles
- **Captura exitosa**: Se añade a la colección, se dan recompensas
- **Fallo**: El Pokémon se escapa, se pierde la Poké Ball usada
- **Oportunidad múltiple**: ¿Tiradas múltiples o un solo intento?

## 💡 Ideas de Mecánicas (Brainstorming)

### Opción A: Timing Circle
- Un círculo que se contrae y expande
- El usuario debe hacer clic en el momento exacto cuando el círculo esté en una zona verde
- Diferentes Poké Balls tienen tamaños de zona verde diferentes

### Opción B: QTE (Quick Time Event)
- Secuencia de botones que aparecen en pantalla (arriba, abajo, izquierda, derecha)
- El usuario debe presionarlos en orden y tiempo
- Más niveles = más botones en la secuencia

### Opción C: Drag & Catch
- El usuario debe arrastrar la Poké Ball al Pokémon en movimiento
- El Pokémon se mueve aleatoriamente, velocidad según nivel
- Tienes X segundos para atraparlo

### Opción D: Click Precision
- Objetivos aparecen en el cuerpo del Pokémon
- El usuario debe hacer clic en ellos antes de que desaparezcan
- Aparecen más rápido según dificultad

### Opción E: Rhythm/Timing
- Barra de ritmo que se mueve
- Presionar espacio en el momento exacto
- Master Ball: ritmo lento, Poké Ball: ritmo rápido

## 🔧 Consideraciones Técnicas

### UI/UX
- Modal centrado que bloquea el juego principal
- Animaciones suaves de entrada/salida
- Feedback visual claro (éxito/fallo)
- Timer visible si aplica

### Estado del Juego
- Pausar el juego principal durante el minijuego
- Mantener el Pokémon seleccionado en memoria
- No modificar `GAME_STATE` hasta resultado final

### Persistencia
- El minijuego no requiere persistencia (es temporal)
- Solo se guarda el resultado final (captura o fallo)

## 📊 Balance de Dificultad (Por Definir)

| Factor | Fácil | Medio | Difícil |
|--------|-------|-------|---------|
| Master Ball | Automático | - | - |
| Ultra Ball | - | - | - |
| Super Ball | - | - | - |
| Poké Ball | - | - | - |

## 🎨 Elementos Visuales Necesarios
- Modal overlay oscuro
- Sprite del Pokémon grande
- UI del minijuego (según mecánica elegida)
- Animaciones de la Poké Ball lanzándose
- Partículas/confeti para captura exitosa
- Animación de escape para fallo

## 🚀 Pasos de Implementación (Propuesto)

1. **Fase 1**: Definir mecánica exacta del minijuego
2. **Fase 2**: Crear estructura HTML del modal
3. **Fase 3**: Implementar lógica del minijuego en JS
4. **Fase 4**: Añadir estilos CSS
5. **Fase 5**: Integrar con sistema de captura existente
6. **Fase 6**: Balance de dificultades
7. **Fase 7**: Testing y pulido

## ❓ Preguntas por Resolver

1. **¿Cuál mecánica prefieres?** (Opciones A-E o sugerencia propia)
Quiero un motor que permita ir añadiendo mecánicas diferentes.
Comenzaremos por la opción A.
2. **¿Un solo intento o múltiples oportunidades?**
Solo un intento.
3. **¿Timer o sin límite de tiempo?**
Con límite de tiempo, que esté relacionado con la dificultad de la captura.
4. **¿El usuario puede usar diferentes Poké Balls durante el minijuego?**
No, la Poké Ball se elige al inicio y definirá el nivel de dificultad del minijuego.
5. **¿Animación de lanzamiento de la bola?**
Sí, con una animación suave y agradable al usuario.
6. **¿Partículas para captura exitosa?**
Sí, con una animación suave y agradable al usuario.
---
*Documento creado para planificación del minijuego de captura*
*Última actualización: 17 enero 2026*