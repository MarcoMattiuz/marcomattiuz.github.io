// Cambia l'immagine di sfondo
async function changeBackground(newUrl) {
  const currentLayer = document.querySelector('.bg-current');
  const nextLayer = document.querySelector('.bg-next');
  
  // Imposta la nuova immagine sul layer nascosto
  document.documentElement.style.setProperty("--bg-image-next", `url(${newUrl})`);
  
  // Mostra il nuovo layer
  nextLayer.style.opacity = '1';
  
  // Aspetta che la transizione sia completa
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Scambia le immagini e resetta
  document.documentElement.style.setProperty("--bg-image", `url(${newUrl})`);
  nextLayer.style.opacity = '0';
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Usa localStorage per persistenza
let i = parseInt(localStorage.getItem("bgIndex") || "0", 10);

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function setDynamicColors(imageUrl) {
  console.log('Analyzing image:', imageUrl);
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageUrl;
  img.onload = function () {
    const canvas = document.createElement("canvas");
    const sampleSize = 20;
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    const ctx = canvas.getContext("2d");
    
    // Calcola le dimensioni della regione centrale (10% dell'immagine)
    const centerWidth = img.width * 0.1;
    const centerHeight = img.height * 0.1;
    const startX = (img.width - centerWidth) / 2;
    const startY = (img.height - centerHeight) / 2;
    
    // Disegna solo la regione centrale nel canvas
    ctx.drawImage(img, 
      startX, startY, centerWidth, centerHeight,  // source rectangle (10% centrale)
      0, 0, sampleSize, sampleSize                // destination rectangle
    );
    
    console.log('Sampling center region (10%):', {
      width: Math.round(centerWidth),
      height: Math.round(centerHeight),
      startX: Math.round(startX),
      startY: Math.round(startY)
    });

    // Analizza i pixel del canvas
    const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
    let r = 0, g = 0, b = 0;
    for (let j = 0; j < data.length; j += 4) {
      r += data[j];
      g += data[j + 1];
      b += data[j + 2];
    }
    
    const pixelCount = data.length / 4;
    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);
    
    console.log('Center region average color:', `rgb(${r},${g},${b})`);
    
    // Calcola la luminosità usando la formula per la perceived brightness
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    console.log('Luminance:', luminance);
    
    // Scegli tra whitesmoke e nero basandoti sulla luminosità
    const textColor = luminance > 128 ? 'rgb(20,20,20)' : 'rgb(245,245,245)';
    console.log('Using color:', textColor);

    // Aggiorna il colore per le icone
    document.documentElement.style.setProperty('--fg-color', textColor);
    
    // Reinizializza sempre Vara con il nuovo colore
    window.initVara(textColor);
    
    console.log('Colors updated - Text:', textColor);
  };
}

// Gestisci il cambio automatico delle immagini
function startBackgroundCycle() {
  setInterval(() => {
    const imgPath = `../assets/backgrounds/${photos[i]}`;
    changeBackground(imgPath);
    setDynamicColors(imgPath); // Chiama setDynamicColors qui
    i = (i + 1) % photos.length;
    localStorage.setItem("bgIndex", i);
  }, 8000);
}

window.addEventListener("load", () => {
  const imgPath = `../assets/backgrounds/${photos[i]}`;
  changeBackground(imgPath);
  setDynamicColors(imgPath);
  i = (i + 1) % photos.length;
  localStorage.setItem("bgIndex", i);
  startBackgroundCycle();
});



