// Preserve installed notices without assuming every installed tool ships to visitors.
const fs = require('node:fs'), path = require('node:path');
const root = path.join(__dirname, '..'); process.chdir(root);
const lock = JSON.parse(fs.readFileSync('package-lock.json'));
const groups = new Map(), rows = [];
function collect(dir,label,version,license) {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir,{withFileTypes:true}).filter(f=>f.isFile() && /^(licen[sc]es?|notice[s]?|copying|third[-_ ]party[-_ ]notices?)(?:$|[._-])/i.test(f.name) && !/\.(js|cjs|ts|json|map)$/.test(f.name)).map(f=>f.name).sort() : [];
  // Native libvips packages place their component attribution table in the README.
  if (/^node_modules\/@img\/sharp-libvips-/.test(dir) && fs.existsSync(path.join(dir,'README.md'))) files.push('README.md');
  for(const name of files) {
    const body=fs.readFileSync(path.join(dir,name),'utf8');
    if(body.includes('\u0000'))throw Error('Unexpected binary notice: '+dir+'/'+name);
    if(!groups.has(body))groups.set(body,[]);
    groups.get(body).push(label+' '+version+' / '+name);
  }
  rows.push({path:dir,version,declared:license||null,installed:fs.existsSync(dir),noticeFiles:files});
}
for(const [dir,meta] of Object.entries(lock.packages).sort(([a],[b])=>a.localeCompare(b))) {
  if(!dir)continue;
  collect(dir,dir.split('node_modules/').pop(),meta.version||'',meta.license || (fs.existsSync(path.join(dir,'package.json')) ? JSON.parse(fs.readFileSync(path.join(dir,'package.json'))).license : null));
}
const vend='node_modules/next/dist/compiled';
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true}))if(e.isDirectory())walk(path.join(dir,e.name));else if(e.name==='LICENSE')collect(dir,dir.slice(vend.length+1),'(bundled by Next.js)',null);}
walk(vend);
for(const dep of ['next','react','react-dom','lucide-react','styled-jsx','scheduler','tailwindcss'])if(!rows.find(r=>r.path==='node_modules/'+dep)?.noticeFiles.length)throw Error('Missing core notice: '+dep);
const font=fs.readFileSync('notices/Inter-OFL.txt','utf8');
// Release-specific upstream notices absent from @next/env's npm file list.
// A version change needs a fresh review, not reuse of a mismatched notice.
const envVersion=JSON.parse(fs.readFileSync('node_modules/@next/env/package.json','utf8')).version;
if(envVersion!=='15.5.28')throw Error('Review supplemental @next/env notices for version '+envVersion);
const envNotices=fs.readFileSync('notices/next-env-15.5.28.txt','utf8');
const nativePackages=rows.filter(r=>r.installed && /^node_modules\/@img\/sharp-libvips-/.test(r.path));
for(const r of nativePackages)if(r.version!=='1.3.4')throw Error('Review supplemental sharp-libvips notices for version '+r.version);
const nativeNotices=nativePackages.length ? [
 'GNU license documents accompanying the @img/sharp-libvips 1.3.4 native packages listed in the supplier notices below. These documents do not relicense DenialCodePro articles or unrelated application code.',
 fs.readFileSync('notices/LGPL-3.0-with-GPL-3.0.txt','utf8')
] : [];
fs.writeFileSync('public/third-party-notices.txt',[
 'DenialCodePro | Third-party notices',
 'Includes installed build tools and framework components as well as visitor-facing software. Inclusion does not imply endorsement or use on every page.',
 'Inter font — Google Fonts, ofl/inter/OFL.txt (source blob 21f6aff961064c2e429f570995e446bcdd555422)',font,
 envNotices,
 ...nativeNotices,
 ...Array.from(groups,([body,labels])=>[...new Set(labels)].join('\n')+'\n\n'+body)
].join('\n\n'));
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({records:rows.length,installed:rows.filter(r=>r.installed).length,installedWithoutRootNotice:rows.filter(r=>r.installed&&!r.noticeFiles.length).length,distinctNoticeTexts:groups.size}));
