/**
 * 高德地图初始化与标记点功能
 */

// 高德地图配置 - 替换成你自己的Key
const AMAP_CONFIG = {
    key: "43489c29de8c00df607a699f4ca86687",      // 必填：从高德开放平台获取key
    securityCode: "	00bc20f7c1703121e126da5b237617b0",     // 必填：和Key对应的密钥
    version: "2.0"                  // API版本
};

// 设置安全密钥（高德2.0版本需要）
window._AMapSecurityConfig = {
    securityJsCode: AMAP_CONFIG.securityCode
};

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 加载高德地图
    AMapLoader.load({
        key: AMAP_CONFIG.key,        // 申请好的Web端开发者Key
        version: AMAP_CONFIG.version, // 指定要加载的JS API版本
    }).then((AMap) => {
        // 初始化地图
        const map = new AMap.Map('map-container', {
            zoom: 5,                  // 初始缩放级别（全国范围）
            center: [108.0, 35.0],    // 初始中心点（中国中部）
            viewMode: '2D',            // 地图模式
            resizeEnable: true         // 自动适应容器大小变化
        });

        // 存储所有标记点
        const markers = [];

        // 循环添加标记点
        museums.forEach((museum, index) => {
            // 创建标记点
            const marker = new AMap.Marker({
                position: museum.position,  // 经纬度
                title: museum.name,         // 鼠标悬停显示的名称
                map: map,
                // 可选：自定义图标样式
                // icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
            });

            // 创建信息窗体内容（HTML格式）
            const infoContent = createInfoWindowContent(museum);
            
            // 创建信息窗体
            const infoWindow = new AMap.InfoWindow({
                content: infoContent,       // 信息窗体内容
                offset: new AMap.Pixel(0, -30), // 偏移量，使信息窗体显示在标记上方
                closeWhenClickMap: true,     // 点击地图关闭信息窗体
                isCustom: true               // 使用自定义样式
            });

            // 为标记点添加点击事件
            marker.on('click', function(e) {
                infoWindow.open(map, marker.getPosition());
            });

            markers.push(marker);
        });

        // 调整地图视野以最佳显示所有标记
        if (markers.length > 0) {
            map.setFitView(markers);  // 自动调整缩放级别，显示所有标记点
        }

        console.log('地图初始化完成，共加载', markers.length, '个博物馆标记');
    }).catch(e => {
        console.error('高德地图加载失败:', e);
        alert('地图加载失败，请检查网络或API Key配置');
    });
});

/**
 * 创建信息窗体的HTML内容
 * @param {Object} museum 博物馆数据
 * @returns {string} HTML字符串
 */
function createInfoWindowContent(museum) {
    // 处理电话显示（如果有电话，显示可点击链接）
    const phoneHtml = museum.phone 
        ? `<a href="tel:${museum.phone}" class="info-phone">${museum.phone}</a>`
        : '暂无';

    // 处理图片（如果没有图片，显示默认占位图）
    const imageHtml = museum.image
        ? `<img src="${museum.image}" alt="${museum.name}" class="info-image" onerror="this.src='https://via.placeholder.com/300x200?text=暂无图片'">`
        : `<div class="info-image" style="background:#f0f0f0; display:flex; align-items:center; justify-content:center; color:#999;">暂无图片</div>`;

    // 返回完整的HTML结构
    return `
        <div class="custom-info-window">
            <div class="info-close" onclick="closeInfoWindow()">✕</div>
            ${imageHtml}
            <div class="info-content">
                <div class="info-title">${museum.name}</div>
                <div class="info-detail">
                    <span class="info-icon">📍</span>
                    <span class="info-text"><strong>地址：</strong>${museum.address}</span>
                </div>
                <div class="info-detail">
                    <span class="info-icon">🕒</span>
                    <span class="info-text"><strong>开馆时间：</strong>${museum.openingHours}</span>
                </div>
                <div class="info-detail">
                    <span class="info-icon">📞</span>
                    <span class="info-text"><strong>电话：</strong>${phoneHtml}</span>
                </div>
                ${museum.description ? `
                <div class="info-detail">
                    <span class="info-icon">📝</span>
                    <span class="info-text"><strong>简介：</strong>${museum.description}</span>
                </div>` : ''}
            </div>
        </div>
    `;
}

/**
 * 关闭信息窗体的全局函数
 */
window.closeInfoWindow = function() {
    // 这个函数会被信息窗体的关闭按钮调用
    // 但实际关闭操作由AMap自动处理，这里留空或可以触发地图的clearInfoWindow
    if (window.currentMap) {
        window.currentMap.clearInfoWindow();
    }
};