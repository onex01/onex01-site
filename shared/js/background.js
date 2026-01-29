// ==================== АНИМАЦИЯ ДЫМА ====================
function initSmokeAnimation() {
    console.log('🚀 Инициализация анимации дыма...');
    
    const canvas = document.getElementById('smokeCanvas');
    if (!canvas) {
        console.error('❌ Canvas не найден!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Настройки для разных устройств
    const settings = {
        particleCount: isMobile ? 20 : 35,
        maxParticles: isMobile ? 25 : 40,
        baseSize: isMobile ? 60 : 80,
        maxSize: isMobile ? 120 : 160,
        opacity: isMobile ? 0.03 : 0.04
    };
    
    // Подгоняем размер canvas под окно
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    
    // Класс частицы дыма
    class Particle {
        constructor() {
            this.reset();
            // Разбрасываем частицы по времени для плавного начала
            this.y = canvas.height + Math.random() * 1000;
            this.x = Math.random() * canvas.width;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * settings.maxSize + settings.baseSize;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * -0.8 - 0.5;
            this.opacity = Math.random() * settings.opacity + 0.02;
            this.wobble = Math.random() * 0.5 + 0.5;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.wobbleOffset = Math.random() * Math.PI * 2;
            
            // Цвет дыма (голубовато-синий)
            this.color = {
                r: 160 + Math.random() * 40,
                g: 180 + Math.random() * 40,
                b: 220 + Math.random() * 35
            };
        }
        
        update() {
            // Движение с колебаниями
            this.x += this.speedX + Math.sin((this.y * 0.01) + this.wobbleOffset) * this.wobble * 0.5;
            this.y += this.speedY;
            
            // Медленно увеличиваем размер и уменьшаем прозрачность
            this.size += 0.5;
            this.opacity *= 0.998;
            
            // Перезапускаем частицу, если она улетела или стала невидимой
            if (this.y < -this.size * 2 || this.opacity < 0.005) {
                this.reset();
                this.y = canvas.height + Math.random() * 100;
            }
            
            this.wobbleOffset += this.wobbleSpeed;
        }
        
        draw() {
            ctx.beginPath();
            
            // Создаем градиент для мягкого дыма
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            
            gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(${this.color.r - 20}, ${this.color.g - 20}, ${this.color.b + 20}, ${this.opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(${this.color.r - 40}, ${this.color.g - 40}, ${this.color.b + 40}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Инициализация частиц
    function initParticles() {
        particles = [];
        for (let i = 0; i < settings.particleCount; i++) {
            particles.push(new Particle());
            // Разбрасываем частицы во времени для плавного начала
            particles[i].y = canvas.height + Math.random() * 500;
            particles[i].opacity = Math.random() * 0.05;
        }
        console.log(`✅ Создано ${particles.length} частиц дыма`);
    }
    
    // Анимация
    function animate() {
        // Очищаем canvas с легким затемнением для эффекта следов
        ctx.fillStyle = 'rgba(10, 10, 30, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Обновляем и рисуем частицы
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Обработчики событий
    window.addEventListener('resize', resizeCanvas);
    
    // Управление анимацией при смене видимости вкладки
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
    
    // Запуск
    resizeCanvas();
    animate();
    console.log('✅ Анимация дыма запущена');
}

initSmokeAnimation();