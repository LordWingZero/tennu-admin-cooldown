function add(hostname, command) {
    this.cache.push({
        'command': command,
        'hostname': hostname,
        'timestamp': new Date().getTime()
    });
}

function isExists(hostname, command) {
    var hits = this.cache.filter(function(cacheItem) {
        return (cacheItem.hostname === hostname && cacheItem.command == command);
    });
    if (hits.length > 0) {
        return hits[0];
    }
}

function isExpired(cacheItem, expiresAfterSeconds) {
    var nowTime = new Date().getTime();
    return (nowTime > this.expiresOn(cacheItem, expiresAfterSeconds));
}

function expiresOn(cacheItem, expiresAfterSeconds) {
    var timestamp = new Date(cacheItem.timestamp); // edit clone
    return timestamp.setSeconds(timestamp.getSeconds() + expiresAfterSeconds);
}

function reset(cacheItem) {
    cacheItem.timestamp = new Date();
}

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

module.exports = cacheModule;