var Promise = require("bluebird");
var moment = require('moment');
var format = require('util').format;

var AdminCooldown = {
    requiresRoles: ['admin'],
    role: "cooldown",
    init: function(client, imports) {

        var plugins = client.config("plugins");
        if (plugins[0] !== 'admin' && plugins[1].indexOf('cooldown') === -1) {
            client._logger.warn('tennu-cooldown: it is highly recommended tennu-admin and tennu-cooldown be the first two plugins in your config.');
        }

        const get = function(cooldownTime) {

            var cache = require('./cache')([]);

            return function(hostmask) {
                return Promise.try(function() {
                    return imports.admin.isAdmin(hostmask);
                }).then(function(isadmin) {

                    // Admin override
                    if (isadmin) {
                        return;
                    }

                    // Search for an object in cache
                    var cacheHit = cache.isExists(hostmask.hostname);
                    if (!cacheHit) {
                        cache.add(hostmask.hostname);
                        return;
                    }

                    if (!cache.isExpired(cacheHit, cooldownTime)) {
                        var errorMsg = format('Command ready again %s', new moment(cache.expiresOn(cacheHit, cooldownTime)).from(moment()));
                        throw new Error(errorMsg);
                    }

                    cache.reset(cacheHit);
                });
            }
        }

        return {
            exports: get,
        }
    }
};

module.exports = AdminCooldown;