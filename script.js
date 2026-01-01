document.addEventListener('DOMContentLoaded', function() {
    const currentYearElement = document.getElementById('currentYear');
    
    // Устанавливаем текущий год
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
    
    // Функция для копирования текста в буфер обмена
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
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                const cards = content.querySelectorAll('.card');
                cards.forEach(card => card.classList.remove('visible'));
            });
            
            button.classList.add('active');
            const activeTab = document.getElementById(tabId);
            activeTab.classList.add('active');
            
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
    
    // Переменные для Minecraft сервера
    let minecraftCheckInterval;
    const serverAddress = 'onex01.ddns.net';
    const serverAddressWithoutPort = serverAddress;
    const serverAddressWithPort = `${serverAddress}:25565`;
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
            lastUpdatedElement.textContent = `Проверено: ${timeString}`;
        }
    }
    
    // Функция для проверки статуса Minecraft сервера через API
    async function checkMinecraftServer() {
        if (isChecking) return;
        
        console.log('🔄 Проверка статуса Minecraft сервера через API...');
        
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
        statusText.textContent = 'Проверка...';
        statusText.style.color = '#FF9800';
        
        if (manualRefreshButton) {
            manualRefreshButton.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Проверка...';
            manualRefreshButton.disabled = true;
        }
        
        try {
            // Используем mcsrvstat API для проверки статуса
            // Добавляем timestamp для предотвращения кэширования
            const timestamp = new Date().getTime();
            const apiUrl = `https://api.mcsrvstat.us/2/${serverAddress}?_=${timestamp}`;
            
            console.log('📡 Отправка запроса к API:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // Таймаут 10 секунд
                signal: AbortSignal.timeout(10000)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Ответ от API:', data);
            
            // Обновляем время проверки
            updateLastCheckedTime();
            
            if (data.online) {
                // Сервер онлайн
                statusDot.className = 'status-dot online';
                statusText.textContent = 'Онлайн 🟢';
                statusText.style.color = '#4CAF50';
                
                if (connectOptions) {
                    connectOptions.style.display = 'block';
                    
                    // Настройка кнопки быстрого подключения
                    const directConnectLink = document.querySelector('.connect-direct');
                    if (directConnectLink) {
                        directConnectLink.href = `minecraft://?addExternalServer=OneX01|${serverAddressWithoutPort}`;
                    }
                    
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
                
                console.log(`✅ Сервер онлайн (${data.players?.online || 0}/${data.players?.max || 20} игроков)`);
                
                // Показываем мотивинг если есть игроки
                if (data.players?.online > 0) {
                    showNotification(`На сервере ${data.players.online} игрок(ов) онлайн!`, 'success');
                }
                
            } else {
                // Сервер оффлайн
                statusDot.className = 'status-dot offline';
                statusText.textContent = 'Оффлайн 🔴';
                statusText.style.color = '#f44336';
                
                if (connectOptions) connectOptions.style.display = 'none';
                if (worldMap) worldMap.style.display = 'none';
                if (serverOffline) serverOffline.style.display = 'block';
                
                if (onlinePlayers) {
                    onlinePlayers.textContent = '0';
                    onlinePlayers.style.color = '#888';
                }
                
                if (maxPlayers) {
                    maxPlayers.textContent = '20';
                }
                
                if (serverVersion) {
                    serverVersion.textContent = '1.21.1';
                }
                
                console.log('❌ Сервер оффлайн');
            }
            
        } catch (error) {
            console.error('❌ Ошибка при проверке сервера:', error);
            
            statusDot.className = 'status-dot error';
            statusText.textContent = 'Ошибка проверки';
            statusText.style.color = '#FF9800';
            
            // Обновляем время даже при ошибке
            updateLastCheckedTime();
            
            // Показываем информацию об ошибке
            showNotification('Не удалось проверить статус сервера', 'error');
            
            // Устанавливаем значения по умолчанию
            if (onlinePlayers) {
                onlinePlayers.textContent = '?';
                onlinePlayers.style.color = '#FF9800';
            }
            
            if (serverVersion) {
                serverVersion.textContent = '1.21.1';
            }
        } finally {
            isChecking = false;
            
            if (manualRefreshButton) {
                manualRefreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить статус сейчас';
                manualRefreshButton.disabled = false;
            }
        }
    }
    
    // Функция для инициализации Minecraft вкладки
    function initMinecraftTab() {
        const minecraftTab = document.getElementById('minecraft');
        if (!minecraftTab) return;
        
        console.log('🚀 Инициализация Minecraft вкладки');
        
        // Проверяем статус сервера сразу
        checkMinecraftServer();
        
        // Устанавливаем интервал проверки каждую минуту (60000 мс)
        if (minecraftCheckInterval) {
            clearInterval(minecraftCheckInterval);
        }
        
        minecraftCheckInterval = setInterval(() => {
            if (minecraftTab.classList.contains('active')) {
                console.log('⏰ Автоматическая проверка статуса');
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
            serverAddressElement.title = 'Кликните чтобы скопировать адрес';
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
                // Если вернулись на страницу и активна Minecraft вкладка
                console.log('🔙 Возврат на страницу, проверяем статус');
                checkMinecraftServer();
            }
        }
    });
});