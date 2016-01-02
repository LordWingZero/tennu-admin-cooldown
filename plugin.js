var Promise = require("bluebird");
var format = require('util').format;
var moment = require('moment');
var _ = require('lodash');
var cache = require('./lib/cache')([]);
var errors = require('./lib/errors');

var AdminCooldown = {
    requiresRoles: ['admin'],
    role: "cooldown",
    init: function(client, imports) {

        var cooldownConfig = client.config("cooldown");

        // Configuration validation
        if (!cooldownConfig || !cooldownConfig.hasOwnProperty('cooldown-commands')) {
            throw Error('[ tennu-cooldown: is missing its configuration ]');
        }
        
        if(cooldownConfig.hasOwnProperty('admin-commands') && !_.isArray(cooldownConfig['admin-commands'])){
            throw Error('[ tennu-cooldown: admin-commands must be an array of commands ]');
        }

        function handleCooldownCommand(hostmask, command, cooldownTime) {
            return Promise.try(function() {
                return imports.admin.isAdmin(hostmask);
            }).then(function(isadmin) {
                // Admin override
                if (isadmin) {
                    return;
                }

                // Search for an object in cache
                var cacheHit = cache.isExists(hostmask.hostname, command);
                if (!cacheHit) {
                    cache.add(hostmask.hostname, command);
                    return;
                }

                if (!cache.isExpired(cacheHit, cooldownTime)) {
                    var timetill = new moment(cache.expiresOn(cacheHit, cooldownTime)).from(moment());
                    throw errors.CommandNotReadyError({
                        'timetill': timetill,
                        'command': command
                    });
                }

                cache.reset(cacheHit);
            });
        }

        return {
            commandMiddleware: function(command) {

                // Is the command defined in the config under 'admin-commands'?
                var forcedAdminConfigOption = _.get(cooldownConfig, 'admin-commands', false);
                if (forcedAdminConfigOption) {
                    var forcedAdminCommand = forcedAdminConfigOption.indexOf(command.command);
                    if (forcedAdminCommand > -1) {
                        return Promise.try(function() {
                            return imports.admin.isAdmin(command.hostmask);
                        }).then(function(result) {
                            if (result) {
                                return command;
                            }
                            client._logger.notice(format('tennu-cooldown: %s tried to run user-defined admin command: %s', command.nickname, command.command));
                            return {
                                intent: 'notice',
                                query: true,
                                message: 'Command requires admin privilege'
                            }

                        });
                    }
                }

                // Is the command defined in the config under 'cooldown-commands'?
                var commandCooldownTime = _.get(cooldownConfig, ['cooldown-commands', command.command], false);
                if (commandCooldownTime) {
                    return Promise.try(function() {
                        return handleCooldownCommand(command.hostmask, command.command, commandCooldownTime);
                    }).then(function(result) {
                        if (_.isUndefined(result)) {
                            return command;
                        }
                    }).catch(function(err) {
                        if (err.type === 'cooldown.commandnotready') {
                            return {
                                intent: 'notice',
                                query: true,
                                message: err.message
                            }
                        }
                    });
                }

                // command is not our problem...
                return command;
            }
        }
    }
};

module.exports = AdminCooldown;