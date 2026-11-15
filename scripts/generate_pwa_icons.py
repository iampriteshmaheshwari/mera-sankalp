import struct
import zlib
import math

def create_png(width, height, filename):
    # Generates a PNG with black background and radiant gold circular emblem
    raw_data = bytearray()
    cx, cy = width / 2.0, height / 2.0
    r_outer = min(width, height) * 0.42
    r_inner = r_outer * 0.85
    r_center = r_outer * 0.35

    for y in range(height):
        raw_data.append(0) # filter type 0 (None)
        for x in range(width):
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx*dx + dy*dy)

            # Golden ring & flame motif
            if abs(dist - r_outer) < 3.5:
                # Golden circle border
                raw_data.extend([255, 212, 0, 255])
            elif dist < r_center:
                # Golden core
                raw_data.extend([255, 212, 0, 255])
            elif dist < r_inner and (dx*dx*1.8 + dy*dy < r_inner*r_inner*0.6):
                # Inner radiant flame
                raw_data.extend([255, 226, 71, 255])
            elif dist < r_outer:
                # Soft ambient warm background
                raw_data.extend([20, 18, 5, 255])
            else:
                # Pure black
                raw_data.extend([0, 0, 0, 255])

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    # PNG Signature
    png = b'\x89PNG\r\n\x1a\n'
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png += chunk(b'IHDR', ihdr_data)
    # IDAT
    compressed = zlib.compress(bytes(raw_data), 9)
    png += chunk(b'IDAT', compressed)
    # IEND
    png += chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Generated {filename} ({width}x{height})")

if __name__ == '__main__':
    create_png(192, 192, 'public/pwa-192x192.png')
    create_png(512, 512, 'public/pwa-512x512.png')
    create_png(512, 512, 'public/pwa-maskable-512x512.png')
    create_png(180, 180, 'public/apple-touch-icon.png')
