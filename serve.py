import http.server
import socketserver
import webbrowser
import os

PORT = 9026
Handler = http.server.SimpleHTTPRequestHandler

def run_server():
    # Cambia al directorio del script para asegurar que sirve los archivos correctos
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Servidor iniciado en: http://localhost:{PORT}")
        print("Presiona Ctrl+C para detener el servidor.")
        
        # Opcional: Abre el navegador automáticamente
        webbrowser.open(f"http://localhost:{PORT}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nApagando el servidor...")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()
