import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
SONGS_DIR = os.path.join(ROOT, 'songs')
AUDIO_EXTENSIONS = {'.mp3', '.m4a', '.wav'}


def discover_audio_files(root_dir):
    discovered = []
    for current_root, _, files in os.walk(root_dir):
        for filename in files:
            if os.path.splitext(filename)[1].lower() in AUDIO_EXTENSIONS:
                relative_path = os.path.relpath(
                    os.path.join(current_root, filename),
                    root_dir,
                )
                discovered.append(relative_path.replace(os.sep, '/'))
    return sorted(discovered)


class AudioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        parsed_path = urlparse(self.path)
        if parsed_path.path == '/api/audio':
            payload = json.dumps({'files': discover_audio_files(SONGS_DIR)}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        super().do_GET()


if __name__ == '__main__':
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', '80'))
    server = ThreadingHTTPServer((host, port), AudioHandler)
    print(f'Serving Birthday Playlist on http://127.0.0.1:{port}')
    server.serve_forever()
