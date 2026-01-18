import http.server
import socketserver
import os
import time

PORT = 9026

class CacheControlHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        # Añadir headers de cache control
        if self.path.endswith(('.css', '.js')):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        elif self.path.endswith(('.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg')):
            # Para imágenes, cache más larga
            self.send_header('Cache-Control', 'public, max-age=86400')
        else:
            # Para HTML, cache corta
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        
        super().end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    """Permite reutilizar el puerto inmediatamente después de cerrar el servidor."""
    allow_reuse_address = True

def run_server():
    # Cambia al directorio public para servir los archivos estáticos
    script_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(script_dir, '..', 'public')
    os.chdir(public_dir)
    
    # Escucha en todas las interfaces (0.0.0.0) para permitir acceso externo
    with ReusableTCPServer(("0.0.0.0", PORT), CacheControlHandler) as httpd:
        print(f"\n🚀 Servidor PokeJourney iniciado!")
        print(f"📡 Local: http://localhost:{PORT}")
        print(f"🌍 Externo/Red: http://0.0.0.0:{PORT}")
        print("-" * 40)
        print("💡 Presiona Ctrl+C para detener el servidor.")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Deteniendo el servidor...")
            httpd.shutdown()
            print("✅ Servidor detenido correctamente. ¡Hasta pronto!")

if __name__ == "__main__":
    run_server()
