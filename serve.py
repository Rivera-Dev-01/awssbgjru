import json, os, re, http.server, socketserver, urllib.parse, socket

PORT = 8000


class ReuseAddrServer(socketserver.TCPServer):
    allow_reuse_address = True
    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        super().server_bind()

class RewriteHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        with open("vercel.json") as f:
            config = json.load(f)
        self.rewrites = []
        for route in config.get("routes", []):
            src = route.get("src", "")
            dest = route.get("dest", "")
            if dest and not src.startswith("/api/"):
                self.rewrites.append((re.compile(src), dest))
        super().__init__(*args, directory=".", **kwargs)

    def translate_path(self, path):
        path = self._apply_rewrites(path)
        return super().translate_path(path)

    def _apply_rewrites(self, path):
        path = urllib.parse.urlparse(path).path
        for pattern, dest in self.rewrites:
            m = pattern.fullmatch(path)
            if m:
                result = dest
                for idx, g in enumerate(m.groups(), 1):
                    result = result.replace(f"${idx}", g)
                print(f"  rewrite: {path} -> {result}")
                return result
        return path

if __name__ == "__main__":
    with ReuseAddrServer(("", PORT), RewriteHandler) as httpd:
        print(f"Server: http://localhost:{PORT}")
        print("Backend: run 'uvicorn backend.main:app' in another terminal")
        httpd.serve_forever()
