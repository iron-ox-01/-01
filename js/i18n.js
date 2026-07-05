/**
 * 国际化 (i18n) 配置
 * 与主站共享语言状态，通过 URL 参数或 localStorage 同步
 */

const i18n = {
    currentLang: 'zh',
    translations: {
        zh: {
            'map.title': '非遗地图 · 博物馆',
            'map.headerTitle': '🗺️ 非遗地图',
            'map.headerSub': '探索非遗地标与博物馆',
            'map.stats': '📍 共 {count} 个博物馆地标',
            'info.address': '地址',
            'info.hours': '开馆时间',
            'info.phone': '电话',
            'info.description': '简介',
            'info.noImage': '暂无图片',
            'info.phoneUnavailable': '暂无',
            'common.loading': '加载中...',
            'common.error': '加载失败，请检查网络或API Key配置',
        },
        en: {
            'map.title': 'ICH Map · Museums',
            'map.headerTitle': '🗺️ ICH Map',
            'map.headerSub': 'Explore Intangible Cultural Heritage Sites & Museums',
            'map.stats': '📍 {count} museum landmarks',
            'info.address': 'Address',
            'info.hours': 'Opening Hours',
            'info.phone': 'Phone',
            'info.description': 'Description',
            'info.noImage': 'No Image',
            'info.phoneUnavailable': 'N/A',
            'common.loading': 'Loading...',
            'common.error': 'Failed to load map. Please check your network or API Key.',
        }
    }
};

/**
 * 获取当前语言的翻译文本
 */
function t(key, params = {}) {
    const lang = i18n.currentLang;
    const translation = i18n.translations[lang]?.[key] || i18n.translations['zh'][key] || key;
    let result = translation;
    for (const [k, v] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return result;
}

/**
 * 从主站获取语言设置
 * 优先级：URL参数 > localStorage > 浏览器语言 > 默认中文
 */
function getLanguageFromParent() {
    // 1. 检查 URL 参数 ?lang=en 或 ?lang=zh
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang === 'en' || urlLang === 'zh') {
        return urlLang;
    }

    // 2. 检查 localStorage（主站和子站共用）
    const savedLang = localStorage.getItem('preferred_language') || localStorage.getItem('lang');
    if (savedLang === 'en' || savedLang === 'zh') {
        return savedLang;
    }

    // 3. 检查浏览器语言
    const browserLang = navigator.language.startsWith('en') ? 'en' : 'zh';
    return browserLang;
}

/**
 * 应用语言到页面
 */
function applyLanguage(lang) {
    i18n.currentLang = lang;
    
    // 更新所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = t(key);
        if (translation) {
            el.textContent = translation;
        }
    });
    
    // 更新统计信息
    updateStats();
    
    // 更新页面 lang 属性
    document.documentElement.lang = lang;
    
    // 如果有地图信息窗体打开，需要刷新内容
    if (window.refreshInfoWindows) {
        window.refreshInfoWindows();
    }
}

/**
 * 更新统计信息
 */
function updateStats() {
    const count = typeof museums !== 'undefined' ? museums.length : 0;
    const statsEl = document.getElementById('mapStats');
    if (statsEl) {
        const translation = t('map.stats', { count: count });
        statsEl.innerHTML = translation;
    }
    const countEl = document.getElementById('museumCount');
    if (countEl) {
        countEl.textContent = count;
    }
}

/**
 * 监听主站语言变化（通过 postMessage 或 storage 事件）
 */
function listenToParentLanguageChange() {
    // 方式1：监听 localStorage 变化（主站切换语言时修改 localStorage）
    window.addEventListener('storage', function(e) {
        if (e.key === 'preferred_language' || e.key === 'lang') {
            const newLang = e.newValue;
            if (newLang === 'en' || newLang === 'zh') {
                applyLanguage(newLang);
            }
        }
    });

    // 方式2：监听 postMessage（如果主站通过 iframe 通信）
    window.addEventListener('message', function(e) {
        // 可以设置允许的 origin 以提高安全性
        // if (e.origin !== 'https://你的主站域名.com') return;
        
        if (e.data && e.data.type === 'languageChange' && e.data.lang) {
            const newLang = e.data.lang;
            if (newLang === 'en' || newLang === 'zh') {
                applyLanguage(newLang);
            }
        }
    });
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取语言并应用
    const lang = getLanguageFromParent();
    applyLanguage(lang);
    
    // 监听语言变化
    listenToParentLanguageChange();
    
    console.log('🌐 当前语言:', i18n.currentLang);
});