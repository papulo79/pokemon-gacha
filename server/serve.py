import http.server
import socketserver
import os

PORT = 9026
Handler = http.server.SimpleHTTPRequestHandler

class ReusableTCPServer(socketserver.TCPServer):
    """Permite reutilizar el puerto inmediatamente después de cerrar el servidor."""
    allow_reuse_address = True

def run_server():
    # Cambia al directorio public para servir los archivos estáticos
    script_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(script_dir, '..', 'public')
    os.chdir(public_dir)
    
    # Escucha en todas las interfaces (0.0.0.0) para permitir acceso externo
    with ReusableTCPServer(("0.0.0.0", PORT), Handler) as httpd:
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
