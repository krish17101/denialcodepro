"""Static HTML audit. Does not claim browser/mobile or live HTTP validation."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json

root=Path(__file__).resolve().parents[1]
base=root/'.next/server/app'
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.links=[];self.h1=0;self.main=0;self.canonical=None;self.robots=None;self.title=False;self.in_title=False;self.title_text="";self.description=None
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if d.get('id'):self.ids.append(d['id'])
        if tag=='a' and d.get('href'):self.links.append(d['href'])
        if tag=='h1':self.h1+=1
        if tag=='main':self.main+=1
        if tag=='title':self.title=True;self.in_title=True
        if tag=='meta' and d.get('name')=='description':self.description=d.get('content','')
        if tag=='link' and d.get('rel')=='canonical':self.canonical=d.get('href')
        if tag=='meta' and d.get('name')=='robots':self.robots=d.get('content','')
    def handle_data(self,data):
        if self.in_title:self.title_text+=data
    def handle_endtag(self,tag):
        if tag=='title':self.in_title=False
pages={('/' if p.relative_to(base).as_posix()=='index.html' else '/'+p.relative_to(base).as_posix()[:-5]):p for p in base.rglob('*.html')}
known=set(pages)|{'/search'}
checks=0
titles=set()
descriptions=set()
for route,file in sorted(pages.items()):
    p=Page();p.feed(file.read_text())
    assert p.h1==1,(route,'h1',p.h1);assert p.main==1,(route,'main',p.main)
    assert 'main-content' in p.ids,(route,'skip target')
    assert len(p.ids)==len(set(p.ids)),(route,'duplicate IDs')
    assert p.title and p.robots and 'noindex' in p.robots,(route,'preview metadata')
    if route!='/_not-found':assert p.canonical=='https://denialcodepro.com'+('' if route=='/' else route) or (route=='/' and p.canonical=='https://denialcodepro.com/'),(route,p.canonical)
    if route!='/_not-found':
        assert p.title_text not in titles,(route,'duplicate title');titles.add(p.title_text)
        assert p.title_text.count('DenialCodePro')==1,(route,'site name repeated or absent',p.title_text)
        assert p.description and p.description not in descriptions,(route,'missing or duplicate description');descriptions.add(p.description)
    for href in p.links:
        u=urlsplit(href)
        if u.scheme or u.netloc:continue
        if u.path:assert unquote(u.path) in known,(route,'broken internal target',href)
        elif u.fragment:assert unquote(u.fragment) in p.ids,(route,'missing anchor',href)
    checks+=1;print('PASS',route,'headings, landmarks, IDs, internal links and metadata')
print(json.dumps({'pages_passed':checks,'failed':0,'scope':'All generated HTML pages. Dynamic search separately covered by server-rendered tests; no live HTTP or browser claims.'}))

robots=(base/'robots.txt.body').read_text()
assert 'Disallow: /search' not in robots,'Search noindex must remain crawlable'
from xml.etree import ElementTree as ET
sitemap=ET.fromstring((base/'sitemap.xml.body').read_text())
urls=[n.text for n in sitemap.findall('{*}url/{*}loc')]
expected={'https://denialcodepro.com'+('' if r=='/' else r) for r in pages if r!='/_not-found'}
assert {u.rstrip('/') for u in urls}==expected,'Sitemap differs from generated public pages'
assert len(urls)==len(set(urls)),'Duplicate sitemap URLs'
print('PASS robots/noindex compatibility and exact sitemap route coverage')
