"""Exercise the release checker against local HTTP fixtures; no live-site claims."""
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import subprocess
import sys
import threading
import unittest

AUDITOR = Path(__file__).with_name('audit-release-http.py')


class ReleaseHTTPTests(unittest.TestCase):
    def audit(self, mode='preview', defect=None):
        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *_):
                pass

            def do_GET(self):
                route = self.path
                if defect in (301, 302, 307, 308) and route == '/code/1':
                    self.send_response(defect)
                    self.send_header('Location', '/guides/not-a-published-guide')
                    self.end_headers()
                    return
                status = 404 if route in ('/code/1', '/guides/not-a-published-guide') else 200
                if defect == 'soft404' and route == '/code/1':
                    status = 200
                blocked = mode == 'preview' or status == 404 or route.startswith('/search')
                if defect == 'missing_noindex' and route == '/':
                    blocked = False
                rules = 'noindex,follow' if blocked else 'index,follow'
                canonical = 'https://denialcodepro.com' + ('' if route == '/' else route)
                if defect == 'wrong_canonical' and route == '/contact':
                    canonical = 'https://example.com/contact'
                body = (f'<html><head><meta name="robots" content="{rules}">'
                        f'<link rel="canonical" href="{canonical}"></head><body>'
                        + ('This page is not available in this release' if status == 404 else 'Fixture')
                        + '</body></html>')
                self.send_response(status)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                if defect == 'header_blocks_production':
                    self.send_header('X-Robots-Tag', 'noindex')
                self.end_headers()
                self.wfile.write(body.encode())

        server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            return subprocess.run(
                [sys.executable, str(AUDITOR), '--base', f'http://127.0.0.1:{server.server_port}',
                 '--indexing', mode], capture_output=True, text=True, timeout=20)
        finally:
            server.shutdown()
            thread.join()
            server.server_close()

    def test_direct_preview_responses_pass(self):
        result = self.audit()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)['passed'], 6)

    def test_direct_production_responses_pass(self):
        result = self.audit('production')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)['passed'], 6)

    def reject_redirect(self, status):
        result = self.audit(defect=status)
        self.assertNotEqual(result.returncode, 0, f'Incorrectly accepted {status} redirect to a different 404 URL')
        self.assertIn('/code/1', result.stderr)

    def test_301_redirect_rejected(self): self.reject_redirect(301)
    def test_302_redirect_rejected(self): self.reject_redirect(302)
    def test_307_redirect_rejected(self): self.reject_redirect(307)
    def test_308_redirect_rejected(self): self.reject_redirect(308)

    def test_soft404_rejected(self):
        self.assertNotEqual(self.audit(defect='soft404').returncode, 0)

    def test_preview_missing_noindex_rejected(self):
        self.assertNotEqual(self.audit(defect='missing_noindex').returncode, 0)

    def test_wrong_canonical_rejected(self):
        self.assertNotEqual(self.audit(defect='wrong_canonical').returncode, 0)

    def test_production_blocking_header_rejected(self):
        self.assertNotEqual(self.audit('production', 'header_blocks_production').returncode, 0)


if __name__ == '__main__':
    unittest.main(verbosity=2)
