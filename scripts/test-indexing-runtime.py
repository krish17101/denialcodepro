"""Regression check against an existing Next production build, without modifying it.

Run after each build: python3 scripts/test-indexing-runtime.py production|preview
Requires Node and the installed project dependencies. No hosted requests.
"""
import argparse
from contextlib import closing
from html.parser import HTMLParser
from pathlib import Path
import json
import os
import shutil
import socket
import subprocess
import tempfile
import time
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rules = []
        self.canonicals = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "meta" and a.get("name", "").lower() in {"robots", "googlebot"}:
            self.rules.extend(v.strip().lower() for v in a.get("content", "").split(","))
        if tag == "link" and a.get("rel") == "canonical":
            self.canonicals.append(a.get("href"))


def check(condition, reason):
    if not condition:
        raise RuntimeError(reason)


def run(mode, regenerate):
    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        build = work / ".next"
        shutil.copytree(ROOT / ".next", build, ignore=shutil.ignore_patterns("cache", "trace*"))
        for name in ("package.json", "next.config.js"):
            shutil.copy2(ROOT / name, work / name)
        for name in ("node_modules", "public"):
            (work / name).symlink_to((ROOT / name).resolve(), target_is_directory=True)
        policy = work / "lib/public/indexing.cjs"
        policy.parent.mkdir(parents=True)
        shutil.copy2(ROOT / "lib/public/indexing.cjs", policy)

        if regenerate:
            server = build / "server"
            stem = server / "app/index"
            meta = json.loads(stem.with_suffix(".meta").read_text())
            key = meta["routeCache"]["key"]
            check(key.startswith("/route-cache/APP_PAGE/"), "Cannot locate homepage cache key")
            for path in (stem, server / key.lstrip("/")):
                for suffix in (".html", ".rsc", ".meta"):
                    path.with_suffix(suffix).unlink(missing_ok=True)

        env = os.environ.copy()
        for name in ("NETLIFY", "CONTEXT", "NETLIFY_PREVIEW_SERVER", "VERCEL_ENV",
                     "VERCEL_TARGET_ENV", "DENIALCODEPRO_INDEXING_APPROVED"):
            env.pop(name, None)
        # Deliberately contradict the build decision at request time in both modes.
        if mode == "preview":
            env.update(NETLIFY="true", CONTEXT="production", DENIALCODEPRO_INDEXING_APPROVED="true")
        env.update(NODE_ENV="production", NEXT_TELEMETRY_DISABLED="1",
                   DCP_BUILD_INDEXABLE="no" if mode == "production" else "yes")
        with closing(socket.socket()) as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        proc = subprocess.Popen(["node", str(work / "node_modules/next/dist/bin/next"), "start",
                                 "--hostname", "127.0.0.1", "--port", str(port)],
                                cwd=work, env=env, stdout=subprocess.DEVNULL)
        try:
            for _ in range(100):
                check(proc.poll() is None, "Next server exited during startup")
                try:
                    with socket.create_connection(("127.0.0.1", port), timeout=.2):
                        break
                except OSError:
                    time.sleep(.1)
            else:
                raise RuntimeError("Next server did not start")
            for route in ("/", "/search?q=deadline"):
                with urlopen(f"http://127.0.0.1:{port}{route}", timeout=12) as resp:
                    html = resp.read().decode()
                    parsed = Metadata()
                    parsed.feed(html)
                    rules = set(parsed.rules)
                    check(resp.status == 200, f"{route}: HTTP {resp.status}")
                    for header in resp.headers.get_all("X-Robots-Tag", []):
                        rules.update(x.strip().lower() for x in header.split(","))
                    if route == "/":
                        check("Understand the response. Work out what to check next." in html and
                              any(u and u.rstrip("/") == "https://denialcodepro.com" for u in parsed.canonicals),
                              "Wrong homepage document")
                        cache = resp.headers.get("x-nextjs-cache")
                        check(cache == ("MISS" if regenerate else "HIT"), f"Unexpected cache: {cache}")
                    else:
                        cache = "dynamic search"
                    if route == "/" and mode == "production":
                        check("index" in rules and not rules & {"none", "noindex"}, f"{route}: {rules}")
                    else:
                        check("noindex" in rules and "index" not in rules, f"{route}: {rules}")
                    print(f"PASS {mode} {route} {cache}: {', '.join(sorted(rules))}")
        finally:
            proc.terminate()
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()
                proc.wait()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=("production", "preview"))
    mode = parser.parse_args().mode
    for fresh in (False, True):
        run(mode, fresh)
