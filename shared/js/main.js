// ==================== ОСНОВНОЙ КОД САЙТА ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Загрузка сайта OneX01 Project...');
    
    // Устанавливаем текущий год
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = '2025-' + new Date().getFullYear();
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

    // Функция для инициализации Minecraft вкладки
    function initMinecraftTab() {
        const minecraftTab = document.getElementById('minecraft');
        if (!minecraftTab) return;
        
        console.log('🚀 Инициализация Minecraft вкладки');
        
        // Проверяем статус сервера сразу
        checkMinecraftServer();
        
        // Устанавливаем интервал проверки каждую минуту
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
                console.log('🔙 Возврат на страницу, проверяем статус');
                checkMinecraftServer();
            }
        }
    });
    
    console.log('✅ Сайт успешно загружен!');
});
