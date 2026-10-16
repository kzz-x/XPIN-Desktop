"""
XPIN-Desktop · Standalone Single-File Packager
Bundles all modular CSS, JS, and demo assets into a self-contained index.html
that runs instantly when double-clicked locally via file:/// with ZERO CORS errors.
"""

import os
import sys
import base64
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def build_standalone():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    # 1. Read CSS
    css_path = os.path.join(repo_root, 'src', 'skin', 'macos.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        macos_css = f.read()

    # 2. Base64 encode demo image
    img_path = os.path.join(repo_root, 'assets', 'demo', 'logic_board_soc.jpg')
    with open(img_path, 'rb') as f:
        img_b64 = 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode('utf-8')

    # 3. Read JS files in dependency order
    files = [
        'src/core/interpolator.js',
        'src/core/timeline.js',
        'src/core/camera.js',
        'src/core/scene.js',
        'src/components/ComponentsRenderer.js',
        'src/main.js'
    ]

    bundle_parts = []
    for rel_path in files:
        full_path = os.path.join(repo_root, rel_path)
        with open(full_path, 'r', encoding='utf-8') as f:
            code = f.read()
            # Strip import and export statements
            code = re.sub(r'import\s+.*?from\s+[\'"].*?[\'"];?', '', code)
            code = re.sub(r'export\s+(const|class|function|let|var)\s+', r'\1 ', code)
            code = re.sub(r'export\s*\{[^}]*\};?', '', code)
            code = re.sub(r'export\s+default\s+.*?;?', '', code)
            
            # Embed the image data URI directly inside ComponentsRenderer if referenced
            if 'assets/demo/logic_board_soc.jpg' in code:
                code = code.replace('./assets/demo/logic_board_soc.jpg', img_b64)
                
            bundle_parts.append(f"// --- {rel_path} ---\n" + code)

    bundled_js = "(function() {\n" + "\n\n".join(bundle_parts) + "\n})();"

    # 4. Read HTML template
    template_path = os.path.join(repo_root, 'index.html')
    with open(template_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace <link rel="stylesheet" href="./src/skin/macos.css"> with inline <style>
    style_tag = f"<style>\n/* --- inlined macos.css --- */\n{macos_css}\n</style>"
    html = re.sub(r'<link\s+rel=[\'"]stylesheet[\'"]\s+href=[\'"].*?macos\.css[\'"]\s*/?>', style_tag, html)

    # Replace <script type="module" src="./src/main.js"></script> with bundled <script>
    script_tag = f"<script>\n{bundled_js}\n</script>"
    html = re.sub(r'<script\s+type=[\'"]module[\'"]\s+src=[\'"].*?main\.js[\'"]\s*></script>', script_tag, html)

    # Save to index.html directly
    with open(template_path, 'w', encoding='utf-8') as f:
        f.write(html)

    # Also save a copy to dist/standalone.html
    dist_dir = os.path.join(repo_root, 'dist')
    os.makedirs(dist_dir, exist_ok=True)
    standalone_path = os.path.join(dist_dir, 'standalone.html')
    with open(standalone_path, 'w', encoding='utf-8') as f:
        f.write(html)

    size_kb = len(html.encode('utf-8')) / 1024
    print(f"✅ Successfully built standalone zero-dependency HTML: {size_kb:.1f} KB")
    print(f"   Updated: index.html")
    print(f"   Created: dist/standalone.html")

if __name__ == '__main__':
    build_standalone()
