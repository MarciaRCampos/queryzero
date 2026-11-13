"""Gera o index.html (arquivo único) a partir de dev.html, js/, css/ e audio/vozes/*.mp3.
Uso: python3 tools/build.py   (rodar na raiz do repositório)"""
import re, base64, os, json, sys
root = sys.argv[1] if len(sys.argv) > 1 else '.'
html = open(f'{root}/dev.html', encoding='utf-8').read()
html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">',
              lambda m: '<style>\n' + open(f"{root}/{m.group(1)}", encoding='utf-8').read() + '\n</style>', html)
voices = {f[:-4]: 'data:audio/mpeg;base64,' + base64.b64encode(open(f'{root}/audio/vozes/{f}', 'rb').read()).decode()
          for f in sorted(os.listdir(f'{root}/audio/vozes')) if f.endswith('.mp3')}
html = re.sub(r'<script src="(js/[^"]+)"></script>',
              lambda m: '<script>\n' + open(f"{root}/{m.group(1)}", encoding='utf-8').read().replace('</script', '<\\/script') + '\n</script>', html)
html = html.replace('<!-- Scripts da Aplicação -->', '<!-- Scripts da Aplicação -->\n<script>\nwindow.VOICE_DATA = ' + json.dumps(voices) + ';\n</script>\n', 1)
assert 'src="js/' not in html and 'href="css/' not in html
open(f'{root}/index.html', 'w', encoding='utf-8').write(html)
print(f'index.html: {len(html) / 1e6:.2f} MB, {len(voices)} vozes')
