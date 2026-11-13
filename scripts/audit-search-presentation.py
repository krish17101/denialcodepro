"""Check actual generated HTML (default) or anonymously served public pages (--live)."""
import argparse, json
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import urlopen
from xml.etree import ElementTree as ET

BASE = 'https://denialcodepro.com'
parser = argparse.ArgumentParser()
parser.add_argument('--live', action='store_true')
args = parser.parse_args()
if not __debug__: raise RuntimeError('Assertions must be enabled')
root = Path(__file__).resolve().parents[1] / '.next/server/app'

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta, self.links, self.graphs, self.h1 = {}, [], [], []
        self.canon, self.in_h1, self.js = [], False, None
    def handle_starttag(self, t, attrs):
        a = dict(attrs)
        if t == 'meta': self.meta[a.get('property', a.get('name'))] = a.get('content')
        if t == 'link' and a.get('rel') == 'canonical': self.canon.append(a.get('href'))
        if t == 'a': self.links.append(a.get('href'))
        if t == 'script' and a.get('type') == 'application/ld+json': self.js = []
        if t == 'h1': self.in_h1 = True
    def handle_data(self, s):
        if self.js is not None: self.js.append(s)
        if self.in_h1: self.h1.append(s)
    def handle_endtag(self, t):
        if t == 'h1': self.in_h1 = False
        if t == 'script' and self.js is not None:
            self.graphs.append(json.loads(''.join(self.js))); self.js = None

def get(url):
    with urlopen(url, timeout=25) as r:
        assert r.status == 200 and r.geturl() == url, url
        return r.read().decode(), r.headers.get_all('X-Robots-Tag', [])

xml = get(BASE+'/sitemap.xml')[0] if args.live else (root/'sitemap.xml.body').read_text()
urls = [n.text for n in ET.fromstring(xml).findall('{*}url/{*}loc')]
assert len(set(urls)) == len(urls) and BASE+'/' in urls
def check(url):
    parts = urlsplit(url)
    assert parts.scheme == 'https' and parts.netloc == 'denialcodepro.com' and not parts.query, url
    path = parts.path
    html, headers = get(url) if args.live else ((root/((path.strip('/') or 'index')+'.html')).read_text(), [])
    p = Page(); p.feed(html); m = p.meta
    # Next serializes the apex without a slash. Both strings denote the same root URL.
    allowed = {url, BASE} if path == '/' else {url}
    assert len(p.canon) == 1 and p.canon[0] in allowed and m['og:url'] in allowed, (url, 'canonical/share URL')
    assert m['og:description'] == m['description'] == m['twitter:description'] and m['description']
    assert m['og:title'] == m['twitter:title'] and m['og:title'].count('DenialCodePro') == 1
    if args.live: assert not any('noindex' in x.lower() or x.lower().strip() == 'none' for x in [m.get('robots',''),m.get('googlebot',''),*headers]), (url, 'not indexable')
    if path == '/':
        site, = p.graphs
        assert site['@type'] == 'WebSite' and site['name'] == 'DenialCodePro' and site['url'] == url
    if path.startswith('/guides/'):
        graph, = p.graphs
        article, crumbs = graph['@graph']
        assert m['og:type'] == 'article' and article['@type'] == 'Article'
        assert article['headline'] == ''.join(p.h1) and article['mainEntityOfPage'] == url
        assert article['citation'] and all(u in p.links for u in article['citation'])
        assert article['description'] == m['description'] and article['author']['name'] == 'DenialCodePro'
        trail = crumbs['itemListElement']
        assert crumbs['@type'] == 'BreadcrumbList' and [i['position'] for i in trail] == [1,2,3]
        assert [i['item'] for i in trail] == [BASE+'/',BASE+'/guides',url]
        assert '/guides' in p.links and '/' in p.links and '/methodology' in p.links
    return path
with ThreadPoolExecutor(5) as pool:
    results = list(pool.map(check, urls))
print(json.dumps({'passed':len(results),'guide_articles':sum(p.startswith('/guides/') for p in results),'live':args.live,'paths':results}))
