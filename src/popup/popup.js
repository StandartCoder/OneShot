import { getCache, setCache } from '../utils/cache.js';
import { getSettings, setSettings } from '../utils/settings.js';
import { getThemeData, setTheme, getTheme } from '../utils/theme.js';
import { getLangData, getCurrentLang, listLangs, setLang } from '../utils/lang.js';

document.addEventListener('DOMContentLoaded', async function () {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        
            contents.forEach(content => {
                content.classList.remove('active');
                if(content.id === tab.dataset.tab) {
                    content.classList.add('active');
                }
            });

            settingsPage.classList.remove('active');
        });
    });

    setTimeout(async () => {
        let checkIfOnRightSite = false;

        const getCurrentTabUrl = () => {
            return new Promise((resolve) => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        resolve(tabs[0].url);
                    } else {
                        resolve(null);
                    }
                });
            });
        };

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

        document.getElementById('loaderOverlay').classList.remove('active');
    }, 750);
});
