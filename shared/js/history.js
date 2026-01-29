const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = '2025-' + new Date().getFullYear();
}

// JS для анимаций и перехода
const sections = document.querySelectorAll('.section');
const header = document.getElementById('header');
const title = document.getElementById('title');
const body = document.body;
const footer = document.getElementById('footer');
const transitionPoint = document.getElementById('transition-point');
let smokeInitialized = false;

// Observer для появления секций
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target === transitionPoint && !smokeInitialized) {
                // Переход на новый фон
                body.classList.add('new-bg');
                // Если initSmokeAnimation уже запущена из background.js, просто показываем canvas
                // Если нет - вызываем явно (но по твоему файлу она запускается сразу, так что убираем повторный вызов)
                smokeInitialized = true;
            }
            if (entry.target === sections[sections.length - 1]) {
                footer.classList.add('visible');
            }
        }
    });
}, { threshold: 0.15 });

sections.forEach(section => observer.observe(section));
observer.observe(footer);