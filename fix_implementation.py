import os
import re

def fix_phase_01():
    file_path = r"D:\the_space\implementation\Phase 01 - Project Foundation.md"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # The file has been butchered a little bit by the replace_file_content tool, 
    # Let's fix the frontend section properly.
    frontend_list = """\- React 19
\- TypeScript
\- Vite
\- Tailwind CSS
\- React Router
\- Zustand
\- Framer Motion
\- CSS Transforms
\- TanStack Query
\- Lucide React"""

    # We will regex replace the whole Deliverables section down to Backend Project Structure just to be safe
    # Let's just find the `## Frontend` and fix the list under it.
    
    # Actually, a simpler approach is to rebuild the file content cleanly from known good structure.
    # But let's just do a string replace for the duplicate.
    
    content = content.replace("- Framer Motion\n\n- CSS Transforms", "- Framer Motion\n\n- CSS Transforms")
    content = re.sub(r"\\- Framer Motion\n*\s*\\- Framer Motion", r"\- Framer Motion", content)
    content = re.sub(r"- Framer Motion\n*\s*- Framer Motion", r"- Framer Motion", content)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)


def fix_phase_03():
    file_path = r"D:\the_space\implementation\Phase 03 - Room Foundation.md"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    replacements = {
        "Perspective Camera": "Isometric Camera (2.5D)",
        "models/": "layers/",
        "textures/": "images/",
        "materials/": "sprites/",
        "GLB compression": "Image compression (PNG/SVG)",
        "Texture compression": "Asset optimization",
        "Frustum culling enabled.": "CSS will-change optimized.",
        "Texture resolution appropriate to screen size.": "Image resolution appropriate to screen size."
    }

    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)


def fix_phase_10():
    file_path = r"D:\the_space\implementation\Phase 10 - Production Polish & Release.md"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    replacements = {
        "Draw calls minimized": "DOM node count minimized",
        "Geometry merged": "Layers grouped and optimized",
        "Textures compressed to WebP/AVIF": "Images compressed to WebP/AVIF",
        "Shader complexity reduced": "CSS animation complexity reduced"
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_phase_01()
    fix_phase_03()
    fix_phase_10()
    print("Fixed implementation documents.")
