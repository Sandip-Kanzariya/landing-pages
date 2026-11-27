"""Rebuild the silent six-second study: pip install Pillow imageio-ffmpeg."""
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw
from imageio_ffmpeg import get_ffmpeg_exe

out = Path(__file__).resolve().parent
w, h, fps, frames = 960, 540, 24, 144
cmd = [get_ffmpeg_exe(), "-loglevel", "error", "-y", "-f", "rawvideo",
       "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", str(fps), "-i", "-",
       "-an", "-c:v", "libx264", "-crf", "23", "-pix_fmt", "yuv420p",
       "-movflags", "+faststart", str(out / "phase-shift.mp4")]
with subprocess.Popen(cmd, stdin=subprocess.PIPE) as encoder:
    for frame in range(frames):
        t = math.tau * frame / frames
        image = Image.new("RGB", (w, h), "#170e10")
        pen = ImageDraw.Draw(image)
        for y in range(h):
            v = 1 - abs(y - 248) / h
            pen.line((0, y, w, y), fill=(int(15+26*v**3), 15, 19))
        for row in range(56):
            u = row / 55
            a = 1.5 * math.pi * u + .55 * math.sin(t)
            cx = 480 + 104 * math.cos(a + t)
            cy = 115 + 316*u + 10 * math.sin(t+a)
            width = 157 + 32*math.sin(3*u+t)
            tilt = .55*math.sin(a+t)
            ring = []
            for col in range(100):
                b = math.tau * col / 99
                x, y = width*math.cos(b), 39*math.sin(b)
                ring.append((cx+x*math.cos(tilt)-y*math.sin(tilt),
                             cy+x*math.sin(tilt)+y*math.cos(tilt)))
            pen.polygon(ring, fill="#392023")
            for col in range(99):
                glint = (.5+.5*math.cos(math.tau*col/99-.7*math.sin(a+t)))**3
                pen.line(ring[col:col+2], fill=(int(130+123*glint),
                         int(40+147*glint), int(35+127*glint)), width=3)
        if frame == 0:
            image.save(out / "phase-shift.jpg", quality=88)
        encoder.stdin.write(image.tobytes())
    encoder.stdin.close()
    if encoder.wait() != 0:
        raise RuntimeError("Film encoding failed")
