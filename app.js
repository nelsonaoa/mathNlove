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

// 開啟 GeoGebra 互動視窗（同步更新瀏覽器網址列）
function openGgbModal(item)
{
    const tagsHtml = getItemTags(item)
        .map(tag => `<span class="modal-unit-badge"># ${tag}</span>`)
        .join('');
    document.getElementById('modal-tags').innerHTML = tagsHtml;
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-desc').innerHTML = item.note;

    const ggbContainer = document.querySelector('.ggb-container');
    const ggbElement = document.getElementById('ggb-element');
    ggbElement.innerHTML = '';

    if(item.file)
    {
        ggbContainer.style.display = 'flex';
        const params = {
            "appName": "classic",
            "filename": `files/${item.file}`,
            "width": item.width || 1180,
            "height": item.height || 620,
            "showToolBar": false,
            "showAlgebraInput": false,
            "showMenuBar": false,
            "enableRightClick": false,
            "enableShiftDragZoom": item.allowZoom === true,
            "showResetIcon": true,
            "language": "zh-TW"
        };
        const applet = new GGBApplet(params, true);
        applet.inject('ggb-element');
    }
    else
    {
        ggbContainer.style.display = 'none';
    }

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

    // 將專屬代碼寫入網址列，方便直接複製分享
    const url = new URL(window.location);
    url.searchParams.set('open', getItemSlug(item));
    window.history.replaceState({}, '', url);

    modal.classList.add('open');
}

// 關閉互動視窗並還原網址列
function closeGgbModal()
{
    modal.classList.remove('open');
    document.getElementById('ggb-element').innerHTML = '';
    document.getElementById('modal-video-frame').src = '';

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