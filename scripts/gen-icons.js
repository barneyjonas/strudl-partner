const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Café storefront SVG — warm Ritual palette
const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <!-- Background -->
  <rect width="512" height="512" rx="${size * 0.18}" fill="#1A1815"/>

  <!-- Building body -->
  <rect x="96" y="240" width="320" height="210" rx="8" fill="#EDE8DF"/>

  <!-- Awning -->
  <path d="M72 200 L440 200 L400 260 L112 260 Z" fill="#E6C828"/>
  <!-- Awning stripes -->
  <path d="M150 200 L130 260" stroke="#1A1815" stroke-width="10" stroke-opacity="0.15"/>
  <path d="M210 200 L193 260" stroke="#1A1815" stroke-width="10" stroke-opacity="0.15"/>
  <path d="M270 200 L256 260" stroke="#1A1815" stroke-width="10" stroke-opacity="0.15"/>
  <path d="M330 200 L319 260" stroke="#1A1815" stroke-width="10" stroke-opacity="0.15"/>
  <path d="M390 200 L382 260" stroke="#1A1815" stroke-width="10" stroke-opacity="0.15"/>

  <!-- Awning valance scallops -->
  <path d="M112 260 Q128 278 144 260 Q160 278 176 260 Q192 278 208 260 Q224 278 240 260 Q256 278 272 260 Q288 278 304 260 Q320 278 336 260 Q352 278 368 260 Q384 278 400 260" fill="none" stroke="#E6C828" stroke-width="18"/>

  <!-- Window left -->
  <rect x="118" y="290" width="108" height="90" rx="6" fill="#FDFAF5"/>
  <line x1="172" y1="290" x2="172" y2="380" stroke="#C8C0B0" stroke-width="2"/>
  <line x1="118" y1="335" x2="226" y2="335" stroke="#C8C0B0" stroke-width="2"/>

  <!-- Window right -->
  <rect x="286" y="290" width="108" height="90" rx="6" fill="#FDFAF5"/>
  <line x1="340" y1="290" x2="340" y2="380" stroke="#C8C0B0" stroke-width="2"/>
  <line x1="286" y1="335" x2="394" y2="335" stroke="#C8C0B0" stroke-width="2"/>

  <!-- Door -->
  <rect x="211" y="340" width="90" height="110" rx="6" fill="#7A7060"/>
  <rect x="218" y="347" width="35" height="55" rx="3" fill="#5A5048"/>
  <rect x="259" y="347" width="35" height="55" rx="3" fill="#5A5048"/>
  <circle cx="248" cy="390" r="5" fill="#E6C828"/>
  <circle cx="264" cy="390" r="5" fill="#E6C828"/>

  <!-- Sign above awning -->
  <rect x="156" y="148" width="200" height="44" rx="10" fill="#FDFAF5"/>
  <text x="256" y="177" font-family="Georgia, serif" font-size="26" font-weight="700" fill="#1A1815" text-anchor="middle" letter-spacing="-0.5">Strudl</text>

  <!-- Roof line -->
  <rect x="80" y="190" width="352" height="14" rx="4" fill="#7A7060"/>
</svg>`;

const outDir = path.join(__dirname, '..', 'public');

async function generate() {
  for (const size of [192, 512]) {
    const buf = Buffer.from(svg(size));
    await sharp(buf)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`));
    console.log(`generated icon-${size}.png`);
  }
}

generate().catch(console.error);
