import { getSettings, setSettings } from "./settings.js";
import config from "../config.js";

function setTheme(theme) {
    let settings = getSettings();
    settings.theme = theme;
    setSettings(settings);
}

function getTheme() {
    let settings = getSettings();
    return settings.theme;
}

function getThemeData() {
    return config.themes[getTheme()];
}

export { setTheme, getTheme, getThemeData };