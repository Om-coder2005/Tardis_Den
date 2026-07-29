import os
import re

replacements = [
    (r"(?i)\bthree\.js\b", "React"),
    (r"(?i)\breact three fiber\b", "Framer Motion"),
    (r"(?i)\bthree fiber\b", "Framer Motion"),
    (r"(?i)\br3f\b", "Framer Motion"),
    (r"(?i)\bdrei\b", "CSS Transforms"),
    (r"(?i)\bgltf models?\b", "Layered PNG/SVG assets"),
    (r"(?i)\bgltf assets?\b", "Layered PNG/SVG assets"),
    (r"(?i)\bgltf loader\b", "Asset Manager"),
    (r"(?i)\bgltf\b", "Layered assets"),
    (r"(?i)\bmeshes\b", "Layered Objects"),
    (r"(?i)\bmesh\b", "Layered Object"),
    (r"(?i)\borbit\s*controls?\b", "Camera Transition Controller"),
    (r"(?i)\bfree-moving 3d camera\b", "Smooth camera pan"),
    (r"(?i)\bfree-moving camera\b", "Smooth camera pan"),
    (r"(?i)\b3d camera\b", "Smooth camera pan"),
    (r"(?i)\b3d scene\b", "2.5D Isometric Environment"),
    (r"(?i)\breal-time 3d environment\b", "Interactive 2.5D Isometric Environment"),
    (r"(?i)\breal-time 3d rendering\b", "Interactive 2.5D Isometric rendering"),
    (r"(?i)\breal-time 3d\b", "Interactive 2.5D"),
    (r"(?i)\b3d engine\b", "2.5D Isometric Interaction Engine"),
    (r"(?i)\bscene graph\b", "Interaction Engine"),
    (r"(?i)\bmesh animation\b", "CSS/Framer Motion animation"),
    (r"(?i)\b3d lighting\b", "Lighting effects (CSS)"),
    (r"(?i)\b3d environment\b", "2.5D Isometric Environment"),
    (r"(?i)\b3d room\b", "2.5D Isometric Room"),
    (r"(?i)\b3d rendering\b", "2.5D Isometric Rendering"),
    (r"(?i)\bcanvas\b", "Layer Manager"),
]

def convert():
    directory = r"D:\the_space"
    for root, _, files in os.walk(directory):
        for f in files:
            if f.endswith(".md"):
                filepath = os.path.join(root, f)
                with open(filepath, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                new_content = content
                for pattern, replacement in replacements:
                    new_content = re.sub(pattern, replacement, new_content)
                
                # Further specific rewrites
                new_content = new_content.replace(
                    "Background Layer\nMidground Objects\nForeground Objects\nAmbient Effects Layer\nInteraction Layer\nUI Overlay", 
                    "Background Layer\nMidground Objects\nForeground Objects\nAmbient Effects Layer\nInteraction Layer\nUI Overlay"
                )
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Updated: {filepath}")

if __name__ == "__main__":
    convert()
