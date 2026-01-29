document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем текущий год
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = '2025-' + new Date().getFullYear();
    }
            
    // Элементы
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const downloadLink = document.getElementById('downloadLink');
    const downloadLinkGoogle = document.getElementById('downloadLinkGoogle');
            
    // Функция проверки всех чекбоксов
    function checkAllChecked() {
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
                
        if (allChecked) {
            // Включаем ссылку
            downloadLink.style.pointerEvents = 'auto';
            downloadLink.style.opacity = '1';
            downloadLink.innerHTML = '<i class="fas fa-download"></i><span>Download the Windows 10 build (5.97 GB)</span>';
            downloadLinkGoogle.style.pointerEvents = 'auto';
            downloadLinkGoogle.style.opacity = '1';
            downloadLinkGoogle.innerHTML = '<i class="fab fa-google-drive"></i><span>Download via Google Drive</span>';
                    
            // Добавляем обработчик
            downloadLink.onclick = function(e) {
                e.preventDefault();
                        
                // Финальное подтверждение
                const confirmed = confirm(
                    "FINAL CONFIRMATION\n\n" +
                    "You confirm that:\n" +
                    "• You are using the build for informational purposes ONLY\n" +
                    "• You have a legal Windows license\n" +
                    "• You will not use it on your work computers\n" +
                    "• You understand the risks\n\n" +
                    "Click OK to start downloading"
                );
                        
                if (confirmed) {
                    // Логируем согласие
                    console.log('✅ The user has agreed to the terms and conditions:', {
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent
                    });
                            
                    // Начинаем загрузку
                    window.location.href = '/shared/uploads/Windows10_home-pro_by.onex01.iso';
                }
            };

            downloadLinkGoogle.onclick = function(e) {
                e.preventDefault();
                        
                // Финальное подтверждение
                const confirmed = confirm(
                   "FINAL CONFIRMATION\n\n" +
                    "You confirm that:\n" +
                    "• You are using the build for informational purposes ONLY\n" +
                    "• You have a legal Windows license\n" +
                    "• You will not use it on your work computers\n" +
                    "• You understand the risks\n\n" +
                    "Click OK to start downloading"
                );
                        
                if (confirmed) {
                    // Логируем согласие
                    console.log('✅ The user has agreed to the terms and conditions:', {
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent
                    });
                            
                    // Начинаем загрузку
                    window.location.href = 'https://drive.google.com/file/d/19vKW169Qd4Idc6E_b2wFbTu2OzKxIE7k/view';
                }
            };

        } else {
            // Отключаем ссылку
            downloadLink.style.pointerEvents = 'none';
            downloadLink.style.opacity = '0.5';
            downloadLink.innerHTML = '<i class="fas fa-lock"></i><span>Accept all the conditions above</span>';
            downloadLink.onclick = null;
            downloadLinkGoogle.style.pointerEvents = 'none';
            downloadLinkGoogle.style.opacity = '0.5';
            downloadLinkGoogle.innerHTML = '<i class="fas fa-lock"></i><span>Accept all the conditions above</span>';
            downloadLinkGoogle.onclick = null;
        }
    }
            
    // Добавляем обработчики для чекбоксов
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkAllChecked);
    });
            
    // Запускаем проверку при загрузке
    checkAllChecked();
            
    // Показываем карточку с анимацией
    const card = document.querySelector('.card');
    if (card) {
        setTimeout(() => {
            card.classList.add('visible');
        }, 300);
    }
            
    // Показываем info-items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, 500 + (index * 100));
    });
});