function handleScroll() {
    const landingPage = document.getElementById('landing-page');
    if (!landingPage) return;

    const scrollThreshold = window.innerHeight * 1;

    if (window.scrollY > scrollThreshold) {
        landingPage.style.opacity = '0';
        landingPage.style.pointerEvents = 'none';
    } else {
        landingPage.style.opacity = '1';
        landingPage.style.pointerEvents = 'auto';
    }
}

function getAllLegos() {
    const allLegos = [];
    for (const themeName in LEGO) {
        if (Object.prototype.hasOwnProperty.call(LEGO, themeName)) {
            const themeArray = LEGO[themeName];
            for (let i = 0; i < themeArray.length; i++) {
                allLegos.push(themeArray[i]);
            }
        }
    }
    return allLegos;
}

function createLegoCard(item) {
    const detailsText = item.pieces ? item.pieces : (item.medium || 'N/A');
    const detailsLabel = item.pieces ? 'Pieces: ' : 'Details: ';

    return `
        <div class="col-lg-3 col-md-6 mb-4" data-theme="${item.theme}">
            <div class="card collection-card h-100">
                <img src="${item.image}" class="card-img-top card-image-cover" alt="${item.title}" loading="lazy" 
                     onerror="this.onerror=null;this.src='https://placehold.co/400x300/CCCCCC/333333?text=Image+Error'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title lego-title" style="color: #CC0000;">${item.title}</h5>
                    <p class="card-text"><small class="text-body-secondary lego-details">${detailsLabel}${detailsText} (${item.year})</small></p>
                    </div>
            </div>
        </div>
    `;
}

function renderGrid(containerId, legoList) {
    const gridContainer = document.getElementById(containerId);
    if (!gridContainer) return;

    if (legoList.length === 0) {
        gridContainer.innerHTML = '<p class="text-center text-secondary fst-italic">No collections to display.</p>';
        return;
    }

    legoList.sort(function (a, b) {
        if (a.title < b.title) { return -1; }
        if (a.title > b.title) { return 1; }
        return 0;
    });

    let cardsHTML = '';
    for (let i = 0; i < legoList.length; i++) {
        cardsHTML += createLegoCard(legoList[i]);
    }

    gridContainer.innerHTML = cardsHTML;
}

window.addEventListener('load', function () {
    const allLegos = getAllLegos();

    window.addEventListener('scroll', handleScroll);

    const featuredLegos = allLegos.slice(0, 6);
    
    renderGrid('collections-grid', featuredLegos);
    renderGrid('all-collections-grid', allLegos);

    handleScroll();
});