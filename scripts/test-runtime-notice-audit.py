import hashlib
import importlib.util
import json
import tempfile
import unittest
import warnings
import zipfile
from pathlib import Path

module_path = Path(__file__).resolve().parents[1] / 'plugins/runtime-notice-audit/inspect_bundle.py'
spec = importlib.util.spec_from_file_location('audit', module_path)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

class BundleAuditTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
    def tearDown(self):
        self.temp.cleanup()
    def make(self, entries):
        p = self.root / 'handler.zip'
        with warnings.catch_warnings():
            warnings.simplefilter('ignore', UserWarning)
            with zipfile.ZipFile(p, 'w', zipfile.ZIP_DEFLATED) as z:
                for name, data in entries:
                    z.writestr(name, data)
        return p
    def test_inventory_and_no_mutation(self):
        p = self.make([('node_modules/example/package.json', json.dumps({'name':'example','version':'1.0.0','license':'MIT','secret':'MUST_NOT_PRINT'})),('node_modules/example/LICENSE','license text'),('index.js','export default 1')])
        before = p.read_bytes()
        r = audit.inspect_directory(self.root)
        b = r['bundles'][0]
        self.assertEqual(b['archive_sha256'], hashlib.sha256(before).hexdigest())
        self.assertEqual(b['files'], 3)
        self.assertEqual(b['notice_file_count'], 1)
        self.assertEqual(b['packages'][0]['root_notice_files'], ['node_modules/example/LICENSE'])
        self.assertNotIn('MUST_NOT_PRINT', json.dumps(r))
        self.assertEqual(before, p.read_bytes())
        self.assertEqual(list(self.root.iterdir()), [p])
    def test_missing_notice_is_not_cleared(self):
        p = self.make([('node_modules/example/package.json','{"name":"example","version":"1","license":"MIT"}')])
        self.assertEqual(audit.inspect_archive(p)['packages'][0]['root_notice_files'], [])
    def test_no_archive_fails(self):
        with self.assertRaises(ValueError): audit.inspect_directory(self.root)
    def test_traversal_fails(self):
        p = self.make([('../outside.txt','bad')])
        with self.assertRaises(ValueError): audit.inspect_archive(p)
    def test_duplicate_fails(self):
        p = self.make([('index.js','a'),('index.js','b')])
        with self.assertRaises(ValueError): audit.inspect_archive(p)
    def test_corruption_fails(self):
        p = self.root/'handler.zip'
        p.write_bytes(b'not a zip')
        with self.assertRaises(zipfile.BadZipFile): audit.inspect_archive(p)

if __name__ == '__main__': unittest.main(verbosity=2)
