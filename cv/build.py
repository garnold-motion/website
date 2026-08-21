#!/usr/bin/env python3
"""
Builds cv.html with the headshot embedded as a data URI.

Keeping the image inline means cv.html is a single self-contained file — you
can move it anywhere, open it in Chrome and Cmd+P to PDF, and the photo always
comes with it. Re-run this only if you swap headshot.jpg.
"""
import base64
import pathlib

photo = base64.b64encode(pathlib.Path('headshot.jpg').read_bytes()).decode()
template = pathlib.Path('template.html').read_text()
pathlib.Path('cv.html').write_text(template.replace('{{PHOTO}}', photo))
print(f'cv.html written ({len(template) + len(photo):,} bytes)')
