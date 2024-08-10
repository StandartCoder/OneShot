import { getCache, setCache } from '../utils/cache.js';
import { getCurrentLang, getLangData, listLangs } from '../utils/lang.js';

export function initializeEventHandlers() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    const homeIcon = document.getElementById('homeIcon');
    homeIcon.addEventListener('click', () => handleHomeIconClick(tabs, contents));

    const settingsIcon = document.getElementById('settingsIcon');
    settingsIcon.addEventListener('click', () => handleIconClick('paneSettings', tabs, contents, false));

    tabs.forEach(tab => {
        tab.addEventListener('click', () => handleTabClick(tab, tabs, contents));
    });

    const presetSelect = document.getElementById('presetSelect');
    const rephraseCheckbox = document.getElementById('rephraseCheckbox');

    presetSelect.addEventListener('change', () => {
        const selectedPreset = presetSelect.value;
        const cache = getCache();
        cache.lastPreset = selectedPreset;
        setCache(cache);
    });

    rephraseCheckbox.addEventListener('change', () => {
        const cache = getCache();
        cache.rephrase = rephraseCheckbox.checked;
        setCache(cache);
    });

    setTimeout(async () => {
        await initializeContent(tabs, contents);
    }, 750);
}

function handleHomeIconClick(tabs, contents) {
    handleIconClick('paneHome', tabs, contents, true);
}

function handleIconClick(targetPaneId, tabs, contents, updateCache = true) {
    tabs.forEach(t => t.classList.remove('active'));

    fadeOutActiveContent(contents, () => {
        showTargetPane(targetPaneId, contents);

        if (updateCache) {
            const cache = getCache();
            cache.lastPane = targetPaneId === 'paneHome' ? null : targetPaneId;
            setCache(cache);
        }
    });
}

function handleTabClick(tab, tabs, contents) {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    fadeOutActiveContent(contents, () => {
        showTargetPane(tab.dataset.tab, contents);

        const cache = getCache();
        cache.lastPane = tab.dataset.tab;
        setCache(cache);
    });
}

function fadeOutActiveContent(contents, callback) {
    const activeContent = document.querySelector('.content.active');
    if (activeContent) {
        activeContent.style.opacity = '0';
        activeContent.style.transform = 'translateY(20px)';
        setTimeout(() => {
            activeContent.style.display = 'none';
            activeContent.classList.remove('active');
            if (callback) callback();
        }, 300);
    } else {
        if (callback) callback();
    }
}

function showTargetPane(targetPaneId, contents) {
    const targetContent = document.getElementById(targetPaneId);
    if (targetContent) {
        targetContent.style.display = 'block';
        setTimeout(() => {
            targetContent.classList.add('active');
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateY(0)';
        }, 50);
    }
}

async function initializeContent(tabs, contents) {
    const url = await getCurrentTabUrl();
    const checkIfOnRightSite = url.includes('ihk.de');

    if (!checkIfOnRightSite) {
        document.getElementById('content').innerHTML = `<h1 id="wrong">{wrong}</h1>`;
    }

    const lang = getCurrentLang();
    const langData = await getLangData(lang);

    Object.keys(langData).forEach((key) => {
        const element = document.getElementById(key);
        if (element) {
            element.innerText = langData[key];
        }
    });

    if (checkIfOnRightSite) {
        const langSelect = document.getElementById('languageSelect');
        const langs = await listLangs();

        langs.forEach( async (tLang) => {
            const langDataOfLang = await getLangData(tLang);
            const option = document.createElement('option');
            option.value = tLang;
            option.id = tLang;
            option.innerText = langDataOfLang['name'];
            langSelect.appendChild(option);

            if (lang === tLang)
                option.selected = true;
        });
    }

    const cache = getCache();
    if (checkIfOnRightSite && cache.lastPane) {
        const homePane = document.getElementById('paneHome');
        homePane.classList.remove('active');
        homePane.style.display = 'none';

        showTargetPane(cache.lastPane, contents);

        tabs.forEach(tab => {
            if (tab.dataset.tab === cache.lastPane) {
                tab.classList.add('active');
            }
        });
    } else {
        showTargetPane('paneHome', contents);
    }

    if (checkIfOnRightSite && cache.lastPreset)
        document.getElementById(cache.lastPreset).selected = true;

    if (checkIfOnRightSite && cache.rephrase)
        document.getElementById("rephraseCheckbox").checked = true;

    document.getElementById('loaderOverlay').classList.remove('active');
}

function getCurrentTabUrl() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                resolve(tabs[0].url);
            } else {
                resolve(null);
            }
        });
    });
}