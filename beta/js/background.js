// ==================== АНИМАЦИЯ ДЫМА v2 ====================
function initSmokeAnimation() {
  const canvas = document.getElementById('smokeCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Настройки
  const config = {
    particleCount:    isMobile ? 18 : 32,
    baseSize:         isMobile ? 50 : 70,
    maxSize:          isMobile ? 140 : 180,
    speedYBase:       -0.7,
    speedYVariation:  0.5,
    opacityBase:      0.025,
    opacityVariation: 0.018,
    mouseInfluence:   isMobile ? 0 : 40,     // насколько сильно мышь влияет
    fadeInTime:       1800
  };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.reset();
      this.y = canvas.height * (0.3 + Math.random() * 1.2); // старт в случайном месте
      this.opacity = 0.001; // почти невидимые в начале
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 120;
      this.size = config.baseSize + Math.random() * (config.maxSize - config.baseSize);
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = config.speedYBase - Math.random() * config.speedYVariation;
      this.opacity = config.opacityBase + Math.random() * config.opacityVariation;
      this.life = 1;
      this.wobble = Math.random() * 0.7 + 0.4;
      this.wobbleSpeed = Math.random() * 0.015 + 0.008;
      this.wobblePhase = Math.random() * Math.PI * 2;

      // цветовая палитра — холодный дым / мистический
      const hue = 200 + Math.random() * 40;
      this.color = `hsla(${hue}, 60%, 80%, `;
    }

    update() {
      // влияние мыши (очень мягкое)
      const dx = (mouseX - this.x) * 0.0003 * config.mouseInfluence;
      const dy = (mouseY - this.y) * 0.0002 * config.mouseInfluence;

      this.x += this.speedX + Math.sin(this.y * 0.008 + this.wobblePhase) * this.wobble + dx;
      this.y += this.speedY + dy;

      this.size += 0.35;
      this.opacity *= 0.996;
      this.life -= 0.0012;
      this.wobblePhase += this.wobbleSpeed;

      if (this.y < -this.size * 1.5 || this.opacity < 0.004 || this.life <= 0) {
        this.reset();
      }
    }

    draw() {
      const alpha = this.opacity * this.life;
      if (alpha < 0.005) return;

      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 1.1
      );

      gradient.addColorStop(0.0, this.color + alpha + ')');
      gradient.addColorStop(0.4, this.color + (alpha * 0.55) + ')');
      gradient.addColorStop(1.0, this.color + '0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    // плавное затемнение следов
    ctx.fillStyle = 'rgba(8, 8, 28, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Плавное появление
  setTimeout(() => {
    canvas.style.opacity = '1';
  }, 300);

  // Мышь
  window.addEventListener('mousemove', e => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });

  // Плавное следование мыши
  function updateMouse() {
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;
  }

  // Запуск
  resizeCanvas();
  animate();

  // lerp мыши в каждом кадре
  function loop() {
    updateMouse();
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', resizeCanvas);

  // Пауза при сворачивании вкладки
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

initSmokeAnimation();