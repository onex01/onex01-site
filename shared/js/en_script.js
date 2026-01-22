// ==================== МУЛЬТИЯЗЫЧНОСТЬ ====================
function initLanguageSwitcher() {
    // Определяем текущий язык из URL
    const currentLang = window.location.pathname.startsWith('/en/') ? 'en' : 'ru';
    
    // Функция для переключения языка
    window.switchLanguage = function(lang) {
        // Сохраняем в куках
        document.cookie = `site_lang=${lang}; path=/; max-age=31536000`;
        
        // Получаем текущий путь без языкового префикса
        let path = window.location.pathname;
        path = path.replace(/^\/(en|ru)\//, '/');
        
        // Редирект на ту же страницу на другом языке
        window.location.href = `/${lang}${path}`;
    };
    
    // Добавляем обработчики для кнопок переключения
    document.querySelectorAll('[data-switch-lang]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-switch-lang');
            switchLanguage(lang);
        });
    });
    
    console.log(`🌐 Текущий язык: ${currentLang}`);
}

// Вызываем в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initLanguageSwitcher();
    // ... остальной ваш код
});

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

// ==================== ОСНОВНОЙ КОД САЙТА ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Загрузка сайта OneX01 Project...');
    
    // Запускаем анимацию дыма
    initSmokeAnimation();
    
    // Устанавливаем текущий год
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Создаем контейнер для уведомлений
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
    
    // Функция для показа уведомлений
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        notificationContainer.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Функция для копирования текста
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('Скопировано: ' + text, 'success');
                console.log('✅ Скопировано:', text);
            } else {
                showNotification('Не удалось скопировать', 'error');
            }
        } catch (err) {
            console.error('Ошибка при копировании:', err);
            showNotification('Ошибка при копировании', 'error');
            
            // Пробуем новый API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(
                    () => showNotification('Скопировано: ' + text, 'success'),
                    () => showNotification('Ошибка при копировании', 'error')
                );
            }
        }
        
        document.body.removeChild(textarea);
    }
    
    // Переключение вкладок
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Функция для показа элементов в активной вкладке
    function showTabContent(tabId) {
        const activeTab = document.getElementById(tabId);
        if (!activeTab) return;
        
        const cards = activeTab.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
                
                if (tabId === 'home') {
                    const infoItems = card.querySelectorAll('.info-item');
                    infoItems.forEach((item, itemIndex) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, itemIndex * 100);
                    });
                }
                
                if (tabId === 'projects') {
                    const projectItems = card.querySelectorAll('.project-item');
                    projectItems.forEach((item, itemIndex) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, itemIndex * 150);
                    });
                }
            }, index * 300);
        });
    }
    
    // Инициализация вкладок
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                const cards = content.querySelectorAll('.card');
                cards.forEach(card => card.classList.remove('visible'));
            });
            
            // Добавляем активный класс нажатой кнопке и соответствующему контенту
            button.classList.add('active');
            const activeTab = document.getElementById(tabId);
            activeTab.classList.add('active');
            
            // Показываем контент с анимацией
            setTimeout(() => showTabContent(tabId), 100);
            
            // Если переключились на Minecraft вкладку, проверяем статус
            if (tabId === 'minecraft') {
                setTimeout(() => {
                    checkMinecraftServer();
                }, 200);
            }
        });
    });
    
    // Показываем контент на главной вкладке при загрузке
    setTimeout(() => {
        showTabContent('home');
    }, 500);
    
    // ==================== MINECRAFT СЕРВЕР ====================
    let minecraftCheckInterval;
    const serverAddress = 'onex01.ddns.net';
    const serverAddressWithoutPort = serverAddress;
    let isChecking = false;
    
    // Функция для обновления времени последней проверки
    function updateLastCheckedTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = `Verified: ${timeString}`;
        }
    }
    
    // Функция для проверки статуса Minecraft сервера
    async function checkMinecraftServer() {
        if (isChecking) return;
        
        console.log('🔄 Checking the Minecraft server status...');
        
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        const connectOptions = document.getElementById('connectOptions');
        const worldMap = document.getElementById('worldMap');
        const serverOffline = document.getElementById('serverOffline');
        const onlinePlayers = document.getElementById('onlinePlayers');
        const maxPlayers = document.getElementById('maxPlayers');
        const serverVersion = document.getElementById('serverVersion');
        const manualRefreshButton = document.getElementById('manualRefresh');
        
        if (!statusDot) return;
        
        isChecking = true;
        
        // Показываем состояние загрузки
        statusDot.className = 'status-dot checking';
        statusText.textContent = 'Check...';
        statusText.style.color = '#FF9800';
        
        if (manualRefreshButton) {
            manualRefreshButton.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Check...';
            manualRefreshButton.disabled = true;
        }
        
        try {
            // Используем API для проверки статуса
            const timestamp = new Date().getTime();
            const apiUrl = `https://api.mcsrvstat.us/2/${serverAddress}?_=${timestamp}`;
            
            console.log('📡 Запрос к API:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Ответ от API:', data);
            
            // Обновляем время проверки
            updateLastCheckedTime();
            
            if (data.online) {
                // Сервер онлайн
                statusDot.className = 'status-dot online';
                statusText.textContent = 'Online 🟢';
                statusText.style.color = '#4CAF50';
                
                if (connectOptions) {
                    connectOptions.style.display = 'block';
                    
                    // Настройка кнопки копирования
                    const copyButton = document.getElementById('copyButton');
                    if (copyButton) {
                        copyButton.onclick = function(e) {
                            e.preventDefault();
                            copyToClipboard(serverAddressWithoutPort);
                        };
                    }
                }
                
                if (worldMap) worldMap.style.display = 'block';
                if (serverOffline) serverOffline.style.display = 'none';
                
                // Обновляем информацию о сервере
                if (onlinePlayers) {
                    const players = data.players?.online || 0;
                    onlinePlayers.textContent = players;
                    onlinePlayers.style.color = players > 0 ? '#4CAF50' : '#888';
                }
                
                if (maxPlayers) {
                    maxPlayers.textContent = data.players?.max || '20';
                }
                
                if (serverVersion) {
                    serverVersion.textContent = data.version || '1.21.11';
                }
                
                console.log(`✅ The server is online (${data.players?.online || 0}/${data.players?.max || 20} players)`);
                
                // Показываем уведомление если есть игроки
                if (data.players?.online > 0) {
                    showNotification(`On the server ${data.players.online} player(s) online!`, 'success');
                }
                
            } else {
                // Сервер оффлайн
                statusDot.className = 'status-dot offline';
                statusText.textContent = 'Offline 🔴';
                statusText.style.color = '#f44336';
                
                if (connectOptions) connectOptions.style.display = 'none';
                if (worldMap) worldMap.style.display = 'none';
                if (serverOffline) serverOffline.style.display = 'block';
                
                if (onlinePlayers) {
                    onlinePlayers.textContent = '0';
                    onlinePlayers.style.color = '#888';
                }
                
                if (serverVersion) {
                    serverVersion.textContent = '1.21.11';
                }
                
                console.log('❌ The server is offline');
            }
            
        } catch (error) {
            console.error('❌ Error checking the server:', error);
            
            statusDot.className = 'status-dot error';
            statusText.textContent = 'Verification error';
            statusText.style.color = '#FF9800';
            
            // Обновляем время даже при ошибке
            updateLastCheckedTime();
            
            // Показываем информацию об ошибке
            showNotification('Couldn\'t check the server status', 'error');
            
            // Устанавливаем значения по умолчанию
            if (onlinePlayers) {
                onlinePlayers.textContent = '?';
                onlinePlayers.style.color = '#FF9800';
            }
            
            if (serverVersion) {
                serverVersion.textContent = '1.21.11';
            }
        } finally {
            isChecking = false;
            
            if (manualRefreshButton) {
                manualRefreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Update status now';
                manualRefreshButton.disabled = false;
            }
        }
    }
    
    // Функция для инициализации Minecraft вкладки
    function initMinecraftTab() {
        const minecraftTab = document.getElementById('minecraft');
        if (!minecraftTab) return;
        
        console.log('🚀 Initializing Minecraft Tabs');
        
        // Проверяем статус сервера сразу
        checkMinecraftServer();
        
        // Устанавливаем интервал проверки каждую минуту
        if (minecraftCheckInterval) {
            clearInterval(minecraftCheckInterval);
        }
        
        minecraftCheckInterval = setInterval(() => {
            if (minecraftTab.classList.contains('active')) {
                console.log('⏰ Automatic status check');
                checkMinecraftServer();
            }
        }, 60000); // 60 секунд
        
        // Кнопка ручного обновления
        const manualRefreshButton = document.getElementById('manualRefresh');
        if (manualRefreshButton) {
            manualRefreshButton.onclick = function() {
                checkMinecraftServer();
            };
        }
        
        // Копирование адреса при клике на иконку копирования
        document.querySelectorAll('.copy-icon').forEach(icon => {
            icon.onclick = function() {
                copyToClipboard(serverAddressWithoutPort);
            };
        });
        
        // Копирование адреса при клике на сам адрес
        const serverAddressElement = document.getElementById('serverAddress');
        if (serverAddressElement) {
            serverAddressElement.style.cursor = 'pointer';
            serverAddressElement.title = 'Click to copy the address';
            serverAddressElement.onclick = function() {
                copyToClipboard(serverAddressWithoutPort);
            };
        }
        
        // Очистка интервала при уходе со страницы
        window.addEventListener('beforeunload', () => {
            if (minecraftCheckInterval) {
                clearInterval(minecraftCheckInterval);
            }
        });
    }
    
    // Инициализируем Minecraft вкладку при переключении на нее
    document.querySelectorAll('.tab-button[data-tab="minecraft"]').forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(() => {
                initMinecraftTab();
                const minecraftCards = document.querySelectorAll('#minecraft .card');
                minecraftCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 300);
                });
            }, 100);
        });
    });
    
    // Если Minecraft вкладка активна при загрузке
    if (document.querySelector('.tab-button[data-tab="minecraft"].active')) {
        setTimeout(() => {
            initMinecraftTab();
        }, 1000);
    }
    
    // Проверяем статус сервера при возвращении на вкладку
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            const minecraftTab = document.getElementById('minecraft');
            if (minecraftTab && minecraftTab.classList.contains('active')) {
                console.log('🔙 Return to the page, check the status');
                checkMinecraftServer();
            }
        }
    });
    
    console.log('✅ The website has been uploaded successfully!');
});
