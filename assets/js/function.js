function handleScroll() {
    var landingPage = document.getElementById('landing-page');
    if (!landingPage) {
        return;
    }
    var scrollThreshold = window.innerHeight * 0.9;
    if (window.scrollY > scrollThreshold) {
        landingPage.style.opacity = '0';
        landingPage.style.pointerEvents = 'none';
    } else {
        landingPage.style.opacity = '1';
        landingPage.style.pointerEvents = 'auto';
    }
}

function getAllLegos() {
    var allLegos = [];
    for (var themeName in LEGO) {
        if (LEGO.hasOwnProperty(themeName)) {
            var themeArray = LEGO[themeName];
            for (var i = 0; i < themeArray.length; i++) {
                allLegos.push(themeArray[i]);
            }}}
    return allLegos;
}

function themeDropdown() {
    var themeListMenu = document.getElementById('theme-list-menu');
    if (!themeListMenu) {
        return;
    }
    var allCollectionsHTML = '<li><a class="dropdown-item" href="#all-collections-title" data-theme="all">All Collections</a></li><li><hr class="dropdown-divider"></li>';
    var themeLinksHTML = '';
    var themes = [];
    for (var key in LEGO) {
        if (LEGO.hasOwnProperty(key)) {
            themes.push(key);
        }}
    themes.sort();
    for (var j = 0; j < themes.length; j++) {
        var theme = themes[j];
        var upperTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
        themeLinksHTML += '<li><a class="dropdown-item" href="#all-collections-title" data-theme="' + theme + '">' + upperTheme + '</a></li>';
    }
    themeListMenu.innerHTML = allCollectionsHTML + themeLinksHTML;
    var themeLinks = themeListMenu.querySelectorAll('.dropdown-item');
    for (var k = 0; k < themeLinks.length; k++) {
        themeLinks[k].onclick = function (event) {
            event.preventDefault(); 
            var selectedTheme = this.getAttribute('data-theme');
            if (selectedTheme == 'all') {
                handleThemeSelection(null);
            } else {
                handleThemeSelection(selectedTheme);
            }};
    }
}

function handleThemeSelection(selectedTheme) {
    var legosToDisplay = [];
    var titleElement = document.getElementById('all-collections-title');
    if (selectedTheme) {
        legosToDisplay = LEGO[selectedTheme] || []; 
        var formattedTitle = selectedTheme;
        titleElement.textContent = formattedTitle + ' COLLECTIONS';
    } else {
        legosToDisplay = getAllLegos();
        titleElement.textContent = 'ALL COLLECTIONS';
    }
    renderGrid('all-collections-grid', legosToDisplay);
    var allCollectionsSection = document.getElementById('all-collections-title');
    if (allCollectionsSection) {
        allCollectionsSection.scrollIntoView(); 
    }
}

function createLegoCard(item) {
    var cardHTML = `
        <div class="col-lg-3 col-md-6 mb-4" data-theme="${item.theme}">
            <div class="card collection-card h-100">
                <div class="image-aspect-ratio">
                    <img src="${item.image}" class="card-img-top card-image-cover" alt="${item.title}" loading="lazy">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title lego-title text-center fw-bold">${item.title}</h5>
                    <p class="card-text description-text mb-3">
                        <small class="text-body-dark">${item.description}</small>
                    </p>
                    <div class="mt-auto pt-2 border-top">
                        <div class="row text-center g-0">
                            <div class="col text-danger fw-bold" style="font-size: 1rem;">Item</div>
                            <div class="col text-danger fw-bold" style="font-size: 1rem;">Pieces</div>
                            <div class="col text-danger fw-bold" style="font-size: 1rem;">Year</div>
                        </div>
                        <div class="row text-center g-0 mt-1">
                            <div class="col">
                                <small class="text-body-dark">${item.item}</small>
                            </div>
                            <div class="col">
                                <small class="text-body-dark">${item.pieces}</small>
                            </div>
                            <div class="col">
                                <small class="text-body-dark">${item.year}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    return cardHTML;
}

function renderGrid(containerId, legoList) {
    var gridContainer = document.getElementById(containerId);
    if (!gridContainer) {
        return;
    }
    if (legoList.length == 0) {
        gridContainer.innerHTML = '<p class="text-center text-secondary fst-italic">No collections to display.</p>';
        return;
    }
    legoList.sort(function (a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    });
    var cardsHTML = '';
    for (var i = 0; i < legoList.length; i++) {
        cardsHTML += createLegoCard(legoList[i]);
    }
    gridContainer.innerHTML = cardsHTML;
}

function getLogoSrc(mode) {
    return mode == 'dark' ? 'assets/img/logo_d.png' : 'assets/img/logo_l.png';
}

function applyMode(mode) {
    var body = document.getElementById('body');
    var modeIcon = document.getElementById('theme-icon');
    body.setAttribute('data-bs-theme', mode);
    localStorage.setItem('mode', mode);
    var logoSrc = getLogoSrc(mode);
    var logoImgs = document.querySelectorAll('.custom-logo');
    for (var i = 0; i < logoImgs.length; i++) {
        logoImgs[i].src = logoSrc;
    }
    if (modeIcon) {
        if (mode === 'dark') {
            modeIcon.className = 'fa fa-moon-o';
        } else {
            modeIcon.className = 'fa fa-sun-o';
        }
    }
}

function toggleMode() {
    var currentMode = localStorage.getItem('mode') || 'light';
    var newMode = (currentMode == 'light') ? 'dark' : 'light';
    applyMode(newMode);
}

window.onload = function () {
    var allLegos = getAllLegos();
    var savedMode = localStorage.getItem('mode');
    var initialMode = (savedMode === 'dark') ? 'dark' : 'light';
    applyMode(initialMode);
    themeDropdown();
    window.addEventListener('scroll', handleScroll);
    var themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleMode);
    }
    var featuredLegos = allLegos.slice(0, 4);
    renderGrid('collections-grid', featuredLegos);
    renderGrid('all-collections-grid', allLegos);
    handleScroll();
};