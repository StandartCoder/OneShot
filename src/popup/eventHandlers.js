import { getCache, setCache } from '../utils/cache.js';
import { getCurrentLang, getLangData, listLangs } from '../utils/lang.js';
import { getSettings, setSettings } from '../utils/settings.js';
import { encryptPassword, decryptPassword } from '../utils/crypto.js';

export function initializeEventHandlers() {
    const appIcon = document.getElementById('appIcon');
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

    const langSelect = document.getElementById('languageSelect');
    langSelect.addEventListener('change', async () => {
        const selectedLang = langSelect.value;
        const set = getSettings();
        set.language = selectedLang;
        setSettings(set);

        const lang = getCurrentLang();
        const langData = await getLangData(lang);

        Object.keys(langData).forEach( async (key) => {
            const element = document.getElementById(key);
            if (element) {
                element.innerText = langData[key];
            }
        });

        location.reload();
    });

    const accountButton = document.getElementById('accountButton');
    accountButton.addEventListener('click', async () => {
        const cLang = getCurrentLang();
        const langData = await getLangData(cLang);

        document.getElementById('modalInputMail').value = getSettings().email;
        document.getElementById('modalOverlay').classList.add('active');

        document.getElementById('togglePassword').innerHTML = '🙈';
        document.getElementById('modalInputPassword').type = 'password';

        if (getSettings().password != '') {
            let passphrase = prompt(langData.modalPhrasePromt);
            let password = await decryptPassword(getSettings().password, passphrase);

            if (password != null) {
                document.getElementById('modalInputPassword').value = password;
            } else {
                alert(langData.modalPhraseWrong);
            }
        }
    });

    const togglePasswordButton = document.getElementById('togglePassword');
    togglePasswordButton.addEventListener('click', () => {
        const passwordInput = document.getElementById('modalInputPassword');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordButton.innerHTML = '🙉';
        } else {
            passwordInput.type = 'password';
            togglePasswordButton.innerHTML = '🙈';
        }
    });

    const modalButtonSave = document.getElementById('modalButtonSave');
    modalButtonSave.addEventListener('click', async () => {
        const cLang = getCurrentLang();
        const langData = await getLangData(cLang);

        const set = getSettings();
        const email = document.getElementById('modalInputMail').value;
        const password = document.getElementById('modalInputPassword').value;

        if (email === '' && password === '') {
            alert(langData.modalEmptyFields);
            return;
        }

        set.email = email;
        set.password = '';

        if (password != '') {
            let passphrase = prompt(langData.modalPhrasePromtE);

            while (passphrase == null || passphrase == '') {
                passphrase = prompt(langData.modalPhrasePromtE);
            }

            let encryptedPassword = await encryptPassword(password, passphrase);
            set.password = encryptedPassword;
        }

        setSettings(set);

        document.getElementById('modalInputMail').value = '';
        document.getElementById('modalInputPassword').value = '';
        document.getElementById('modalOverlay').classList.remove('active');
    });

    const modalButtonCancel = document.getElementById('modalButtonCancel');
    modalButtonCancel.addEventListener('click', () => {
        document.getElementById('modalInputMail').value = '';
        document.getElementById('modalInputPassword').value = '';
        document.getElementById('modalOverlay').classList.remove('active');
    });

    const clearCacheButton = document.getElementById('clearCacheButton');
    clearCacheButton.addEventListener('click', () => {
        setCache(null);
        location.reload();
    });

    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', () => {
        setSettings(null);
        setCache(null);
        location.reload();
    });

    function wiggleMe() {
        appIcon.classList.add('wiggle');
        setTimeout(() => {
            appIcon.classList.remove('wiggle');
        }, 1500);

        setTimeout(wiggleMe, 6500);
    }

    wiggleMe();

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
            if (key == 'rephraseCheckboxLabel') {
                element.innerHTML += langData[key];
            } else if (key == 'comingSoonCheckboxLabel') {
                element.innerHTML += langData[key];
            } else {
                element.innerText = langData[key];
            }
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

/**
 * Gets the current tab's URL.
 * @returns {Promise<string>} The URL of the current tab.
 */
function getCurrentTabUrl() {
    // Define a helper that performs the query
    function queryTabs(callback) {
        // Check if the 'chrome' namespace exists, which is used by Chrome
        if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
            chrome.tabs.query({ active: true, currentWindow: true }, callback);
        }
        // Check if the 'browser' namespace exists, which is used by Firefox and some other browsers
        else if (typeof browser !== "undefined" && browser.tabs && browser.tabs.query) {
            browser.tabs.query({ active: true, currentWindow: true }).then(callback);
        } else {
            throw new Error("Browser does not support the 'tabs' API");
        }
    }

    return new Promise((resolve) => {
        queryTabs((tabs) => {
            if (tabs.length > 0) {
                resolve(tabs[0].url);
            } else {
                resolve(null);
            }
        });
    });
}