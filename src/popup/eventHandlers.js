import { getCache, setCache } from '../utils/cache.js';
import { getCurrentLang, getLangData } from '../utils/lang.js';

export function initializeEventHandlers() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    const homeIcon = document.getElementById('homeIcon');
    homeIcon.addEventListener('click', handleHomeIconClick);

    const settingsIcon = document.getElementById('settingsIcon');
    settingsIcon.addEventListener('click', handleSettingsIconClick);

    tabs.forEach(tab => {
        tab.addEventListener('click', () => handleTabClick(tab, tabs, contents));
    });

    setTimeout(async () => {
        await initializeContent(tabs, contents);
    }, 750);
}

function handleHomeIconClick() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    const cache = getCache();
    cache.lastPane = null;
    setCache(cache);

    document.getElementById('paneHome').classList.add('active');
}

function handleSettingsIconClick() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    document.getElementById('paneSettings').classList.add('active');
}

function handleTabClick(tab, tabs, contents) {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    contents.forEach(content => {
        content.classList.remove('active');
        if(content.id === tab.dataset.tab) {
            content.classList.add('active');

            let cache = getCache();
            cache.lastPane = tab.dataset.tab;
            setCache(cache);
        }
    });

    document.getElementById('settingsPage').classList.remove('active');
}

async function initializeContent(tabs, contents) {
    let checkIfOnRightSite = false;

    const url = await getCurrentTabUrl();
    checkIfOnRightSite = url.includes('ihk.de');

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

    const cache = getCache(); let tab;
    if (cache.lastPane) {
        if (cache.lastPane === 'panePreset') {
            tab = tabs[0];
        }

        if (cache.lastPane === 'paneCopyPaste') {
            tab = tabs[1];
        }

        if (cache.lastPane === 'paneMore') {
            tab = tabs[2];
        }

        tab.classList.add('active');
        contents.forEach(content => {
            content.classList.remove('active');
            if(content.id === tab.dataset.tab) {
                content.classList.add('active');
            }
        });
    }

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