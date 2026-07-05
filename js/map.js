/**
 * 高德地图初始化与标记点功能
 * 支持中英文切换 - 与 i18n.js 配合
 */

// 高德地图配置 - 替换成你自己的Key
const AMAP_CONFIG = {
    key: "43489c29de8c00df607a699f4ca86687",
    securityCode: "00bc20f7c1703121e126da5b237617b0",
    version: "2.0"
};

// 设置安全密钥
window._AMapSecurityConfig = {
    securityJsCode: AMAP_CONFIG.securityCode
};

// ===== 全局变量 =====
let map = null;
let infoWindow = null;
let markers = [];
let currentOpenMarker = null;
let AMapInstance = null;

// ===== DOM 加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    // 加载高德地图
    AMapLoader.load({
        key: AMAP_CONFIG.key,
        version: AMAP_CONFIG.version,
    }).then((AMap) => {
        AMapInstance = AMap;
        
        // 初始化地图
        map = new AMap.Map('map-container', {
            zoom: 5,
            center: [108.0, 35.0],
            viewMode: '2D',
            resizeEnable: true
        });

        // 添加标记点
        addMarkers(AMap);

        // 调整地图视野显示所有标记
        if (markers.length > 0) {
            map.setFitView(markers);
        }

        // 更新统计信息
        updateStats();

        console.log('🗺️ 地图初始化完成，共加载', markers.length, '个博物馆标记');
        console.log('🌐 当前语言:', i18n.currentLang);
    }).catch(e => {
        console.error('高德地图加载失败:', e);
        alert(t('common.error'));
    });
});

// ===== 添加标记点 =====
function addMarkers(AMap) {
    markers = [];

    museums.forEach((museum, index) => {
        // 创建标记点
        const marker = new AMap.Marker({
            position: museum.position,
            title: museum.name,
            map: map,
            // 可以自定义图标
            // icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
        });

        // 存储博物馆数据到标记
        marker._museumData = museum;
        marker._index = index;

        // 为标记点添加点击事件
        marker.on('click', function(e) {
            openInfoWindow(marker);
        });

        markers.push(marker);
    });
}

// ===== 打开信息窗体 =====
function openInfoWindow(marker) {
    const museum = marker._museumData;
    
    if (!AMapInstance) return;

    // 如果已经有打开的信息窗体，先关闭
    if (infoWindow) {
        infoWindow.close();
    }

    // 创建信息窗体内容
    const content = createInfoWindowContent(museum);
    
    // 创建信息窗体
    infoWindow = new AMapInstance.InfoWindow({
        content: content,
        offset: new AMapInstance.Pixel(0, -30),
        closeWhenClickMap: true,
        isCustom: true
    });

    // 存储当前打开的标记
    currentOpenMarker = marker;

    // 打开信息窗体
    infoWindow.open(map, marker.getPosition());

    // 监听信息窗体关闭事件
    infoWindow.on('close', function() {
        currentOpenMarker = null;
    });
}

// ===== 刷新已打开的信息窗体（语言切换时调用） =====
window.refreshInfoWindows = function() {
    if (currentOpenMarker && infoWindow && AMapInstance) {
        const museum = currentOpenMarker._museumData;
        const newContent = createInfoWindowContent(museum);
        infoWindow.setContent(newContent);
        console.log('🔄 信息窗体已刷新，当前语言:', i18n.currentLang);
    }
};

// ===== 创建信息窗体的HTML内容（支持多语言） =====
function createInfoWindowContent(museum) {
    // 获取翻译
    const addressLabel = t('info.address');
    const hoursLabel = t('info.hours');
    const phoneLabel = t('info.phone');
    const descLabel = t('info.description');
    const noImageText = t('info.noImage');
    const phoneUnavailable = t('info.phoneUnavailable');

    // 处理电话
    const phoneHtml = museum.phone 
        ? `<a href="tel:${museum.phone}" class="info-phone">${museum.phone}</a>`
        : phoneUnavailable;

    // 处理图片
    const imageHtml = museum.image
        ? `<img src="${museum.image}" alt="${museum.name}" class="info-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2216%22%3E${noImageText}%3C/text%3E%3C/svg%3E'">`
        : `<div class="info-image-placeholder">${noImageText}</div>`;

    return `
        <div class="custom-info-window">
            <div class="info-close" onclick="closeInfoWindow()">✕</div>
            ${imageHtml}
            <div class="info-content">
                <div class="info-title">${museum.name}</div>
                <div class="info-detail">
                    <span class="info-icon">📍</span>
                    <span class="info-text"><strong>${addressLabel}：</strong>${museum.address}</span>
                </div>
                <div class="info-detail">
                    <span class="info-icon">🕒</span>
                    <span class="info-text"><strong>${hoursLabel}：</strong>${museum.openingHours}</span>
                </div>
                <div class="info-detail">
                    <span class="info-icon">📞</span>
                    <span class="info-text"><strong>${phoneLabel}：</strong>${phoneHtml}</span>
                </div>
                ${museum.description ? `
                <div class="info-detail">
                    <span class="info-icon">📝</span>
                    <span class="info-text"><strong>${descLabel}：</strong>${museum.description}</span>
                </div>` : ''}
            </div>
        </div>
    `;
}

// ===== 关闭信息窗体 =====
window.closeInfoWindow = function() {
    if (infoWindow) {
        infoWindow.close();
        currentOpenMarker = null;
    }
};

// ===== 更新统计信息 =====
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

// ===== 监听语言变化（由 i18n.js 触发） =====
document.addEventListener('languageChanged', function(e) {
    const lang = e.detail && e.detail.lang ? e.detail.lang : i18n.currentLang;
    console.log('🗺️ 地图收到语言切换通知:', lang);
    
    // 更新统计信息
    updateStats();
    
    // 刷新已打开的信息窗体
    if (window.refreshInfoWindows) {
        window.refreshInfoWindows();
    }
});

// ===== 导出供其他模块使用 =====
window.mapInstance = {
    getMap: () => map,
    getMarkers: () => markers,
    refreshInfoWindows: window.refreshInfoWindows,
    closeInfoWindow: window.closeInfoWindow
};
