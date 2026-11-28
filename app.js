const simGrid = document.getElementById('sim-grid');
const tagButtons = document.querySelectorAll('#tag-nav button');
const modal = document.getElementById('ggb-modal');
const closeModalBtn = document.getElementById('close-modal');

// 取得標籤陣列
function getItemTags(item)
{
    return Array.isArray(item.tags) ? item.tags : [];
}

// 產生每筆資料的專屬網址代碼（優先取 .ggb 檔名，純影片則取標題）
function getItemSlug(item)
{
    if(item.file)
    {
        return item.file.replace(/\.ggb$/i, '');
    }
    return item.title;
}

// 自動讀取 .ggb 內部 XML 偵測原始設計寬高（優先讀取 perspective 真實視窗配置 + 最小寬度保底）
async function detectGgbSize(filePath)
{
    try
    {
        const response = await fetch(filePath);
        const buffer = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(buffer);
        const xmlFile = zip.file('geogebra.xml');
        if(!xmlFile)
        {
            return { width: 1100, height: 620 };
        }

        const xmlText = await xmlFile.async('text');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        let totalWidth = 0;
        let maxHeight = 0;

        // 1. 優先讀取 <perspective> 中 visible="true" 的視圖真實寬高（對 3D 視圖最準確）
        const perspectiveViews = xmlDoc.querySelectorAll('perspective > views > view[visible="true"]');
        if(perspectiveViews.length > 0)
        {
            perspectiveViews.forEach(v => {
                const id = v.getAttribute('id');
                // id=1(繪圖區1), id=2(繪圖區2), id=512(3D繪圖區)
                if(id === '1' || id === '2' || id === '512')
                {
                    const w = parseInt(v.getAttribute('width'), 10) || 0;
                    const h = parseInt(v.getAttribute('height'), 10) || 0;
                    totalWidth += w;
                    if(h > maxHeight)
                    {
                        maxHeight = h;
                    }
                }
            });
        }

        // 2. 若 perspective 無資料，退回讀取 euclidianView / euclidianView3D 的 <size>
        if(totalWidth < 100)
        {
            const views = xmlDoc.querySelectorAll('euclidianView, euclidianView3D');
            views.forEach(view => {
                const sizeNode = view.querySelector('size');
                if(sizeNode)
                {
                    const w = parseInt(sizeNode.getAttribute('width'), 10) || 0;
                    const h = parseInt(sizeNode.getAttribute('height'), 10) || 0;
                    totalWidth += w;
                    if(h > maxHeight)
                    {
                        maxHeight = h;
                    }
                }
            });
        }

        // 3. 最小安全寬度保底：避免 3D 檔案未寫入寬度時被壓縮成細條
        const safeWidth = totalWidth >= 800 ? totalWidth : 1100;
        const safeHeight = maxHeight >= 450 ? maxHeight : 620;

        return { width: safeWidth, height: safeHeight };
    }
    catch(err)
    {
        return { width: 1100, height: 620 };
    }
}

// 渲染卡片清單
function renderCards(filterTag = 'all')
{
    simGrid.innerHTML = '';
    const filtered = filterTag === 'all'
        ? ggbCatalog
        : ggbCatalog.filter(item => getItemTags(item).includes(filterTag));

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'sim-card';
        const tagsHtml = getItemTags(item)
            .map(tag => `<span class="unit-badge"># ${tag}</span>`)
            .join('');

        card.innerHTML = `
            <div>
                <div class="card-top">${tagsHtml}</div>
                <h3>${item.title}</h3>
                <p>${item.note}</p>
            </div>
            <div class="card-footer">
                <span>${item.file ? '開啟互動操作' : '觀看教學影片'}</span>
                <span class="arrow">→</span>
            </div>
        `;

        card.addEventListener('click', () => openGgbModal(item));
        simGrid.appendChild(card);
    });
}

// 輔助函式：將一般 YouTube 網址轉成 embed 嵌入網址
function getYoutubeEmbedUrl(url)
{
    if(!url)
    {
        return '';
    }
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?\/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

// 開啟 GeoGebra 互動視窗（自動偵測 GGB 尺寸 + 同步更新網址列）
async function openGgbModal(item)
{
    const tagsHtml = getItemTags(item)
        .map(tag => `<span class="modal-unit-badge"># ${tag}</span>`)
        .join('');
    document.getElementById('modal-tags').innerHTML = tagsHtml;
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-desc').innerHTML = item.note;
    document.title = `${item.title} - 愛的數學你我他`;

    const ggbContainer = document.querySelector('.ggb-container');
    const ggbElement = document.getElementById('ggb-element');
    ggbElement.innerHTML = '';
    ggbElement.style.zoom = '';

    // 處理 YouTube 影片
    const videoBox = document.getElementById('modal-video-box');
    const videoFrame = document.getElementById('modal-video-frame');
    if(item.youtube)
    {
        videoBox.style.display = 'block';
        videoFrame.src = getYoutubeEmbedUrl(item.youtube);
    }
    else
    {
        videoBox.style.display = 'none';
        videoFrame.src = '';
    }

    // 更新網址列與開啟視窗
    const url = new URL(window.location);
    url.searchParams.set('open', getItemSlug(item));
    window.history.replaceState({}, '', url);
    modal.classList.add('open');

    // 處理 GeoGebra 畫布
    if(item.file)
    {
        ggbContainer.style.display = 'flex';
        const filePath = `files/${item.file}`;

        // 若 catalog.js 沒手動指定寬高，就自動從 .ggb 檔偵測真實尺寸
        let rawWidth = item.width;
        let rawHeight = item.height;
        if(!rawWidth || !rawHeight)
        {
            const detected = await detectGgbSize(filePath);
            rawWidth = rawWidth || detected.width;
            rawHeight = rawHeight || detected.height;
        }

        // 若螢幕（如平板）比 GGB 原始寬度窄，則等比例縮小至剛好貼齊容器寬度；電腦夠寬則維持原始 1:1 大小
        const containerWidth = ggbContainer.clientWidth || 1280;
        const renderWidth = Math.min(rawWidth, containerWidth);
        const renderHeight = Math.round(renderWidth * (rawHeight / rawWidth));

        const params = {
            "appName": "classic",
            "filename": filePath,
            "width": renderWidth,
            "height": renderHeight,
            "scale": renderWidth / rawWidth,
            "showToolBar": false,
            "showAlgebraInput": false,
            "showMenuBar": false,
            "enableRightClick": false,
            "enableShiftDragZoom": item.allowZoom === true,
            "showResetIcon": true,
            "language": "zh-TW",
            "appletOnLoad": function(api)
            {
                if(typeof api.recalculateEnvironments === 'function')
                {
                    api.recalculateEnvironments();
                }
                if(item.allowZoom === true)
                {
                    api.setMode(0);
                }
                
            }
        };
        const applet = new GGBApplet(params, true);
        applet.inject('ggb-element');
    }
    else
    {
        ggbContainer.style.display = 'none';
    }
}

// 關閉互動視窗並還原網址列
function closeGgbModal()
{
    modal.classList.remove('open');
    document.getElementById('ggb-element').innerHTML = '';
    document.getElementById('modal-video-frame').src = '';
    document.title = '愛的數學你我他 - 互動數學實驗室';

    const url = new URL(window.location);
    url.searchParams.delete('open');
    window.history.replaceState({}, '', url);
}

closeModalBtn.addEventListener('click', closeGgbModal);

modal.addEventListener('click', (e) => {
    if(e.target === modal)
    {
        closeGgbModal();
    }
});

tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tagButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCards(btn.getAttribute('data-tag'));
    });
});

// 初始化卡片列表
renderCards('all');

// 檢查網址是否帶有 ?open=xxx 參數，若有則自動打開對應視窗
const initialOpenSlug = new URLSearchParams(window.location.search).get('open');
if(initialOpenSlug)
{
    const targetItem = ggbCatalog.find(item => getItemSlug(item) === initialOpenSlug);
    if(targetItem)
    {
        openGgbModal(targetItem);
    }
}
