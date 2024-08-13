import { getSettings, setSettings } from "./settings.js";
import config from "../config.js";

function setTheme(theme) {
    let settings = getSettings();
    settings.theme = theme;
    setSettings(settings);
}

function getCurrentTheme() {
    let settings = getSettings();
    return settings.theme;
}

function getThemeData(theme) {
    return config.themes[theme];
}

export { setTheme, getCurrentTheme, getThemeData };