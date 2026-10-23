"""
Static file server for VisualAlgo that disables browser caching.

Run this INSTEAD of `python -m http.server`:

    python serve.py           # serves on http://localhost:5180/
    python serve.py 8000      # or pick another port

Every response is sent with no-cache headers, so the browser always fetches
the latest CSS/JS — you never have to hard-refresh or fight a stale cache.
"""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5180
    print(f"VisualAlgo (no-cache) server running at http://localhost:{port}/")
    print("Press Ctrl+C to stop.")
    HTTPServer(("", port), NoCacheHandler).serve_forever()
