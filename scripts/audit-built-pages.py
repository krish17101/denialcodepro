"""Static HTML audit. Does not claim browser/mobile or live HTTP validation."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json

root=Path(__file__).resolve().parents[1]
base=root/'.next/server/app'
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.links=[];self.h1=0;self.main=0;self.canonical=None;self.robots=None;self.title=False
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if d.get('id'):self.ids.append(d['id'])
        if tag=='a' and d.get('href'):self.links.append(d['href'])
        if tag=='h1':self.h1+=1
        if tag=='main':self.main+=1
        if tag=='title':self.title=True
        if tag=='link' and d.get('rel')=='canonical':self.canonical=d.get('href')
        if tag=='meta' and d.get('name')=='robots':self.robots=d.get('content','')
pages={('/' if p.relative_to(base).as_posix()=='index.html' else '/'+p.relative_to(base).as_posix()[:-5]):p for p in base.rglob('*.html')}
known=set(pages)|{'/search'}
checks=0
for route,file in sorted(pages.items()):
    p=Page();p.feed(file.read_text())
    assert p.h1==1,(route,'h1',p.h1);assert p.main==1,(route,'main',p.main)
    assert 'main-content' in p.ids,(route,'skip target')
    assert len(p.ids)==len(set(p.ids)),(route,'duplicate IDs')
    assert p.title and p.robots and 'noindex' in p.robots,(route,'preview metadata')
    if route!='/_not-found':assert p.canonical=='https://denialcodepro.com'+('' if route=='/' else route) or (route=='/' and p.canonical=='https://denialcodepro.com/'),(route,p.canonical)
    for href in p.links:
        u=urlsplit(href)
        if u.scheme or u.netloc:continue
        if u.path:assert unquote(u.path) in known,(route,'broken internal target',href)
        elif u.fragment:assert unquote(u.fragment) in p.ids,(route,'missing anchor',href)
    checks+=1;print('PASS',route,'headings, landmarks, IDs, internal links and metadata')
print(json.dumps({'pages_passed':checks,'failed':0,'scope':'All generated HTML pages. Dynamic search separately covered by server-rendered tests; no live HTTP or browser claims.'}))
