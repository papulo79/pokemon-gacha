# PokéJourney - Documentación del Proyecto para Agentes

Este archivo contiene la información técnica, de diseño y funcional necesaria para que cualquier agente de IA comprenda y colabore en el proyecto **PokéJourney**.

## 🎯 Objetivo del Proyecto
Crear un juego de gacha/coleccionismo basado en la **PokeAPI**, donde el usuario encuentra Pokémon aleatorios, gestiona un inventario de Poké Balls y expande su colección con elementos de progresión y rareza (Shiny).

## 🛠️ Stack Tecnológico
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **API Externa**: [PokeAPI](https://pokeapi.co/) (Endpoints de `/pokemon` y `/pokemon-species`).
- **Persistencia**: `localStorage` (Clave: `pokeCollection`).
- **Estilo**: Diseño moderno y oscuro (Glassmorphism), tipografía "Outfit" y animaciones CSS personalizadas.

## 🕹️ Mecánicas del Juego

### 1. Sistema de Encuentros
- Aparecen **3 Pokémon aleatorios** simultáneamente.
- Cada Pokémon muestra su nombre, ratio de captura base y si es **"NUEVO"** (si no está en la colección).
- Al capturar uno, se generan otros 3 aleatorios.

### 2. Inventario de Poké Balls
Existen 4 tipos de bolas con diferentes multiplicadores de éxito:
| Tipo | Poder | Descripción |
| :--- | :--- | :--- |
| Poké Ball | 1.0 | Bola estándar. |
| Super Ball | 1.5 | Mayor efectividad. |
| Ultra Ball | 2.0 | Alta probabilidad de éxito. |
| Master Ball| 255 | Captura garantizada. |

### 3. Lógica de Captura (Minijuegos)
La captura ya no es automática por probabilidad. En su lugar, se activa un **sistema de minijuegos** gestionado por `MinigameEngine`:
- **Timing Circle**: Precisión con círculos.
- **QTE**: Secuencias de botones (flechas).
- **Dificultad**: La Poké Ball y el nivel del Pokémon determinan el tiempo disponible y la complejidad del minijuego.
- **Master Ball**: Mantiene su efecto de captura automática (el minijuego se completa exitosamente al primer clic/tecla).

### 4. Sistema de Recompensas
Tras cada captura exitosa:
- Se otorgan entre **1 y 3 Poké Balls** adicionales.
- Existe una probabilidad de "mejora":
  - 10% de recibir una **Master Ball**.
  - 20% de recibir una **Ultra Ball**.
  - 30% de recibir una **Super Ball**.

### 5. Probabilidad Shiny
- **Encuentro Normal**: 1% de probabilidad de ser Shiny.
- **Encuentro con Pokémon ya capturado**: La probabilidad aumenta al **15%** para incentivar la repetición y el coleccionismo de versiones especiales.

## 📂 Estructura de Archivos
- `index.html`: Estructura del DOM, contenedores de inventario, y scripts base.
- `public/js/minigames/`: Motor (`engine.js`) y mecánicas individuales.
- `public/css/minigames.css`: Estilos del modal y mecánicas de captura.
- `script.js`: Lógica central, `GAME_STATE`, y comunicación con la API.

## 📝 Reglas de Interacción para Agentes
- **Preservar el Estado**: No modificar la estructura de `GAME_STATE` sin actualizar la lógica de guardado en `localStorage`.
- **Aesthetics First**: Cualquier cambio en la UI debe mantener la estética premium y oscura.
- **PokeAPI Friendly**: Minimizar las llamadas a la API mediante la obtención paralela de datos.

---
*Última actualización: enero 2026*
