(function () {
  // --- Elementos DOM ---
  const canvas = document.getElementById('wheelCanvas');
  const wheelWrap = document.getElementById('wheelWrap');
  const ctx = canvas.getContext('2d');

  const spinButton = document.getElementById('spinButton');
  const addButton = document.getElementById('addButton');
  const optionInput = document.getElementById('optionInput');
  const optionsListEl = document.getElementById('optionsList');
  const winnerPanel = document.getElementById('winnerPanel');

  // --- Estado ---
  let options = ['Café', 'Pizza', 'Paseo', 'Película']; // inicial
  let colors = []; // colores por opción
  let isSpinning = false;
  let rotation = 0; // en radianes, rotación actual aplicada a la ruleta

  // DPI / tamaño
  function resizeCanvas() {
    const rect = wheelWrap.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const DPR = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = Math.round(size * DPR);
    canvas.height = Math.round(size * DPR);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); // normaliza coordenadas al CSS pixels
    drawWheel();
  }
  window.addEventListener('resize', resizeCanvas);

  // --- Utilidades ---
  function genColors(n) {
    // Genera colores HSL agradables y consistentes
    const arr = [];
    for (let i = 0; i < n; i++) {
      const hue = Math.round((i * 360) / n + (i * 13) % 30);
      arr.push(`hsl(${hue} 70% 55%)`);
    }
    return arr;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // Dibuja la ruleta según 'options' y 'rotation'
  function drawWheel() {
    if (!ctx) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy);

    ctx.clearRect(0, 0, w, h);

    const len = Math.max(options.length, 1);
    const slice = (Math.PI * 2) / len;

    // dibujar sectores
    for (let i = 0; i < len; i++) {
      const start = rotation + i * slice;
      const end = start + slice;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();

      ctx.fillStyle = colors[i] || '#ddd';
      ctx.fill();

      // borde sutil
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = Math.max(1, radius * 0.006);
      ctx.stroke();

      // texto del sector
      const text = options[i] || '';
      ctx.save();
      ctx.translate(cx, cy);
      const angle = start + slice / 2;
      ctx.rotate(angle);

      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      const fontSize = Math.max(10, Math.floor(radius * 0.10));
      ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'right';

      // limitar longitud para que no se salga
      const maxChars = 22;
      const display = text.length > maxChars ? text.slice(0, maxChars - 1) + '…' : text;
      ctx.fillText(display, radius * 0.88, 0);
      ctx.restore();
    }

    // centro visual (opcional): dibujamos un anillo central para marcar el botón
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.035)';
    ctx.fill();
  }

  // ---- UI: lista de opciones ----
  function refreshOptionsList() {
    optionsListEl.innerHTML = '';
    options.forEach((opt, idx) => {
      const li = document.createElement('li');
      li.className = 'option-item';

      const left = document.createElement('div');
      left.className = 'option-left';

      const sw = document.createElement('span');
      sw.className = 'color-swatch';
      sw.style.background = colors[idx] || '#ddd';

      const txt = document.createElement('span');
      txt.className = 'option-text';
      txt.textContent = opt;

      left.appendChild(sw);
      left.appendChild(txt);

      const del = document.createElement('button');
      del.className = 'btn-delete';
      del.title = 'Eliminar opción';
      del.textContent = '✕';
      del.addEventListener('click', () => {
        removeOption(idx);
      });

      li.appendChild(left);
      li.appendChild(del);

      optionsListEl.appendChild(li);
    });

    // actualizar estado del botón
    updateSpinButtonState();
  }

  function addOption(text) {
    const t = (text || '').trim();
    if (!t) return;
    options.push(t);
    colors = genColors(options.length);
    refreshOptionsList();
    drawWheel();
  }

  function removeOption(index) {
    if (index < 0 || index >= options.length) return;
    options.splice(index, 1);
    colors = genColors(options.length);
    refreshOptionsList();
    drawWheel();
  }

  // Actualiza deshabilitado del botón de girar
  function updateSpinButtonState() {
    if (options.length === 0 || isSpinning) {
      spinButton.setAttribute('disabled', 'true');
    } else {
      spinButton.removeAttribute('disabled');
    }
  }

  // --- Animación: easing ---
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  // Animar rotación hasta targetRotation (radianes) en duration ms
  function animateTo(targetRotation, duration = 4000) {
    return new Promise((resolve) => {
      const startRot = rotation;
      const startTime = performance.now();
      function frame(now) {
        const elapsed = now - startTime;
        const t = clamp(elapsed / duration, 0, 1);
        const eased = easeOutCubic(t);
        rotation = startRot + (targetRotation - startRot) * eased;
        drawWheel();
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          // normalizar rotation a [0, 2pi)
          rotation = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          drawWheel();
          resolve();
        }
      }
      requestAnimationFrame(frame);
    });
  }

  // --- Lógica de giro y selección segura ---
  async function spinOnce() {
    if (isSpinning || options.length === 0) return;
    isSpinning = true;
    updateSpinButtonState();
    winnerPanel.textContent = 'Girando…';

    const len = options.length;
    const slice = (Math.PI * 2) / len;

    // Elegir índice ganador aleatorio (uniforme)
    const winnerIndex = Math.floor(Math.random() * len);

    const k = 4 + Math.floor(Math.random() * 3); 
    const targetCenter = -Math.PI / 2;
    const desiredRotation = (targetCenter - (winnerIndex * slice + slice / 2)) + k * (Math.PI * 2);


    const duration = 3600 + Math.floor(Math.random() * 1200);

    try {
      await animateTo(desiredRotation, duration);
    } catch (e) {
    
      console.error('Error en animación:', e);
    }

    // Mostrar ganador
    const winnerText = options[winnerIndex] || '—';
    showWinner(winnerText);

    isSpinning = false;
    updateSpinButtonState();
  }

  // Mostrar ganador con efecto sencillo
  function showWinner(text) {
    winnerPanel.textContent = `🎉 Ganador: ${text}`;
    // animación simple de "pop"
    winnerPanel.animate([
      { transform: 'scale(0.95)', opacity: 0.6 },
      { transform: 'scale(1.06)', opacity: 1 },
      { transform: 'scale(1)', opacity: 1 }
    ], { duration: 700, easing: 'cubic-bezier(.2,.9,.3,1)' });
  }

  // --- Event handlers ---
  addButton.addEventListener('click', () => {
    const v = optionInput.value;
    addOption(v);
    optionInput.value = '';
    optionInput.focus();
  });

  optionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addButton.click();
    }
  });

  spinButton.addEventListener('click', () => {
    spinOnce();
  });

  // Soporte para accesibilidad / teclado: tecla espacio o enter en botón central
  spinButton.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !spinButton.disabled) {
      e.preventDefault();
      spinButton.click();
    }
  });

  // --- Inicialización ---
  function init() {
    colors = genColors(options.length);
    refreshOptionsList();
    resizeCanvas();
    updateSpinButtonState();
    // establecer enfoque en input por comodidad
    optionInput.focus();
  }

  init();

})();