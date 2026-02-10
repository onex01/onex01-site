// support.js - Функции для страницы поддержки
document.addEventListener('DOMContentLoaded', function() {
    initDonationPage();
    
    // Следим за переключением вкладок
    const tabButtons = document.querySelectorAll('.tab-button');
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const tabId = mutation.target.getAttribute('data-tab');
                if (tabId === 'support' && mutation.target.classList.contains('active')) {
                    // Небольшая задержка для гарантии загрузки DOM
                    setTimeout(initDonationPage, 50);
                }
            }
        });
    });
    
    // Начинаем наблюдение за всеми кнопками вкладок
    tabButtons.forEach(button => {
        observer.observe(button, { attributes: true });
    });
});

// Функция для копирования адресов для донатов
function initDonationPage() {
    // Убедимся, что страница поддержки существует
    const supportTab = document.getElementById('support');
    if (!supportTab) return;
    
    // Удаляем старые обработчики, чтобы избежать дублирования
    const copyButtons = document.querySelectorAll('.copy-donation');
    copyButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
    
    // Назначаем новые обработчики
    document.querySelectorAll('.copy-donation').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const address = this.getAttribute('data-address');
            if (address) {
                copyToClipboard(address);
                showNotification('Адрес скопирован в буфер обмена!', 'success');
            }
        });
    });
}

// Функция копирования в буфер обмена (добавляем если её нет)
function copyToClipboard(text) {
    // Пытаемся использовать modern API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Не удалось скопировать текст:', err);
        }
        
        document.body.removeChild(textArea);
    }
}

// Функция показа уведомлений (добавляем если её нет)
function showNotification(message, type = 'success') {
    // Проверяем, существует ли контейнер для уведомлений
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Иконка в зависимости от типа
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Удаляем уведомление через 4 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 4000);
}