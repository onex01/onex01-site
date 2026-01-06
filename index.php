<?php
/**
 * Простой редирект через HTML/JS для OneX01 Project
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OneX01 Project - Redirecting...</title>
    <style>
        body {
            background: #0a0a1a;
            color: #fff;
            font-family: 'Montserrat', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .loading {
            text-align: center;
        }
        .spinner {
            border: 5px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top: 5px solid #8a2be2;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loading">
        <div class="spinner"></div>
        <h2>Определяем язык...</h2>
        <p>Перенаправляем вас на нужную версию сайта</p>
    </div>

    <script>
    // Определяем язык
    function getBrowserLanguage() {
        const navLang = navigator.language || navigator.userLanguage;
        return navLang.startsWith('ru') ? 'ru' : 'en';
    }
    
    // Проверяем куки
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    // Определяем язык для редиректа
    let language = 'en'; // по умолчанию
    
    // 1. Проверяем параметр в URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && (urlLang === 'ru' || urlLang === 'en')) {
        language = urlLang;
        // Сохраняем в куки
        document.cookie = `site_lang=${language}; path=/; max-age=31536000`;
    } 
    // 2. Проверяем куки
    else if (getCookie('site_lang')) {
        language = getCookie('site_lang');
    }
    // 3. Определяем язык браузера
    else {
        language = getBrowserLanguage();
        document.cookie = `site_lang=${language}; path=/; max-age=31536000`;
    }
    
    // Редирект после небольшой задержки
    setTimeout(() => {
        window.location.href = `/${language}/`;
    }, 500);
    </script>
</body>
</html>