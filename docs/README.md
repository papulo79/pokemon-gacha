# 🔴 PokéJourney - Captura y Colecciona

¡Bienvenido a **PokéJourney**! Un juego web donde puedes capturar Pokémon, gestionar tus Poké Balls y completar tu propia PokéDex utilizando datos reales de la [PokeAPI](https://pokeapi.co/).

## 🚀 Cómo Iniciar el Juego

Tienes dos formas principales de jugar:

### Opción 1: Usando Python (Recomendado)
He incluido un script para levantar un servidor local en el puerto **9026**:

1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta el siguiente comando:
   ```bash
   python3 serve.py
   ```
3. El juego se abrirá automáticamente en tu navegador en `http://localhost:9026`.

### Opción 2: Abrir directamente el HTML
Puedes simplemente hacer doble clic en el archivo `index.html` para abrirlo en tu navegador favorito.

---

## 🎮 Mecánicas del Juego

- **Encuentros**: Siempre verás 3 Pokémon salvajes. ¡Cuidado con los legendarios, son más difíciles de atrapar!
- **Captura**: Selecciona el tipo de Poké Ball que quieras usar. Si tienes éxito, el Pokémon se añadirá a tu colección.
- **Premios**: Cada captura exitosa te otorga más Poké Balls y, con algo de suerte, podrías recibir una **Super Ball**, **Ultra Ball** o incluso una **Master Ball**.
- **Shiny Hunting**: Si un Pokémon que ya tienes vuelve a aparecer, hay una **probabilidad del 15%** de que aparezca en su versión **✨ Shiny**. ¡Intenta coleccionarlos todos!
- **Colección**: Pulsa el botón **"Mi Colección"** para ver todos los Pokémon que has atrapado. ¡Tus datos se guardan en el navegador para que no pierdas tu progreso!

---

## 📁 Archivos Principales
- `index.html`: Estructura del juego.
- `script.js`: Toda la lógica de captura, inventario y API.
- `style.css`: El diseño moderno y oscuro del juego.
- `agents.md`: Documentación técnica detallada para que otros desarrolladores (o IAs) entiendan el código.
- `serve.py`: Script para ejecutar el servidor local.

---

## 🔧 Servicio Systemd

El juego está configurado como un servicio systemd (`pokejourney.service`) para que se inicie automáticamente al arrancar el sistema.

### Comandos de Gestión del Servicio

```bash
# Ver el estado del servicio
sudo systemctl status pokejourney.service

# Iniciar el servicio
sudo systemctl start pokejourney.service

# Detener el servicio
sudo systemctl stop pokejourney.service

# Reiniciar el servicio
sudo systemctl restart pokejourney.service

# Ver los logs del servicio en tiempo real
sudo journalctl -u pokejourney.service -f

# Habilitar/deshabilitar el inicio automático
sudo systemctl enable pokejourney.service
sudo systemctl disable pokejourney.service
```

### Configuración
- **Puerto:** 9026
- **Escucha:** En todas las interfaces (0.0.0.0)
- **Acceso:** `http://localhost:9026` (local) o `http://[tu-ip]:9026` (externo)
- **Firewall:** Puerto 9026 abierto

---
*¡Buena suerte, Entrenador!*
