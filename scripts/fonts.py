"""One-off font preparation (run locally; outputs are committed to src/fonts).
Requires: pip install fonttools brotli ; npm i (for @fontsource-variable sources)."""
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
import os
NM = 'node_modules/@fontsource-variable'
OUT = 'src/fonts'
LATIN = 'U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2032-2033,U+203A,U+2039,U+20AC,U+2122,U+2190-2193,U+2197,U+2212,U+00D7'
RUPEE = 'U+20B9'
jobs = [
  ('bricolage', f'{NM}/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2', LATIN, {'wdth': 86, 'wght': (500, 800)}),
  ('bricolage-rupee', f'{NM}/bricolage-grotesque/files/bricolage-grotesque-latin-ext-standard-normal.woff2', RUPEE, {'wdth': 86, 'wght': (500, 800)}),
  ('figtree', f'{NM}/figtree/files/figtree-latin-wght-normal.woff2', LATIN, None),
  ('figtree-rupee', f'{NM}/figtree/files/figtree-latin-ext-wght-normal.woff2', RUPEE, None),
]
for name, src, uni, limits in jobs:
    f = TTFont(src)
    if limits:
        f = instancer.instantiateVariableFont(f, limits)
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['kern', 'liga', 'calt', 'tnum', 'lnum', 'case', 'ss01']
    opts.name_IDs = ['*']; opts.notdef_outline = True
    s = subset.Subsetter(opts)
    s.populate(unicodes=subset.parse_unicodes(uni))
    s.subset(f)
    path = f'{OUT}/{name}.woff2'
    subset.save_font(f, path, opts)
    axes = [(a.axisTag, a.minValue, a.maxValue) for a in f['fvar'].axes] if 'fvar' in f else 'static'
    print(name, os.path.getsize(path), 'bytes', axes, 'has_rupee', 0x20B9 in f.getBestCmap())
