const defaultCache = {};

function getCache() {
    return JSON.parse(localStorage.getItem('cache')) || defaultCache;;
}

function setCache(cache) {
    if (cache === null) {
        localStorage.removeItem('cache');
        return;
    }

    localStorage.setItem('cache', JSON.stringify(cache));
}

export { getCache, setCache };