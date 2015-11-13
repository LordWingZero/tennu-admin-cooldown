var moment = require('moment');

var AdminCooldown = {
    requiresRoles: ['admin'],
    role: "admin-cooldown",
    init: function(client, imports) {

        client._logger.notice('Cooldowns enabled.');

        var cachedHosts = [];

        const isAdmin = function(hostmask, callerPluginName) {
            var now = new Date();
            return imports.admin.isAdmin(hostmask).then(function(isadmin) {
                if (!isadmin) {
                    // if we cant find a cooldown specified, warn and leave
                    var cooldownTime = client.config(callerPluginName).cooldown;
                    var cacheHit = false;
                    for (var i = cachedHosts.length; i--;) {
                        if(cachedHosts[i].hostname === hostmask.hostname)
                        {
                            cacheHit = cachedHosts[i];
                        }
                    }
                    if (cacheHit) {
                        var timestamp = new Date(cacheHit.timestamp);
                        var expiresOn = timestamp.setSeconds(timestamp.getSeconds() + cooldownTime);
                        var nowTime = now.getTime();
                        if (nowTime > expiresOn) {
                            cacheHit.timestamp = now;
                            return true;
                        }
                        else {
                            client.notice(hostmask.nickname, 'Command ready again ' + new moment(expiresOn).from(new moment(nowTime)));
                            return false;
                        }
                    }
                    else {
                        cachedHosts.push({
                            "hostname": hostmask.hostname,
                            "timestamp": now
                        });
                        return true;
                    }
                }

                return isadmin;
            });
        };
        
        // Untested
        const requiresAdmin = function (fn) {
            return function (command) {
                return isAdmin(command.hostmask)
                .then(function (isAdmin) {
                    if (isAdmin) {
                        return fn(command);
                    } else {
                        return 'Cooldown in progress.';
                    }
                });
            };
        };

        return {
            exports: {
                isAdmin: isAdmin,
                requiresAdmin: requiresAdmin
            },
        }
    }
};

module.exports = AdminCooldown;