"""Read-only HTTP checks. Start the matching build first; no browser claims."""
import argparse,csv,json
from html.parser import HTMLParser
from urllib.request import build_opener, HTTPRedirectHandler
from urllib.error import HTTPError
from urllib.parse import urlsplit

parser=argparse.ArgumentParser()
parser.add_argument('--base',default='http://127.0.0.1:3017')
parser.add_argument('--indexing',choices=['preview','production'],required=True)
parser.add_argument('--legacy-map')
args=parser.parse_args()

class NoRedirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

# Validate the requested route's response, not a redirect destination's response.
# Apex/www and other intentional redirects require a separate explicit test.
http=build_opener(NoRedirects())

class Metadata(HTMLParser):
    def __init__(self):
        super().__init__();self.rules=[];self.canonicals=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag=='meta' and d.get('name','').lower() in ('robots','googlebot'):self.rules.append(d.get('content',''))
        if tag=='link' and d.get('rel')=='canonical':self.canonicals.append(d.get('href'))

cases={'/':200,'/contact':200,'/guides/build-a-deadline-evidence-record':200,
       '/search?q=deadline':200,'/code/1':404,'/guides/not-a-published-guide':404}
if args.legacy_map:
    with open(args.legacy_map,newline='') as f:
        for row in csv.DictReader(f):
            route=row['path']
            assert route.startswith('/') and not route.startswith('//') and not urlsplit(route).netloc,route
            cases[route]=int(row['proposed_response'])
results=[]
for route,expected in cases.items():
    try:
        response=http.open(args.base.rstrip('/')+route,timeout=15)
    except HTTPError as error:
        response=error
    with response:
        status=response.status;body=response.read().decode();headers=response.headers
    assert status==expected,(route,status,expected,'Location',headers.get('Location'))
    p=Metadata();p.feed(body)
    rules=p.rules+headers.get_all('X-Robots-Tag',[])
    tokens={t.strip().lower().split(':')[-1].strip() for rule in rules for t in rule.split(',')}
    must_block=args.indexing=='preview' or expected==404 or route.startswith('/search')
    blocked=bool(tokens.intersection({'noindex','none'}))
    assert blocked==must_block,(route,'indexing mismatch',rules)
    if expected==404:assert 'This page is not available in this release' in body,route
    elif not route.startswith('/search'):
        expected_url='https://denialcodepro.com'+('' if route=='/' else route)
        assert len(p.canonicals)==1 and p.canonicals[0].rstrip('/')==expected_url,(route,p.canonicals)
    results.append({'path':route,'status':status,'noindex':blocked})
print(json.dumps({'passed':len(results),'failed':0,'base':args.base,'mode':args.indexing,'results':results},indent=2))
