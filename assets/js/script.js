function handleScroll() {
    var landingPage = document.getElementById('landing-page');
    if (!landingPage) {
        return;
    }
    var scrollThreshold = window.innerHeight * 1;
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

function renderThemeDropdown() {
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
        var formattedTheme = theme.charAt(0).toUpperCase() + theme.slice(1);
        themeLinksHTML += '<li><a class="dropdown-item" href="#all-collections-title" data-theme="' + theme + '">' + formattedTheme + '</a></li>';
    }
    themeListMenu.innerHTML = allCollectionsHTML + themeLinksHTML;
    var themeLinks = themeListMenu.querySelectorAll('.dropdown-item');
    for (var k = 0; k < themeLinks.length; k++) {
        themeLinks[k].onclick = function (event) {
            event.preventDefault(); 
            var selectedTheme = this.getAttribute('data-theme');
            if (selectedTheme === 'all') {
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
        var formattedTitle = selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1);
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
    var detailsText = item.pieces ? item.pieces : (item.medium || 'N/A');
    var detailsLabel = item.pieces ? 'Pieces: ' : 'Details: ';

    var cardHTML = '<div class="col-lg-3 col-md-6 mb-4" data-theme="' + item.theme + '">';
    cardHTML += '<div class="card collection-card h-100">';
    cardHTML += '<img src="' + item.image + '" class="card-img-top card-image-cover" alt="' + item.title + '" loading="lazy" ';
    cardHTML += 'onerror="this.onerror=null;this.src=\'https://placehold.co/400x300/CCCCCC/333333?text=Image+Error\'">';
    cardHTML += '<div class="card-body d-flex flex-column">';
    cardHTML += '<h5 class="card-title lego-title">' + item.title + '</h5>';
    cardHTML += '<p class="card-text"><small class="text-body-secondary lego-details">' + detailsLabel + detailsText + ' (' + item.year + ')</small></p>';
    cardHTML += '</div>';
    cardHTML += '</div>';
    cardHTML += '</div>';
    
    return cardHTML;
}

function renderGrid(containerId, legoList) {
    var gridContainer = document.getElementById(containerId);
    if (!gridContainer) {
        return;
    }
    if (legoList.length === 0) {
        gridContainer.innerHTML = '<p class="text-center text-secondary fst-italic">No collections to display.</p>';
        return;
    }

    legoList.sort(function (a, b) {
        if (a.title < b.title) { 
            return -1; 
        }
        if (a.title > b.title) { 
            return 1; 
        }
        return 0;
    });

    var cardsHTML = '';
    for (var i = 0; i < legoList.length; i++) {
        cardsHTML += createLegoCard(legoList[i]);
    }
    gridContainer.innerHTML = cardsHTML;
}

var LOGO_LIGHT = 'assets/img/logo_l.png';
var LOGO_DARK = 'assets/img/logo_d.png';

function applyTheme(theme) {
    var body = document.body;
    var isDark = theme == 'dark';
    var logoImg1 = document.getElementById('logo-img');
    var logoImg2 = document.getElementById('custom-logo-img');
    var themeIcon = document.getElementById('theme-icon');

    if (isDark) {
        body.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    
    var logoSrc = isDark ? LOGO_DARK : LOGO_LIGHT;
    if (logoImg1) {
        logoImg1.src = logoSrc;
    }
    if (logoImg2) {
        logoImg2.src = logoSrc;
    }
    if (themeIcon) {
        if (isDark) {
            themeIcon.classList.remove('fa-sun-o');
            themeIcon.classList.add('fa-moon-o');
        } else {
            themeIcon.classList.remove('fa-moon-o');
            themeIcon.classList.add('fa-sun-o');
        }
    }
}

function toggleTheme() {
    var currentTheme = localStorage.getItem('theme') || 'light';
    var newTheme = (currentTheme == 'light') ? 'dark' : 'light';
    applyTheme(newTheme);
}

window.onload = function () {
    var allLegos = getAllLegos();
    var savedTheme = localStorage.getItem('theme');
    var initialTheme = (savedTheme == 'dark') ? 'dark' : 'light';
    applyTheme(initialTheme); 
    renderThemeDropdown();
    window.addEventListener('scroll', handleScroll);

    var themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    var featuredLegos = allLegos.slice(0, 8);
    renderGrid('collections-grid', featuredLegos);
    renderGrid('all-collections-grid', allLegos);
    handleScroll();
};