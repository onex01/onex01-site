// ==================== MINECRAFT СЕРВЕР ====================
let minecraftCheckInterval;
const serverAddress = 'onex01.ddns.net';
const serverAddressWithoutPort = serverAddress;
let isChecking = false;

// Функция для обновления времени последней проверки
function updateLastCheckedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-EN', {
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

        console.log('📡 API Request:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 API response:', data);

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
        console.error('❌ rror checking the server:', error);

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
            manualRefreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить статус сейчас';
            manualRefreshButton.disabled = false;
        }
    }
}