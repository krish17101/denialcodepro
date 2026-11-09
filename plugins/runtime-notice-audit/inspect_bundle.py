"""Read packed Netlify functions; never extract or alter them. Not legal clearance."""
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path, PurePosixPath

LIMIT = 512 * 1024 * 1024
NOTICE = re.compile(r'^(licen[sc]es?|notices?|copying)(?:$|[._-])', re.I)

def inspect_archive(archive):
    archive = Path(archive)
    if archive.stat().st_size > LIMIT:
        raise ValueError('Archive exceeds audit limit')
    with zipfile.ZipFile(archive) as z:
        entries = [i for i in z.infolist() if not i.is_dir()]
        names = [i.filename for i in entries]
        if len(set(names)) != len(names):
            raise ValueError('Duplicate archive entry')
        for i in entries:
            p = PurePosixPath(i.filename)
            if p.is_absolute() or '..' in p.parts or '\\' in i.filename or i.flag_bits & 1:
                raise ValueError('Unsupported archive entry')
        if sum(i.file_size for i in entries) > LIMIT:
            raise ValueError('Expanded archive exceeds audit limit')
        manifests, notices, digest_rows = [], [], []
        for i in sorted(entries, key=lambda x: x.filename):
            data = z.read(i)  # verifies ZIP CRC; no file is extracted
            digest_rows.append([i.filename, hashlib.sha256(data).hexdigest()])
            if NOTICE.match(PurePosixPath(i.filename).name):
                notices.append(i.filename)
            if PurePosixPath(i.filename).name == 'package.json':
                if len(data) > 2 * 1024 * 1024:
                    raise ValueError('Oversized package manifest')
                m = json.loads(data)
                name, version = m.get('name'), m.get('version')
                if not isinstance(name, str) or not isinstance(version, str):
                    continue  # marker manifests are counted separately by total entries
                if len(name) > 214 or len(version) > 128:
                    raise ValueError('Unsupported package identity')
                declared = m.get('license')
                manifests.append({'name': name, 'version': version,
                    'declared_license': declared if isinstance(declared, str) and len(declared) < 256 else None,
                    'directory': str(PurePosixPath(i.filename).parent)})
        packages = []
        for m in manifests:
            own = [n for n in notices if str(PurePosixPath(n).parent) == m['directory']]
            packages.append({**m, 'root_notice_files': own})
        return {'archive': archive.name,
            'archive_sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
            'files': len(entries), 'expanded_bytes': sum(i.file_size for i in entries),
            'file_manifest_sha256': hashlib.sha256(json.dumps(digest_rows, separators=(',', ':')).encode()).hexdigest(),
            'packages': packages, 'notice_file_count': len(notices),
            'scope': 'ZIP inventory and CRC verification; package declarations and notice presence are not legal clearance'}

def inspect_directory(directory):
    p = Path(directory)
    if not p.is_dir():
        raise ValueError('Functions output directory missing')
    archives = sorted(p.rglob('*.zip'))
    if not archives:
        raise ValueError('No packed function ZIP available')
    return {'schema': 1, 'bundles': [inspect_archive(a) for a in archives]}

if __name__ == '__main__':
    print(json.dumps(inspect_directory(sys.argv[1]), separators=(',', ':')))
