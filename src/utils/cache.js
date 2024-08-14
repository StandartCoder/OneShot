/**
 * Retrieves the cache data from local storage. If no cache is found, it returns an empty object.
 * 
 * @returns {Object} The cache data as an object or an empty object if nothing is cached.
 */
function getCache() {
    // Retrieve the 'cache' item from local storage and parse it as JSON
    const cacheData = localStorage.getItem('cache');
    
    // Return the parsed cache if available, otherwise return an empty object
    return cacheData ? JSON.parse(cacheData) : {};
}

/**
 * Saves or updates the cache data in local storage. If the cache object is explicitly set to null,
 * it removes the cache from local storage.
 * 
 * @param {Object|null} cache - The cache object to be saved, or null to clear the cache.
 */
function setCache(cache) {
    if (cache === null) {
        // If the cache is explicitly set to null, remove 'cache' from local storage
        localStorage.removeItem('cache');
    } else {
        // Convert the cache object to a JSON string and store it in local storage
        localStorage.setItem('cache', JSON.stringify(cache));
    }
}

// Export functions for external usage
export { getCache, setCache };
