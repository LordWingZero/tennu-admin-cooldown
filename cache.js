var cacheModule = function(cache) {
    return {
        cache: cache,
        add: add,
        isExists: isExists,
        isExpired: isExpired,
        expiresOn: expiresOn,
        reset: reset
    };
}

function add(hostname) {
    this.cache.push({
        "hostname": hostname,
        "timestamp": new Date().getTime()
    });
}

function isExists (hostname) {
    var hits = this.cache.filter(function(cacheItem) {
        return (cacheItem.hostname === hostname);
    });
    if (hits) {
        return hits[0];
    }
}

function isExpired (cacheItem, expiresAfterSeconds) {
    var nowTime = new Date().getTime();
    return (nowTime > this.expiresOn (cacheItem, expiresAfterSeconds));
}

function expiresOn (cacheItem, expiresAfterSeconds) {
    var timestamp = new Date(cacheItem.timestamp); // edit clone
    return timestamp.setSeconds(timestamp.getSeconds() + expiresAfterSeconds);
}

function reset (cacheItem) {
    cacheItem.timestamp = new Date();
}

module.exports = cacheModule;